import express from "express";
import { 
    createSabotage, 
    getAllSabotages, 
    getSabotagesByMap, 
    getSabotageById, 
    updateSabotage, 
    deleteSabotage,
    triggerSabotage,
    resolveSabotage,
    getActiveSabotages,
    getGameSabotages
} from "../controller/sabotageController.js";
import { 
    validateCreateSabotage,
    validateUpdateSabotage,
    validateTriggerSabotage,
    validateObjectId 
} from "../middleware/validation.js";

const router = express.Router();

// Sabotage type management routes
router.post("/", validateCreateSabotage, createSabotage);
router.get("/", getAllSabotages);
router.get("/map/:mapId", validateObjectId('mapId'), getSabotagesByMap);
router.get("/:id", validateObjectId('id'), getSabotageById);
router.put("/:id", validateUpdateSabotage, updateSabotage);
router.delete("/:id", validateObjectId('id'), deleteSabotage);

// Game sabotage routes
router.post("/trigger", validateTriggerSabotage, triggerSabotage);
router.put("/resolve/:sabotageGameId", validateObjectId('sabotageGameId'), resolveSabotage);
router.get("/game/:gameId/active", validateObjectId('gameId'), getActiveSabotages);
router.get("/game/:gameId", validateObjectId('gameId'), getGameSabotages);

export default router;
