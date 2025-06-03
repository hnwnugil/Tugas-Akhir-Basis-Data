import express from 'express';
import { getAll, getById, getByMap, create, update, deleteTask } from '../controller/tasksController.js';
import { 
    validateCreateTask, 
    validateUpdateTask,
    validateObjectId 
} from '../middleware/validation.js';

const router = express.Router();

router.get('/', getAll);
router.get('/:taskId', validateObjectId('taskId'), getById);
router.get('/map/:mapId', validateObjectId('mapId'), getByMap);
router.post('/create', validateCreateTask, create);
router.put('/:taskId', validateUpdateTask, update);
router.delete('/:taskId', validateObjectId('taskId'), deleteTask);

router.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

export default router;
