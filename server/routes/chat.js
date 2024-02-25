import express from 'express';
import {
    createConversation, getConversationById, getConversationsByUserId, getUsersForConversation, sendMessage
} from '../controllers/chat.js';

import {
    protect,
} from '../middlewares/authMiddleware.js';
import multer from 'multer';

const router = express.Router();

// Protected Routes
router.use(protect);

router.get('/user-list', getUsersForConversation);
router.get('/conversation/all/:userId', getConversationsByUserId);
router.get('/conversation/:conversationId', getConversationById);
router.post('/create', createConversation);
router.post('/send/message', sendMessage);

export default router;
