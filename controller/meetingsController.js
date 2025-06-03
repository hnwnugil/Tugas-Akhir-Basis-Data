import { Meetings } from '../model/meetingsModel.js';
import { Reports } from '../model/reportsModel.js';
import { Games } from '../model/gamesModel.js';

export const getAll = async (req, res) => {
    try {
        const meetings = await Meetings.find()
            .populate('gameId')
            .populate('triggerReportId');
        res.status(200).json(meetings);
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
        
        const meetings = await Meetings.find({ gameId })
            .populate('gameId')
            .populate('triggerReportId');
        res.status(200).json(meetings);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export const startMeeting = async (req, res) => {
    try {
        const { gameId, triggerReportId } = req.body;
        
        if (!gameId) {
            return res.status(400).json({
                message: "Game ID is required"
            });
        }

        // Verify game exists and is in voting status
        const game = await Games.findById(gameId);
        if (!game) {
            return res.status(404).json({
                message: "Game not found"
            });
        }

        if (game.status !== 'voting') {
            return res.status(400).json({
                message: "Meetings can only be started when game is in voting status"
            });
        }

        // Verify report exists if provided
        if (triggerReportId) {
            const report = await Reports.findById(triggerReportId);
            if (!report) {
                return res.status(404).json({
                    message: "Trigger report not found"
                });
            }
        }

        // Create the meeting
        const newMeeting = new Meetings({
            gameId,
            triggerReportId: triggerReportId || null,
            startedAt: new Date()
        });

        const savedMeeting = await newMeeting.save();

        const populatedMeeting = await Meetings.findById(savedMeeting._id)
            .populate('gameId')
            .populate('triggerReportId');

        res.status(201).json(populatedMeeting);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export const endMeeting = async (req, res) => {
    try {
        const { meetingId } = req.params;
        
        if (!meetingId) {
            return res.status(400).json({
                message: "Meeting ID is required"
            });
        }

        const meeting = await Meetings.findById(meetingId);
        if (!meeting) {
            return res.status(404).json({
                message: "Meeting not found"
            });
        }

        if (meeting.endedAt) {
            return res.status(400).json({
                message: "Meeting has already ended"
            });
        }

        // End the meeting
        meeting.endedAt = new Date();
        await meeting.save();

        // Change game status back to playing
        await Games.findByIdAndUpdate(meeting.gameId, {
            status: 'playing'
        });

        const populatedMeeting = await Meetings.findById(meeting._id)
            .populate('gameId')
            .populate('triggerReportId');

        res.status(200).json(populatedMeeting);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}
