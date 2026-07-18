import express from 'express';
import { protect, authorize } from '../middlewares/auth.middleware';
import { createReservation, createPaiementAfterConfirmation, listMyReservations } from '../controllers/reservation.controller';

const router = express.Router();

router.post('/', protect, authorize('CLIENT'), createReservation);
router.post('/:id/paiement', protect, authorize('CLIENT'), createPaiementAfterConfirmation);
router.get('/me', protect, authorize('CLIENT'), listMyReservations);

export default router;
