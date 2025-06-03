import express from 'express';
import { getAll, getByGame, startMeeting, endMeeting } from '../controller/meetingsController.js';
import { 
    validateCreateMeeting,
    validateObjectId 
} from '../middleware/validation.js';

const router = express.Router();

router.get('/', getAll);
router.get('/game/:gameId', validateObjectId('gameId'), getByGame);
router.post('/start', validateCreateMeeting, startMeeting);
router.put('/end/:meetingId', validateObjectId('meetingId'), endMeeting);

router.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

export default router;
