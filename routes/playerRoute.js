import express from "express";
import { create, getAll, getByName, updateNameEmail, deletePlayer, updateCosmetics } from "../controller/playerController.js";
import { 
    validateCreatePlayer, 
    validateUpdatePlayer, 
    validateUpdateCosmetics,
    validateObjectId 
} from "../middleware/validation.js";

const router = express.Router();

router.post("/create", validateCreatePlayer, create);
router.get("/getAllPlayer", getAll); 
router.get("/getPlayer/:username", getByName);
router.put("/updateNameEmail/:id", validateUpdatePlayer, updateNameEmail);
router.delete("/deletePlayer/:id", validateObjectId('id'), deletePlayer);
router.put("/updateCosmetics/:id", validateUpdateCosmetics, updateCosmetics);
router.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});


export default router;