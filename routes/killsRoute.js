import express from 'express';
import { getAll, getByGame, createKill, getKillsByPlayer } from '../controller/killsController.js';
import { 
    validateCreateKill,
    validateObjectId 
} from '../middleware/validation.js';

const router = express.Router();

router.get('/', getAll);
router.get('/game/:gameId', validateObjectId('gameId'), getByGame);
router.get('/player/:playerId', validateObjectId('playerId'), getKillsByPlayer);
router.post('/create', validateCreateKill, createKill);

router.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

export default router;
