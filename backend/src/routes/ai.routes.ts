import express from 'express';
import { protect } from '../middlewares/auth.middleware';
import { generateImage, getTemplates } from '../controllers/ai.controller';

const router = express.Router();

// Templates are public
router.get('/templates', getTemplates);

// Image generation requires authentication
router.post('/generate-image', protect, generateImage);

export default router;
