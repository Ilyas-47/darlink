import express from 'express';
import { protect, authorize } from '../middlewares/auth.middleware';
import {
  createColiving,
  listMyColivings,
  listReservationsForHost,
  updateReservationDecision,
  updateColiving,
} from '../controllers/hote.controller';

const router = express.Router();

router.use(protect, authorize('HOTE'));

router.post('/colivings', createColiving);
router.get('/colivings', listMyColivings);
router.put('/colivings/:id', updateColiving);
router.get('/reservations', listReservationsForHost);
router.patch('/reservations/:id', updateReservationDecision);

export default router;
