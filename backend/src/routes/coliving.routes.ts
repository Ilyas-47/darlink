import express from 'express';
import { getAllColivings, getColivingById, getAvailableChambres } from '../controllers/coliving.controller';

const router = express.Router();

router.get('/available/search', getAvailableChambres);
router.get('/', getAllColivings);
router.get('/:id', getColivingById);

export default router;
