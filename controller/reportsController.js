import { Reports } from '../model/reportsModel.js';
import { Games } from '../model/gamesModel.js';
import { Player } from '../model/playerModel.js';

export const getAll = async (req, res) => {
    try {
        const reports = await Reports.find()
            .populate('gameId')
            .populate('reporterId');
        res.status(200).json(reports);
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
        
        const reports = await Reports.find({ gameId })
            .populate('gameId')
            .populate('reporterId');
        res.status(200).json(reports);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export const reportBody = async (req, res) => {
    try {
        const { gameId, reporterId, location } = req.body;
        
        if (!gameId || !reporterId || !location) {
            return res.status(400).json({
                message: "All fields are required: gameId, reporterId, location"
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
                message: "Bodies can only be reported during active games"
            });
        }

        // Verify reporter is still alive (in playerIds or impostorIds)
        const isAlive = [...game.playerIds, ...game.impostorIds].some(id => id.toString() === reporterId);
        if (!isAlive) {
            return res.status(400).json({
                message: "Dead players cannot report bodies"
            });
        }

        // Verify reporter exists
        const reporter = await Player.findById(reporterId);
        if (!reporter) {
            return res.status(404).json({
                message: "Reporter not found"
            });
        }

        // Create the report
        const newReport = new Reports({
            gameId,
            reporterId,
            type: 'bodyReported',
            location,
            reportedAt: new Date()
        });

        const savedReport = await newReport.save();

        // Change game status to voting
        await Games.findByIdAndUpdate(gameId, {
            status: 'voting'
        });

        const populatedReport = await Reports.findById(savedReport._id)
            .populate('gameId')
            .populate('reporterId');

        res.status(201).json(populatedReport);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export const emergencyMeeting = async (req, res) => {
    try {
        const { gameId, reporterId, location } = req.body;
        
        if (!gameId || !reporterId || !location) {
            return res.status(400).json({
                message: "All fields are required: gameId, reporterId, location"
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
                message: "Emergency meetings can only be called during active games"
            });
        }

        // Verify caller is still alive
        const isAlive = [...game.playerIds, ...game.impostorIds].some(id => id.toString() === reporterId);
        if (!isAlive) {
            return res.status(400).json({
                message: "Dead players cannot call emergency meetings"
            });
        }

        // Verify caller exists
        const caller = await Player.findById(reporterId);
        if (!caller) {
            return res.status(404).json({
                message: "Caller not found"
            });
        }

        // Create the emergency meeting report
        const newReport = new Reports({
            gameId,
            reporterId,
            type: 'emergencyMeeting',
            location,
            reportedAt: new Date()
        });

        const savedReport = await newReport.save();

        // Change game status to voting
        await Games.findByIdAndUpdate(gameId, {
            status: 'voting'
        });

        const populatedReport = await Reports.findById(savedReport._id)
            .populate('gameId')
            .populate('reporterId');

        res.status(201).json(populatedReport);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}
