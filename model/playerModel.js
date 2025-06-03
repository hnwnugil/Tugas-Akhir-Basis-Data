import mongoose from "mongoose";


const playersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    level: {
        type: Number,
        default: 1
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },    cosmetics: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cosmetics',
        required: true
    },
    stats: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Statistics',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, );

export const Player = mongoose.model('Player', playersSchema);

