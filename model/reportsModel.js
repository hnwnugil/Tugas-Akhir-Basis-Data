import mongoose from "mongoose";

const reportsSchema = new mongoose.Schema({
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Games',
        required: true
    },
    reporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['bodyReported', 'emergencyMeeting']
    },
    location: {
        type: String,
        required: true
    },
    reportedAt: {
        type: Date,
        default: Date.now
    }
});

export const Reports = mongoose.model('Reports', reportsSchema);
