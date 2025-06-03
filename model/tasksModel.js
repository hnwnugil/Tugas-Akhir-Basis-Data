import mongoose from "mongoose";

const tasksSchema = new mongoose.Schema({
    maps: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Maps',
        required: true
    },
    taskKey: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['short', 'long', 'medium'],
    },
    location: {
        type: String,
        required: true,
        trim: true
    }
});

export const Tasks = mongoose.model('Tasks', tasksSchema);