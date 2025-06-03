import mongoose from "mongoose";

const meetingsSchema = new mongoose.Schema({
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Games',
        required: true 
    },
    triggerReportId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reports'
    },
    startedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    endedAt: {
        type: Date
    }
});

export const Meetings = mongoose.model('Meetings', meetingsSchema);
