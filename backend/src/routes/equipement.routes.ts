import express from 'express';
import { listEquipements } from '../controllers/equipement.controller';

const router = express.Router();

router.get('/', listEquipements);

export default router;
