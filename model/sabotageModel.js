// filepath: c:\Users\hilmi\OneDrive - Politeknik Elektronika Negeri Surabaya\Kuliah PENS\Semester 2\Basis Data\Tugas Akhir\model\sabotageModel.js
import mongoose from "mongoose";

const sabotageSchema = new mongoose.Schema({
    maps: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Map',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export const Sabotage = mongoose.model('Sabotage', sabotageSchema);