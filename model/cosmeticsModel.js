import mongoose from "mongoose";

const cosmeticsSchema = new mongoose.Schema({
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    color: {
        type: String,
        required: true,
        enum: [
            "Red", "Blue", "Green", "Pink", "Orange", "Yellow", "Black", "White",
            "Purple", "Brown", "Cyan", "Lime", "Maroon", "Rose", "Banana"
        ],
        default: function() {
            const colors = [
                "Red", "Blue", "Green", "Pink", "Orange", "Yellow", "Black", "White",
                "Purple", "Brown", "Cyan", "Lime", "Maroon", "Rose", "Banana"
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }
    },
    hat: {
        type: String,
        default: ""
    },
    skin: {
        type: String,
        default: ""
    },
    pet: {
        type: String,
        default: ""
    }
});

export const Cosmetics = mongoose.model('Cosmetics', cosmeticsSchema);
