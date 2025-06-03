import express from 'express';
import { getAll, getByGame, reportBody, emergencyMeeting } from '../controller/reportsController.js';
import { 
    validateCreateReport,
    validateObjectId 
} from '../middleware/validation.js';

const router = express.Router();

router.get('/', getAll);
router.get('/game/:gameId', validateObjectId('gameId'), getByGame);
router.post('/body', validateCreateReport, reportBody);
router.post('/emergency', validateCreateReport, emergencyMeeting);

router.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

export default router;
