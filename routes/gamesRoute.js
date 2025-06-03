import express from 'express';
import { create, editSettings, end, getAll, getById, start, checkWinCondition } from '../controller/gamesController.js';
import { 
    validateCreateGame, 
    validateUpdateGame,
    validateObjectId 
} from '../middleware/validation.js';

const router = express.Router();

router.get('/', getAll);
router.get('/:gameId', validateObjectId('gameId'), getById);
router.post('/create', validateCreateGame, create);
router.put('/:gameId/settings', validateUpdateGame, editSettings);
router.get('/start/:gameId', validateObjectId('gameId'), start);
router.get('/check-win/:gameId', validateObjectId('gameId'), checkWinCondition);
router.get('/end/:gameId', validateObjectId('gameId'), end);

router.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

export default router;