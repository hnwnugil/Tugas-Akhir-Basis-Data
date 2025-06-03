import express from 'express';
import { getAll, getById, create, update, deleteMap } from '../controller/mapsController.js';
import { 
    validateCreateMap, 
    validateUpdateMap,
    validateObjectId 
} from '../middleware/validation.js';

const router = express.Router();

router.get('/', getAll);
router.get('/:mapId', validateObjectId('mapId'), getById);
router.post('/create', validateCreateMap, create);
router.put('/:mapId', validateUpdateMap, update);
router.delete('/:mapId', validateObjectId('mapId'), deleteMap);

router.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

export default router;
