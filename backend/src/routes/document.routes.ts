import { Router } from 'express';
import { uploadDocument, getMyDocuments } from '../controllers/document.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.post('/', uploadDocument);
router.get('/', getMyDocuments);

export default router;
