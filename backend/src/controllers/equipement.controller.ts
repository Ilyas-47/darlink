import { Request, Response } from 'express';
import { prisma } from '../config/db';

export const listEquipements = async (_req: Request, res: Response) => {
  try {
    const items = await prisma.equipement.findMany({ orderBy: { nom: 'asc' } });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des équipements' });
  }
};
