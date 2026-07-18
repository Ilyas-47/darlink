import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/db';
import { logAction } from './audit.controller';
import { StatutValidation } from '@prisma/client';

const validationSchema = z.object({
  statut: z.enum(['VALIDE', 'REFUSE']),
});

export const listPendingColivings = async (_req: Request, res: Response) => {
  try {
    const colivings = await prisma.coliving.findMany({
      where: { statut: 'EN_ATTENTE' },
      orderBy: { dateCreation: 'asc' },
      include: {
        hote: {
          include: {
            user: { select: { id: true, nom: true, email: true, telephone: true } },
          },
        },
        chambres: true,
        images: { orderBy: { ordre: 'asc' } },
        equipementLinks: { include: { equipement: true } },
      },
    });

    const formatted = colivings.map((c) => ({
      id: c.id,
      titre: c.titre,
      description: c.description,
      adresse: c.adresse,
      statut: c.statut,
      dateCreation: c.dateCreation,
      hote: { nom: c.hote.user.nom, email: c.hote.user.email },
      prixMin: c.chambres.length
        ? Math.min(...c.chambres.map((ch) => Number(ch.prixParMois)))
        : null,
      nbChambres: c.chambres.length,
      image: c.images[0]?.url ?? null,
      equipements: c.equipementLinks.map((l) => l.equipement.nom),
    }));

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors du chargement des colivings en attente' });
  }
};

export const updateColivingValidation = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Identifiant invalide' });
    }

    const { statut } = validationSchema.parse(req.body);

    const existing = await prisma.coliving.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Coliving introuvable' });
    }

    if (existing.statut !== 'EN_ATTENTE') {
      return res.status(400).json({ error: 'Seuls les colivings en attente peuvent être modérés' });
    }

    const updated = await prisma.coliving.update({
      where: { id },
      data: { statut: statut as StatutValidation },
      include: {
        hote: { include: { user: { select: { nom: true, email: true } } } },
        chambres: true,
      },
    });

    await logAction(req.user!.id, 'ADMIN_VALIDATE_COLIVING', `Coliving ID ${id} statut mis à ${statut}`);

    res.json({
      message: statut === 'VALIDE' ? 'Coliving validé' : 'Coliving refusé',
      coliving: {
        id: updated.id,
        titre: updated.titre,
        statut: updated.statut,
        hote: updated.hote.user.nom,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la validation' });
  }
};

export const listUsersAdmin = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { dateCreation: 'desc' },
      take: 200,
      select: {
        id: true,
        nom: true,
        email: true,
        role: true,
        dateCreation: true,
        telephone: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors du chargement des utilisateurs' });
  }
};

export const listReservationsAdmin = async (_req: Request, res: Response) => {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: { dateCreation: 'desc' },
      include: {
        client: { include: { user: { select: { nom: true, email: true } } } },
        chambre: { include: { coliving: { include: { hote: { include: { user: { select: { nom: true } } } } } } } },
      },
    });

    const formatted = reservations.map(r => ({
      id: r.id,
      statut: r.statut,
      dateDebut: r.dateDebut,
      dateFin: r.dateFin,
      nombrePersonnes: r.nombrePersonnes,
      prixTotal: r.prixTotal,
      dateCreation: r.dateCreation,
      client: {
        nom: r.client.user.nom,
        email: r.client.user.email,
      },
      coliving: {
        titre: r.chambre.coliving.titre,
        hote: r.chambre.coliving.hote.user.nom,
      },
      chambre: {
        nom: r.chambre.nom,
      }
    }));

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors du chargement des réservations globales' });
  }
};

export const getPlatformStatsAdmin = async (_req: Request, res: Response) => {
  try {
    const [totalUsers, totalColivings, totalReservations, totalHosts, pendingColivings] = await Promise.all([
      prisma.user.count(),
      prisma.coliving.count(),
      prisma.reservation.count(),
      prisma.hote.count(),
      prisma.coliving.count({ where: { statut: 'EN_ATTENTE' } }),
    ]);

    const confirmedReservations = await prisma.reservation.findMany({
      where: { statut: 'CONFIRMEE' },
      select: { prixTotal: true },
    });

    const totalRevenue = confirmedReservations.reduce((sum, r) => sum + Number(r.prixTotal), 0);

    res.json({
      totalUsers,
      totalColivings,
      totalReservations,
      totalHosts,
      totalRevenue,
      pendingColivings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors du calcul des statistiques de la plateforme' });
  }
};

export const listPendingDocuments = async (_req: Request, res: Response) => {
  try {
    const documents = await prisma.document.findMany({
      where: { statut: 'EN_ATTENTE' },
      orderBy: { dateSoumission: 'asc' },
      include: {
        user: { select: { nom: true, email: true } },
      },
    });

    const formatted = documents.map(d => ({
      id: d.id,
      type: d.type,
      fichier: d.fichier,
      dateSoumission: d.dateSoumission,
      statut: d.statut,
      user: d.user.nom,
      email: d.user.email,
    }));

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors du chargement des documents en attente' });
  }
};

export const moderateDocument = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    const { statut } = validationSchema.parse(req.body); // uses existing validationSchema which checks for VALIDE/REFUSE

    const document = await prisma.document.update({
      where: { id },
      data: { statut: statut as StatutValidation },
    });

    await logAction(req.user!.id, 'ADMIN_VALIDATE_DOCUMENT', `Document ID ${id} statut mis à ${statut}`);

    res.json({ message: 'Document modéré avec succès', document });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la modération du document' });
  }
};
