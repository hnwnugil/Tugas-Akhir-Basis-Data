import express from 'express';
import { getAll, getByGame, getByPlayer, assignTasks, updateTaskStatus } from '../controller/playerTasksController.js';
import { 
    validateAssignTasks,
    validateUpdateTaskStatus,
    validateObjectId 
} from '../middleware/validation.js';

const router = express.Router();

router.get('/', getAll);
router.get('/game/:gameId', validateObjectId('gameId'), getByGame);
router.get('/game/:gameId/player/:playerId', validateObjectId('gameId'), getByPlayer);
router.post('/assign/:gameId', validateAssignTasks, assignTasks);
router.put('/status/:taskId', validateUpdateTaskStatus, updateTaskStatus);

router.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

export default router;
