import express from 'express';
import { protect, authorize } from '../middlewares/auth.middleware';
import {
  listPendingColivings,
  updateColivingValidation,
  listUsersAdmin,
  listReservationsAdmin,
  getPlatformStatsAdmin,
  listPendingDocuments,
  moderateDocument,
} from '../controllers/admin.controller';
import { listAllRequestsAdmin } from '../controllers/documentRequest.controller';

const router = express.Router();

router.use(protect, authorize('ADMIN'));

router.get('/users', listUsersAdmin);
router.get('/colivings/pending', listPendingColivings);
router.patch('/colivings/:id/validation', updateColivingValidation);
router.get('/reservations', listReservationsAdmin);
router.get('/stats', getPlatformStatsAdmin);
router.get('/documents/pending', listPendingDocuments);
router.patch('/documents/:id/validation', moderateDocument);
router.get('/document-requests', listAllRequestsAdmin);

export default router;
