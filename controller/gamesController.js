import { Games } from '../model/gamesModel.js';
import { Player } from '../model/playerModel.js';
import { Maps } from '../model/mapsModel.js';
import { Statistics } from '../model/statisticsModel.js';

//never to copy function from another file

export const getAll = async (req, res) => {
    try {
        const games = await Games.find()
            .populate('maps')
            .populate('hostId')
            .populate('playerIds')
            .populate('impostorIds');
        res.status(200).json(games);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export const getById = async (req, res) => {
    try {
        const { gameId } = req.params;
        if (!gameId) {
            return res.status(400).json({
                message: "Game ID is required"
            });
        }
        const game = await Games.findById(gameId)
            .populate('maps')
            .populate('hostId')
            .populate('playerIds')
            .populate('impostorIds');
        if (!game) {
            return res.status(404).json({
                message: "Game not found"
            });
        }
        res.status(200).json(game);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export const create = async (req, res) => {
    try {
        const { maps, hostId, playerIds } = req.body;
        if (!maps || !hostId || !playerIds || playerIds.length === 0) {
            return res.status(400).json({
                message: "Maps, hostId and playerIds are required"
            });
        }
        const map = await Maps.findById(maps);
        if (!map) {
            return res.status(404).json({
                message: "Map not found"
            });
        }
        
        // Verify host is valid
        const host = await Player.findById(hostId);
        if (!host) {
            return res.status(404).json({
                message: "Host player not found"
            });
        }
        
        // Verify all players exist
        const playerDocs = await Player.find({ _id: { $in: playerIds } });
        if (playerDocs.length !== playerIds.length) {
            return res.status(404).json({
                message: "One or more players not found"
            });
        }
        
        // Create new game with default settings
        const newGame = new Games({
            maps: map._id,
            hostId: host._id,
            playerIds: playerDocs.map(player => player._id),
            settings: {}, // This will use all default values from the schema
            status: 'waiting'
        });
        const savedGame = await newGame.save();
        res.status(201).json(savedGame);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }   
}

export const editSettings = async (req, res) => {
    try {
        const { gameId } = req.params;
        const updates = req.body;

        if (!gameId || !updates) {
            return res.status(400).json({
                message: "Game ID and updates are required"
            });
        }
        
        // Convert the updates to a format where each key is prefixed with 'settings.'
        const settingsUpdates = {};
        Object.keys(updates).forEach(key => {
            settingsUpdates[`settings.${key}`] = updates[key];
        });
        
        // Find the game and update only the specified settings fields
        const updatedGame = await Games.findByIdAndUpdate(
            gameId,
            { $set: settingsUpdates },
            { new: true, runValidators: true }
        );
          if (!updatedGame) {
            return res.status(404).json({
                message: "Game not found"
            });
        }
          res.status(200).json(updatedGame);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}
//never to copy function from another file

export const start = async (req, res) => {
    try {
        const { gameId } = req.params;
        if (!gameId) {
            return res.status(400).json({
                message: "Game ID is required"
            });
        }
        const game = await Games.findById(gameId);
        if (!game) {
            return res.status(404).json({
                message: "Game not found"
            });
        }
        if (game.status !== 'waiting') {
            return res.status(400).json({
                message: "Game cannot be started, current status: " + game.status
            });
        }        // Update game status to 'in-progress'
        game.status = 'playing';
        game.startedAt = new Date(); // Set the start time
          // Randomly assign impostors based on the settings.impostors value
        const playerCount = game.playerIds.length;
        const impostorCount = Math.min(game.settings.impostors, playerCount - 1); 
        
        // Create a copy of playerIds array and shuffle it
        const shuffledPlayers = [...game.playerIds];
        for (let i = shuffledPlayers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledPlayers[i], shuffledPlayers[j]] = [shuffledPlayers[j], shuffledPlayers[i]]; 
        }
        
        // Reset impostorIds before assigning new ones
        game.impostorIds = []; 
        
        // Select the first N players as impostors
        const selectedImpostors = shuffledPlayers.slice(0, impostorCount);
        game.impostorIds = selectedImpostors;
        
        // Remove selected impostors from playerIds (so playerIds only contains crewmates)
        game.playerIds = game.playerIds.filter(playerId => 
            !selectedImpostors.some(impostorId => impostorId.toString() === playerId.toString())
        );
        
        const updatedGame = await game.save();
        res.status(200).json(updatedGame);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}



export const checkWinCondition = async (req, res) => {
    try {
        const { gameId } = req.params;
        
        if (!gameId) {
            return res.status(400).json({
                message: "Game ID is required"
            });
        }

        const game = await Games.findById(gameId);
        if (!game) {
            return res.status(404).json({
                message: "Game not found"
            });
        }

        if (game.status === 'finished') {
            return res.status(200).json({
                message: "Game already finished",
                winner: game.winner,
                game: game
            });
        }

        const crewmateCount = game.playerIds.length;
        const impostorCount = game.impostorIds.length;
        let winner = null;
        let gameFinished = false;

        // Check win conditions
        if (impostorCount === 0) {
            // All impostors eliminated - crewmates win
            winner = 'crewmate';
            gameFinished = true;
        } else if (impostorCount >= crewmateCount) {
            // Impostors equal or outnumber crewmates - impostors win
            winner = 'impostor';
            gameFinished = true;        } else {
            // Check if all tasks are completed (crewmate victory)
            const { PlayerTasks } = await import('../model/playerTasksModel.js');
            const totalTasks = await PlayerTasks.countDocuments({ 
                gameId: gameId,
                playerId: { $in: game.playerIds }
            });
            const completedTasks = await PlayerTasks.countDocuments({ 
                gameId: gameId,
                playerId: { $in: game.playerIds },
                status: 'finished'
            });

            if (totalTasks > 0 && completedTasks === totalTasks) {
                winner = 'crewmate';
                gameFinished = true;
            } else {
                // Check for critical sabotage failures (impostor victory)
                const { SabotageGame } = await import('../model/sabotageGameModel.js');
                const { Sabotage } = await import('../model/sabotageModel.js');
                
                const failedCriticalSabotage = await SabotageGame.findOne({
                    gameId: gameId,
                    status: 'failed'
                }).populate('sabotageId');

                if (failedCriticalSabotage && failedCriticalSabotage.sabotageId.type === 'critical') {
                    winner = 'impostor';
                    gameFinished = true;
                }
            }
        }        if (gameFinished) {
            // Update game status and winner
            game.status = 'finished';
            game.winner = winner;
            game.endedAt = new Date();
            
            // Merge all players back to playerIds
            game.playerIds = [...game.playerIds, ...game.impostorIds];
            game.impostorIds = [];
            
            await game.save();
            
            // Update player statistics after game ends
            await updateGameStatistics(gameId);
        }

        const populatedGame = await Games.findById(gameId)
            .populate('maps')
            .populate('hostId')
            .populate('playerIds')
            .populate('impostorIds');

        res.status(200).json({
            gameFinished,
            winner,
            crewmateCount,
            impostorCount,
            game: populatedGame
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export const end = async (req, res) => {
    try {
        const { gameId } = req.params;
        if (!gameId) {
            return res.status(400).json({
                message: "Game ID is required"
            });
        }
        const game = await Games.findById(gameId);
        if (!game) {
            return res.status(404).json({
                message: "Game not found"
            });
        }
        if (game.status !== 'playing') {
            return res.status(400).json({
                message: "Game cannot be ended, current status: " + game.status
            });
        }
        // Update game status to 'ended'
        game.status = 'finished';
        //transfer impstorIds to playerIds
        game.playerIds = [...game.playerIds, ...game.impostorIds];
        game.impostorIds = []; // Clear impostorIds
        game.endedAt = new Date(); // Set the end time
        const updatedGame = await game.save();

        // Update player statistics after game ends
        await updateGameStatistics(gameId);

        res.status(200).json(updatedGame);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

// Function to update player statistics after game ends
export const updateGameStatistics = async (gameId) => {
    try {
        const game = await Games.findById(gameId)
            .populate('playerIds')
            .populate('impostorIds');

        if (!game || game.status !== 'finished') {
            return false;
        }

        // Import necessary models for statistics calculation
        const { Kills } = await import('../model/killsModel.js');
        const { PlayerTasks } = await import('../model/playerTasksModel.js');
        const { Reports } = await import('../model/reportsModel.js');
        const { SabotageGame } = await import('../model/sabotageGameModel.js');

        // Get all players who participated in the game
        const allPlayers = [...game.playerIds, ...game.impostorIds];
        
        for (const playerId of allPlayers) {
            const playerStats = await Statistics.findOne({ player: playerId });
            if (!playerStats) continue; // Skip if no stats found

            // Basic game participation stats
            playerStats.gamesFinished += 1;

            // Determine if player was impostor in this game
            const wasImpostor = game.impostorIds.some(imp => imp._id.toString() === playerId.toString());
            
            if (wasImpostor) {
                playerStats.timesImpostor += 1;
                
                // Count kills performed by this impostor
                const killCount = await Kills.countDocuments({ 
                    gameId: gameId, 
                    killerId: playerId 
                });
                playerStats.impostorKills += killCount;

                // Check if impostor won
                if (game.winner === 'impostor') {
                    playerStats.gamesWon += 1;
                    playerStats.impostorWins += 1;
                }
            } else {
                playerStats.timesCrewmate += 1;
                
                // Count tasks completed by this crewmate
                const completedTasks = await PlayerTasks.countDocuments({
                    gameId: gameId,
                    playerId: playerId,
                    status: 'finished'
                });
                playerStats.tasksCompleted += completedTasks;

                // Check if all tasks were completed
                const totalTasks = await PlayerTasks.countDocuments({
                    gameId: gameId,
                    playerId: playerId
                });
                if (totalTasks > 0 && completedTasks === totalTasks) {
                    playerStats.allTasksCompleted += 1;
                }

                // Count bodies reported by this player
                const reportsCount = await Reports.countDocuments({
                    gameId: gameId,
                    reporterId: playerId
                });
                playerStats.bodiesReported += reportsCount;

                // Count sabotages fixed by this player (simplified)
                const sabotagesFixed = await SabotageGame.countDocuments({
                    gameId: gameId,
                    status: 'resolved'
                });
                // Note: This is simplified - in practice you'd track individual resolvers
                
                // Check if crewmate won
                if (game.winner === 'crewmate') {
                    playerStats.gamesWon += 1;
                    playerStats.crewmateWins += 1;
                    playerStats.crewmateStreak += 1;
                } else {
                    playerStats.crewmateStreak = 0; // Reset streak if lost
                }
            }

            // Save updated statistics
            await playerStats.save();
        }

        return true;
    } catch (error) {
        console.log('Error updating game statistics:', error.message);
        return false;
    }
};