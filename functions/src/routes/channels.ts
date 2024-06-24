import { Router } from 'express';
import { getAllOnlineUsers, getOnlineUsers, setOnlineUsers } from '../controllers/channels/channelController';

const router = Router();

router.post('/setOnlineUsers', setOnlineUsers);
router.get('/getOnlineUsers/:gameId/:channelId', getOnlineUsers);
router.get('/getAllOnlineUsers', getAllOnlineUsers);

export default router;
