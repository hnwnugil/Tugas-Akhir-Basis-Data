import { Maps } from '../model/mapsModel.js';

export const getAll = async (req, res) => {
    try {
        const maps = await Maps.find();
        res.status(200).json(maps);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export const getById = async (req, res) => {
    try {
        const { mapId } = req.params;
        if (!mapId) {
            return res.status(400).json({
                message: "Map ID is required"
            });
        }
        const map = await Maps.findById(mapId);
        if (!map) {
            return res.status(404).json({
                message: "Map not found"
            });
        }
        res.status(200).json(map);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export const create = async (req, res) => {
    try {
        const { name, rooms } = req.body;
        
        if (!name || !rooms || !Array.isArray(rooms) || rooms.length === 0) {
            return res.status(400).json({
                message: "Name and rooms array are required"
            });
        }

        // Check if map already exists
        const existingMap = await Maps.findOne({ name });
        if (existingMap) {
            return res.status(400).json({
                message: "Map with this name already exists"
            });
        }

        const newMap = new Maps({
            name,
            rooms
        });

        const savedMap = await newMap.save();
        res.status(201).json(savedMap);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export const update = async (req, res) => {
    try {
        const { mapId } = req.params;
        const updates = req.body;

        if (!mapId) {
            return res.status(400).json({
                message: "Map ID is required"
            });
        }

        const updatedMap = await Maps.findByIdAndUpdate(
            mapId,
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedMap) {
            return res.status(404).json({
                message: "Map not found"
            });
        }

        res.status(200).json(updatedMap);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export const deleteMap = async (req, res) => {
    try {
        const { mapId } = req.params;
        
        if (!mapId) {
            return res.status(400).json({
                message: "Map ID is required"
            });
        }

        const deletedMap = await Maps.findByIdAndDelete(mapId);
        if (!deletedMap) {
            return res.status(404).json({
                message: "Map not found"
            });
        }

        res.status(200).json({
            message: "Map deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}
