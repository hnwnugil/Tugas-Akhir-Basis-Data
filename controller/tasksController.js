import { Tasks } from '../model/tasksModel.js';
import { Maps } from '../model/mapsModel.js';

export const getAll = async (req, res) => {
    try {
        const tasks = await Tasks.find().populate('maps');
        res.status(200).json(tasks);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export const getById = async (req, res) => {
    try {
        const { taskId } = req.params;
        if (!taskId) {
            return res.status(400).json({
                message: "Task ID is required"
            });
        }
        const task = await Tasks.findById(taskId).populate('maps');
        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }
        res.status(200).json(task);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export const getByMap = async (req, res) => {
    try {
        const { mapId } = req.params;
        if (!mapId) {
            return res.status(400).json({
                message: "Map ID is required"
            });
        }
        
        const tasks = await Tasks.find({ maps: mapId }).populate('maps');
        res.status(200).json(tasks);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export const create = async (req, res) => {
    try {
        const { maps, taskKey, name, type, location } = req.body;
        
        if (!maps || !taskKey || !name || !type || !location) {
            return res.status(400).json({
                message: "All fields are required: maps, taskKey, name, type, location"
            });
        }

        // Validate type
        const validTypes = ['short', 'long', 'medium'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({
                message: "Invalid task type. Must be: short, long, or medium"
            });
        }

        // Verify map exists
        const map = await Maps.findById(maps);
        if (!map) {
            return res.status(404).json({
                message: "Map not found"
            });
        }

        // Check if task key already exists for this map
        const existingTask = await Tasks.findOne({ maps, taskKey });
        if (existingTask) {
            return res.status(400).json({
                message: "Task with this key already exists for this map"
            });
        }

        const newTask = new Tasks({
            maps,
            taskKey,
            name,
            type,
            location
        });

        const savedTask = await newTask.save();
        const populatedTask = await Tasks.findById(savedTask._id).populate('maps');
        res.status(201).json(populatedTask);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export const update = async (req, res) => {
    try {
        const { taskId } = req.params;
        const updates = req.body;

        if (!taskId) {
            return res.status(400).json({
                message: "Task ID is required"
            });
        }

        // Validate type if provided
        if (updates.type) {
            const validTypes = ['short', 'long', 'medium'];
            if (!validTypes.includes(updates.type)) {
                return res.status(400).json({
                    message: "Invalid task type. Must be: short, long, or medium"
                });
            }
        }

        const updatedTask = await Tasks.findByIdAndUpdate(
            taskId,
            updates,
            { new: true, runValidators: true }
        ).populate('maps');

        if (!updatedTask) {
            return res.status(404).json({
                message: "Task not found"
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

export const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        
        if (!taskId) {
            return res.status(400).json({
                message: "Task ID is required"
            });
        }

        const deletedTask = await Tasks.findByIdAndDelete(taskId);
        if (!deletedTask) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}
