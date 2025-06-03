import express from 'express';
import { getAll, getByMeeting, castVote, getVoteResults, ejectPlayer } from '../controller/votesController.js';
import { 
    validateCreateVote,
    validateObjectId 
} from '../middleware/validation.js';

const router = express.Router();

router.get('/', getAll);
router.get('/meeting/:meetingId', validateObjectId('meetingId'), getByMeeting);
router.get('/results/:meetingId', validateObjectId('meetingId'), getVoteResults);
router.post('/cast', validateCreateVote, castVote);
router.post('/eject', validateCreateVote, ejectPlayer);

router.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

export default router;
