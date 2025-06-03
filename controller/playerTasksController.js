import { PlayerTasks } from '../model/playerTasksModel.js';
import { Games } from '../model/gamesModel.js';
import { Player } from '../model/playerModel.js';
import { Tasks } from '../model/tasksModel.js';

export const getAll = async (req, res) => {
    try {
        const playerTasks = await PlayerTasks.find()
            .populate('gameId')
            .populate('playerId')
            .populate('taskId');
        res.status(200).json(playerTasks);
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
        
        const playerTasks = await PlayerTasks.find({ gameId })
            .populate('gameId')
            .populate('playerId')
            .populate('taskId');
        res.status(200).json(playerTasks);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export const getByPlayer = async (req, res) => {
    try {
        const { gameId, playerId } = req.params;
        if (!gameId || !playerId) {
            return res.status(400).json({
                message: "Game ID and Player ID are required"
            });
        }
        
        const playerTasks = await PlayerTasks.find({ gameId, playerId })
            .populate('gameId')
            .populate('playerId')
            .populate('taskId');
        res.status(200).json(playerTasks);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export const assignTasks = async (req, res) => {
    try {
        const { gameId } = req.params;
        
        if (!gameId) {
            return res.status(400).json({
                message: "Game ID is required"
            });
        }

        const game = await Games.findById(gameId).populate('maps');
        if (!game) {
            return res.status(404).json({
                message: "Game not found"
            });
        }

        if (game.status !== 'playing') {
            return res.status(400).json({
                message: "Tasks can only be assigned to games in progress"
            });
        }

        // Get all tasks for this map
        const allTasks = await Tasks.find({ maps: game.maps._id });
        if (allTasks.length === 0) {
            return res.status(404).json({
                message: "No tasks found for this map"
            });
        }

        // Separate tasks by type
        const shortTasks = allTasks.filter(task => task.type === 'short');
        const longTasks = allTasks.filter(task => task.type === 'long');
        const mediumTasks = allTasks.filter(task => task.type === 'medium');

        const assignedTasks = [];
        
        // Get crewmates (playerIds in the game)
        const crewmates = game.playerIds;

        for (const playerId of crewmates) {
            const playerTaskList = [];

            // Assign short tasks
            const shuffledShort = [...shortTasks].sort(() => 0.5 - Math.random());
            for (let i = 0; i < Math.min(game.settings.shortTasks, shuffledShort.length); i++) {
                playerTaskList.push({
                    gameId: gameId,
                    playerId: playerId,
                    taskId: shuffledShort[i]._id,
                    status: 'pending'
                });
            }

            // Assign long tasks
            const shuffledLong = [...longTasks].sort(() => 0.5 - Math.random());
            for (let i = 0; i < Math.min(game.settings.longTasks, shuffledLong.length); i++) {
                playerTaskList.push({
                    gameId: gameId,
                    playerId: playerId,
                    taskId: shuffledLong[i]._id,
                    status: 'pending'
                });
            }

            // Assign common tasks (medium tasks that all players get)
            const shuffledMedium = [...mediumTasks].sort(() => 0.5 - Math.random());
            for (let i = 0; i < Math.min(game.settings.commonTasks, shuffledMedium.length); i++) {
                playerTaskList.push({
                    gameId: gameId,
                    playerId: playerId,
                    taskId: shuffledMedium[i]._id,
                    status: 'pending'
                });
            }

            assignedTasks.push(...playerTaskList);
        }

        // Save all assigned tasks
        const savedTasks = await PlayerTasks.insertMany(assignedTasks);
        
        // Populate the results
        const populatedTasks = await PlayerTasks.find({ 
            _id: { $in: savedTasks.map(task => task._id) } 
        })
            .populate('gameId')
            .populate('playerId')
            .populate('taskId');

        res.status(201).json(populatedTasks);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export const updateTaskStatus = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;

        if (!taskId || !status) {
            return res.status(400).json({
                message: "Task ID and status are required"
            });
        }

        const validStatuses = ['pending', 'on-progress', 'finished'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status. Must be: pending, on-progress, or finished"
            });
        }

        const updateData = { status };
        
        // Set timestamps based on status
        if (status === 'on-progress') {
            updateData.startedAt = new Date();
        } else if (status === 'finished') {
            updateData.completedAt = new Date();
        }

        const updatedTask = await PlayerTasks.findByIdAndUpdate(
            taskId,
            updateData,
            { new: true, runValidators: true }
        )
            .populate('gameId')
            .populate('playerId')
            .populate('taskId');

        if (!updatedTask) {
            return res.status(404).json({
                message: "Player task not found"
            });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}
