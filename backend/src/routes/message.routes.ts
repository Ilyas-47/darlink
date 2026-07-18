import { Router } from 'express';
import { sendMessage, getConversations, getMessages } from '../controllers/message.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.post('/', sendMessage);
router.get('/conversations', getConversations);
router.get('/:contactId', getMessages);

export default router;
