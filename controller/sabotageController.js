import { Sabotage } from "../model/sabotageModel.js";
import { SabotageGame } from "../model/sabotageGameModel.js";
import { Games } from "../model/gamesModel.js";
import { Maps } from "../model/mapsModel.js";
import { Player } from "../model/playerModel.js";

// Create a new sabotage type for a map
export const createSabotage = async (request, response) => {
    try {
        const { maps, name, type, location } = request.body;        // Validate map exists
        const mapExists = await Maps.findById(maps);
        if (!mapExists) {
            return response.status(404).json({ message: "Map not found" });
        }

        const newSabotage = {
            maps,
            name,
            type,
            location
        };

        const sabotage = await Sabotage.create(newSabotage);
        return response.status(201).json(sabotage);
    } catch (error) {
        console.log(error.message);
        response.status(500).json({ message: error.message });
    }
};

// Get all sabotage types
export const getAllSabotages = async (request, response) => {
    try {
        const sabotages = await Sabotage.find({}).populate('maps');
        return response.status(200).json({
            count: sabotages.length,
            data: sabotages
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).json({ message: error.message });
    }
};

// Get sabotages by map
export const getSabotagesByMap = async (request, response) => {
    try {
        const { mapId } = request.params;

        // Validate map exists        const mapExists = await Maps.findById(mapId);
        if (!mapExists) {
            return response.status(404).json({ message: "Map not found" });
        }

        const sabotages = await Sabotage.find({ maps: mapId }).populate('maps');
        return response.status(200).json({
            count: sabotages.length,
            data: sabotages
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).json({ message: error.message });
    }
};

// Get sabotage by ID
export const getSabotageById = async (request, response) => {
    try {
        const { id } = request.params;
        const sabotage = await Sabotage.findById(id).populate('maps');
        
        if (!sabotage) {
            return response.status(404).json({ message: "Sabotage not found" });
        }

        return response.status(200).json(sabotage);
    } catch (error) {
        console.log(error.message);
        response.status(500).json({ message: error.message });
    }
};

// Update sabotage
export const updateSabotage = async (request, response) => {
    try {
        const { id } = request.params;
        const { maps, name, type, location } = request.body;

        // If maps is being updated, validate it exists
        if (maps) {            const mapExists = await Maps.findById(maps);
            if (!mapExists) {
                return response.status(404).json({ message: "Map not found" });
            }
        }

        const result = await Sabotage.findByIdAndUpdate(id, request.body, { new: true }).populate('maps');

        if (!result) {
            return response.status(404).json({ message: "Sabotage not found" });
        }

        return response.status(200).json(result);
    } catch (error) {
        console.log(error.message);
        response.status(500).json({ message: error.message });
    }
};

// Delete sabotage
export const deleteSabotage = async (request, response) => {
    try {
        const { id } = request.params;
        const result = await Sabotage.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).json({ message: "Sabotage not found" });
        }

        return response.status(200).json({ message: "Sabotage deleted successfully" });
    } catch (error) {
        console.log(error.message);
        response.status(500).json({ message: error.message });
    }
};

// GAME SABOTAGE FUNCTIONS

// Trigger sabotage in a game (by impostor)
export const triggerSabotage = async (request, response) => {
    try {
        const { gameId, impostorId, sabotageId } = request.body;        // Validate game exists and is in progress
        const game = await Games.findById(gameId);
        if (!game) {
            return response.status(404).json({ message: "Game not found" });
        }

        if (game.status !== 'playing') {
            return response.status(400).json({ message: "Game is not in progress" });
        }

        // Validate impostor is in the game and is actually an impostor
        if (!game.impostors.includes(impostorId)) {
            return response.status(403).json({ message: "Player is not an impostor in this game" });
        }

        // Validate sabotage exists and is available for this map
        const sabotage = await Sabotage.findById(sabotageId);
        if (!sabotage) {
            return response.status(404).json({ message: "Sabotage not found" });
        }

        if (sabotage.maps.toString() !== game.maps.toString()) {
            return response.status(400).json({ message: "Sabotage not available for this map" });
        }

        // Check if there's already an active sabotage in this game
        const activeSabotage = await SabotageGame.findOne({ 
            gameId: gameId, 
            status: 'active' 
        });

        if (activeSabotage) {
            return response.status(400).json({ message: "Another sabotage is already active in this game" });
        }

        // Create the sabotage event
        const newSabotageGame = {
            gameId,
            impostorId,
            sabotageId,
            status: 'active',
            triggeredAt: new Date()
        };

        const sabotageGame = await SabotageGame.create(newSabotageGame);
        const populatedSabotage = await SabotageGame.findById(sabotageGame._id)
            .populate('gameId')
            .populate('impostorId')
            .populate('sabotageId');

        return response.status(201).json({
            message: "Sabotage triggered successfully",
            sabotage: populatedSabotage
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).json({ message: error.message });
    }
};

// Resolve sabotage (by crewmates)
export const resolveSabotage = async (request, response) => {
    try {
        const { sabotageGameId } = request.params;
        const { resolverId } = request.body;

        // Find the active sabotage
        const sabotageGame = await SabotageGame.findById(sabotageGameId)
            .populate('gameId')
            .populate('sabotageId');

        if (!sabotageGame) {
            return response.status(404).json({ message: "Sabotage event not found" });
        }

        if (sabotageGame.status !== 'active') {
            return response.status(400).json({ message: "Sabotage is not active" });
        }

        // Validate resolver is in the game and is not an impostor
        const game = sabotageGame.gameId;
        if (!game.players.includes(resolverId)) {
            return response.status(403).json({ message: "Player is not in this game" });
        }

        if (game.impostors.includes(resolverId)) {
            return response.status(403).json({ message: "Impostors cannot resolve sabotages" });
        }

        // Update sabotage status to resolved
        sabotageGame.status = 'resolved';
        sabotageGame.resolvedAt = new Date();
        await sabotageGame.save();

        const updatedSabotage = await SabotageGame.findById(sabotageGameId)
            .populate('gameId')
            .populate('impostorId')
            .populate('sabotageId');

        return response.status(200).json({
            message: "Sabotage resolved successfully",
            sabotage: updatedSabotage
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).json({ message: error.message });
    }
};

// Get active sabotages in a game
export const getActiveSabotages = async (request, response) => {
    try {
        const { gameId } = request.params;

        // Validate game exists
        const game = await Game.findById(gameId);
        if (!game) {
            return response.status(404).json({ message: "Game not found" });
        }

        const activeSabotages = await SabotageGame.find({ 
            gameId: gameId, 
            status: 'active' 
        })
        .populate('gameId')
        .populate('impostorId')
        .populate('sabotageId');

        return response.status(200).json({
            count: activeSabotages.length,
            data: activeSabotages
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).json({ message: error.message });
    }
};

// Get all sabotages in a game (history)
export const getGameSabotages = async (request, response) => {
    try {
        const { gameId } = request.params;

        // Validate game exists
        const game = await Game.findById(gameId);
        if (!game) {
            return response.status(404).json({ message: "Game not found" });
        }

        const sabotages = await SabotageGame.find({ gameId: gameId })
            .populate('gameId')
            .populate('impostorId')
            .populate('sabotageId')
            .sort({ triggeredAt: -1 });

        return response.status(200).json({
            count: sabotages.length,
            data: sabotages
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).json({ message: error.message });
    }
};

// Auto-fail sabotage after timeout (utility function)
export const failSabotage = async (sabotageGameId) => {
    try {
        const sabotageGame = await SabotageGame.findById(sabotageGameId);
        if (sabotageGame && sabotageGame.status === 'active') {
            sabotageGame.status = 'failed';
            sabotageGame.resolvedAt = new Date();
            await sabotageGame.save();
            
            // If critical sabotage fails, impostors might win
            // This would need to be integrated with the win condition checker
            return true;
        }
        return false;
    } catch (error) {
        console.log('Error failing sabotage:', error.message);
        return false;
    }
};
