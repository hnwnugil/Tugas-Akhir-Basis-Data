import mongoose from "mongoose";

const mapsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    rooms: {
        type: [String],
        required: true
    }
});

export const Maps = mongoose.model('Maps', mapsSchema);