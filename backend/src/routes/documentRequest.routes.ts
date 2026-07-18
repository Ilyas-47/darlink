import { Router } from 'express';
import { 
  requestDocumentFromClient,
  listClientRequests,
  respondToRequest,
  validateClientDocument,
  listHostRequests
} from '../controllers/documentRequest.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);

// Hote actions
router.post('/request', authorize('HOTE'), requestDocumentFromClient);
router.get('/host-requests', authorize('HOTE'), listHostRequests);
router.patch('/:id/validate', authorize('HOTE'), validateClientDocument);

// Client actions
router.get('/my-requests', authorize('CLIENT'), listClientRequests);
router.post('/:id/respond', authorize('CLIENT'), respondToRequest);

export default router;
