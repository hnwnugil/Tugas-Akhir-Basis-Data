import { Kills } from '../model/killsModel.js';
import { Games } from '../model/gamesModel.js';
import { Player } from '../model/playerModel.js';

export const getAll = async (req, res) => {
    try {
        const kills = await Kills.find()
            .populate('gameId')
            .populate('killerId')
            .populate('victimId');
        res.status(200).json(kills);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export const getByGame = async (req, res) => {
    try {
        const { gameId } = req.params;
        if (!gameId) {
            return res.status(400).json({
                message: "Game ID is required"
            });
        }
        
        const kills = await Kills.find({ gameId })
            .populate('gameId')
            .populate('killerId')
            .populate('victimId');
        res.status(200).json(kills);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export const createKill = async (req, res) => {
    try {
        const { gameId, killerId, victimId, location } = req.body;
        
        if (!gameId || !killerId || !victimId || !location) {
            return res.status(400).json({
                message: "All fields are required: gameId, killerId, victimId, location"
            });
        }

        // Verify game exists and is in progress
        const game = await Games.findById(gameId);
        if (!game) {
            return res.status(404).json({
                message: "Game not found"
            });
        }

        if (game.status !== 'playing') {
            return res.status(400).json({
                message: "Kills can only be performed during active games"
            });
        }

        // Verify killer is an impostor
        const isImpostor = game.impostorIds.some(id => id.toString() === killerId);
        if (!isImpostor) {
            return res.status(403).json({
                message: "Only impostors can perform kills"
            });
        }

        // Verify victim is a crewmate (in playerIds)
        const isCrewmate = game.playerIds.some(id => id.toString() === victimId);
        if (!isCrewmate) {
            return res.status(400).json({
                message: "Victim must be a crewmate"
            });
        }

        // Verify both players exist
        const killer = await Player.findById(killerId);
        const victim = await Player.findById(victimId);
        
        if (!killer || !victim) {
            return res.status(404).json({
                message: "Killer or victim not found"
            });
        }

        // Create the kill record
        const newKill = new Kills({
            gameId,
            killerId,
            victimId,
            location,
            killedAt: new Date()
        });

        const savedKill = await newKill.save();

        // Remove victim from crewmates (playerIds)
        await Games.findByIdAndUpdate(gameId, {
            $pull: { playerIds: victimId }
        });

        const populatedKill = await Kills.findById(savedKill._id)
            .populate('gameId')
            .populate('killerId')
            .populate('victimId');

        res.status(201).json(populatedKill);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export const getKillsByPlayer = async (req, res) => {
    try {
        const { playerId } = req.params;
        if (!playerId) {
            return res.status(400).json({
                message: "Player ID is required"
            });
        }
        
        // Get kills where this player was the killer
        const kills = await Kills.find({ killerId: playerId })
            .populate('gameId')
            .populate('killerId')
            .populate('victimId');
        res.status(200).json(kills);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}
