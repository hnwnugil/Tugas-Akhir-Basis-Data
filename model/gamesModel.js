import mongoose from "mongoose";

const gameSettingsSchema = new mongoose.Schema({
    maxPlayers: {
        type: Number,
        required: true,
        default: 10
    },
    impostors: {
        type: Number,
        required: true,
        default: 2
    },
    killCooldown: {
        type: Number,
        required: true,
        default: 20
    },
    emergencyMeetings: {
        type: Number,
        required: true,
        default: 1
    },
    discussionTime: {
        type: Number,
        required: true,
        default: 30
    },
    votingTime: {
        type: Number,
        required: true,
        default: 60
    },
    playerSpeed: {
        type: Number,
        required: true,
        default: 1.0
    },
    crewmateVision: {
        type: Number,
        required: true,
        default: 1.0
    },
    impostorVision: {
        type: Number,
        required: true,
        default: 1.5
    },
    killDistance: {
        type: String,
        required: true,
        enum: ['Short', 'Medium', 'Long'],
        default: 'Medium'
    },
    visualTasks: {
        type: Boolean,
        required: true,
        default: true
    },
    confirmEjects: {
        type: Boolean,
        required: true,
        default: true
    },
    commonTasks: {
        type: Number,
        required: true,
        default: 2
    },
    longTasks: {
        type: Number,
        required: true,
        default: 1
    },
    shortTasks: {
        type: Number,
        required: true,
        default: 3
    }
});

const gamesSchema = new mongoose.Schema({
    maps: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Maps',
        required: true
    },
    hostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    settings: {
        type: gameSettingsSchema,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['waiting', 'playing', 'voting', 'finished'],
        default: 'waiting'
    },
    playerIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    }],
    impostorIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    }],
    startedAt: {
        type: Date
    },
    endedAt: {
        type: Date
    },
    winner: {
        type: String,
        enum: ['impostor', 'crewmate', 'tie']
    }
});

export const Games = mongoose.model('Games', gamesSchema);