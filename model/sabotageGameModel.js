import mongoose from "mongoose";

const sabotageGameSchema = new mongoose.Schema({
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    },
    impostorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    sabotageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sabotage',
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'resolved', 'failed'],
        default: 'resolved'
    },
    triggeredAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    resolvedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

export const SabotageGame = mongoose.model('SabotageGame', sabotageGameSchema);
