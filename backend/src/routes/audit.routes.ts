import { Router } from 'express';
import { getAuditLogs } from '../controllers/audit.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect, authorize('ADMIN'));
router.get('/', getAuditLogs);

export default router;
