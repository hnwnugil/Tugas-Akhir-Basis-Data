import mongoose from "mongoose";

const playerTasksSchema = new mongoose.Schema({
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Games',
        required: true
    },
    playerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tasks',
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'on-progress', 'finished'],
        default: 'pending'
    },
    startedAt: {
        type: Date
    },
    completedAt: {
        type: Date
    }
});

export const PlayerTasks = mongoose.model('PlayerTasks', playerTasksSchema);
