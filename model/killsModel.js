import mongoose from "mongoose";

const killsSchema = new mongoose.Schema({
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Games',
        required: true
    },
    killerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    victimId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    location: {
        type: String,
        required: true
    },
    killedAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});

export const Kills = mongoose.model('Kills', killsSchema);
