import mongoose from "mongoose";

const statisticsSchema = new mongoose.Schema({
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    gamesStarted: {
        type: Number,
        default: 0
    },
    gamesFinished: {
        type: Number,
        default: 0
    },
    gamesWon: {
        type: Number,
        default: 0
    },
    impostorWins: {
        type: Number,
        default: 0
    },
    crewmateWins: {
        type: Number,
        default: 0
    },
    timesImpostor: {
        type: Number,
        default: 0
    },
    timesCrewmate: {
        type: Number,
        default: 0
    },
    impostorKills: {
        type: Number,
        default: 0
    },
    bodiesReported: {
        type: Number,
        default: 0
    },
    emergenciesCalled: {
        type: Number,
        default: 0
    },
    tasksCompleted: {
        type: Number,
        default: 0
    },
    allTasksCompleted: {
        type: Number,
        default: 0
    },
    sabotagesFixed: {
        type: Number,
        default: 0
    },
    crewmateStreak: {
        type: Number,
        default: 0
    },
});

export const Statistics = mongoose.model('Statistics', statisticsSchema);
