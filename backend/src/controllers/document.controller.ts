import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/db';

const uploadSchema = z.object({
  type: z.string(),
  fichier: z.string(), // URL or base64
});

export const uploadDocument = async (req: Request, res: Response) => {
  try {
    const { type, fichier } = uploadSchema.parse(req.body);

    const document = await prisma.document.create({
      data: {
        userId: req.user!.id,
        type,
        fichier,
        statut: 'EN_ATTENTE',
      },
    });

    res.status(201).json(document);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error('Erreur uploadDocument:', error);
    res.status(500).json({ error: "Erreur lors de l'ajout du document" });
  }
};

export const getMyDocuments = async (req: Request, res: Response) => {
  try {
    const documents = await prisma.document.findMany({
      where: { userId: req.user!.id },
      orderBy: { dateSoumission: 'desc' },
    });

    res.json(documents);
  } catch (error) {
    console.error('Erreur getMyDocuments:', error);
    res.status(500).json({ error: 'Erreur lors du chargement des documents' });
  }
};
