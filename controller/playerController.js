import mongoose from 'mongoose';
import { Player } from '../model/playerModel.js';
import { Cosmetics } from '../model/cosmeticsModel.js';
import { Statistics } from '../model/statisticsModel.js';

export const create = async (req, res) => {
    try {
        // Extract player data from request (only username and email required)
        const { username, email } = req.body;
        
        // Validate required fields
        if (!username || !email) {
            return res.status(400).json({
                message: "Username and email are required fields"
            });
        }
        
        // Check if player already exists
        const existingPlayer = await Player.findOne({ username });
        if (existingPlayer) {
            return res.status(400).json({
                message: "Player already exists"
            });
        }

        // Check if email already exists
        const existingEmail = await Player.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                message: "Email already in use"
            });
        }

        //create dummyid player
        const dummyId = new mongoose.Types.ObjectId();

        // Create cosmetics document with default values
        const cosmetics = new Cosmetics({
            player:  dummyId
        });
        
        // Create statistics document
        const statistics = new Statistics({
            player: dummyId 
        });

        const savedCosmetics = await cosmetics.save();
        const savedStatistics = await statistics.save();       
        const player = new Player({
            username,
            email,
            cosmetics: savedCosmetics._id,
            stats: savedStatistics._id,
        });

        const savedPlayer = await player.save();

        savedCosmetics.player = savedPlayer._id;
        savedStatistics.player = savedPlayer._id;

        await savedCosmetics.save();
        await savedStatistics.save();

        const populatedPlayer = await Player.findById(savedPlayer._id)
            .populate('cosmetics')
            .populate('stats');

        res.status(201).json(populatedPlayer);
    } catch (error) {  
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export const getAll = async (req, res) => {
    try {
        const players = await Player.find()
            .populate('cosmetics')
            .populate('stats');
        res.status(200).json(players);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export const getByName = async (req, res) => {
    try {
        const { username } = req.params;
        if (!username) {
            return res.status(400).json({
                message: "Username is required"
            });
        }
        const player = await Player.findOne({ username })
            .populate('cosmetics')
            .populate('stats');
        if (!player) {
            return res.status(404).json({
                message: "Player not found"
            });
        }
        res.status(200).json(player);
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export const updateNameEmail = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        
        // Check if player exists
        const player = await Player.findById(id);
        if (!player) {
            return res.status(404).json({
                message: "Player not found"
            });
        }
        // Validate required fields
        if (updates.username && !updates.email) {
            return res.status(400).json({
                message: "Email is required when updating username"
            });
        }
        if (updates.email && !updates.username) {
            return res.status(400).json({
                message: "Username is required when updating email"
            });
        }
        // Check if username already exists
        if (updates.username) {
            const existingPlayer = await Player.findOne({ username: updates.username });
            if (existingPlayer && existingPlayer._id.toString() !== id) {
                return res.status(400).json({
                    message: "Username already in use"
                });
            }
        }
        // Check if email already exists
        if (updates.email) {
            const existingEmail = await Player.findOne({ email: updates.email });
            if (existingEmail && existingEmail._id.toString() !== id) {
                return res.status(400).json({
                    message: "Email already in use"
                });
            }
        }
        // Update player
        const updatedPlayer = await Player.findByIdAndUpdate(id, updates, { new: true })
            .populate('cosmetics')
            .populate('stats');
        if (!updatedPlayer) {
            return res.status(404).json({
                message: "Player not found"
            });
        }
        res.status(200).json(updatedPlayer);
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export const deletePlayer = async (req, res) => {
    try {
        const id = req.params.id;
        const player = await Player.findOneAndDelete({ _id: id });
        if (!player) {
            return res.status(404).json({
                message: "Player not found"
            });
        }
        // Optionally, you can also delete associated cosmetics and statistics
        await Cosmetics.deleteOne({ player: id });
        await Statistics.deleteOne({ player: id });
        res.status(200).json({
            message: "Player deleted successfully"
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export const updateCosmetics = async (req, res) => {
    try {
        const id = req.params.id;
        const { color, hat, skin, pet } = req.body;
        if (!color) {
            return res.status(400).json({
                message: "Color is required"
            });
        }
        // Validate color
        const validColors = [
            "Red", "Blue", "Green", "Pink", "Orange", "Yellow", "Black", "White",
            "Purple", "Brown", "Cyan", "Lime", "Maroon", "Rose", "Banana"
        ];
        if (!validColors.includes(color)) {
            return res.status(400).json({
                message: "Invalid color"
            });
        }
        // Find player and update cosmetics
        const player = await Player.findById(id);
        if (!player) {
            return res.status(404).json({
                message: "Player not found"
            });
        }
        const cosmetics = await Cosmetics.findOneAndUpdate(
            { player: id },
            { color, hat, skin, pet },
            { new: true }
        ).populate('player');   
        if (!cosmetics) {
            return res.status(404).json({
                message: "Cosmetics not found"
            });
        }
        res.status(200).json(cosmetics);
    }  catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}