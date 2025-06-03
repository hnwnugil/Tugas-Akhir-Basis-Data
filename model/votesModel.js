import mongoose from "mongoose";

const votesSchema = new mongoose.Schema({
    meetingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meetings',
        required: true
    },
    voterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    votedForId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    },
    votedAt: {
        type: Date,
        default: Date.now
    }
});

export const Votes = mongoose.model('Votes', votesSchema);
