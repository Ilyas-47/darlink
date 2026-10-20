import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/db';
import { MethodePaiement } from '@prisma/client';

const createSchema = z.object({
  chambreId: z.coerce.number().int().positive(),
  dateDebut: z.string().min(1),
  dateFin: z.string().min(1),
  nombrePersonnes: z.coerce.number().int().positive(),
});

const paiementSchema = z.object({
  methode: z.enum(['VIREMENT', 'ESPECE', 'CARTE_BANCAIRE', 'PAYPAL']),
});

function nightsBetween(start: Date, end: Date) {
  const ms = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export const createReservation = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const body = createSchema.parse(req.body);

    const client = await prisma.client.findUnique({ where: { userId } });
    if (!client) {
      return res.status(403).json({ error: 'Réservé aux comptes client' });
    }

    const chambre = await prisma.chambre.findUnique({
      where: { id: body.chambreId },
      include: { coliving: true },
    });

    if (!chambre || chambre.coliving.statut !== 'VALIDE') {
      return res.status(404).json({ error: 'Chambre ou coliving non disponible' });
    }

    if (body.nombrePersonnes > chambre.capacitePersonnes) {
      return res.status(400).json({ error: 'Nombre de personnes supérieur à la capacité de la chambre' });
    }

    const dateDebut = new Date(body.dateDebut);
    const dateFin = new Date(body.dateFin);
    if (dateFin <= dateDebut) {
      return res.status(400).json({ error: 'La date de fin doit être après la date de début' });
    }

    const overlapping = await prisma.reservation.findMany({
      where: {
        chambreId: chambre.id,
        statut: { in: ['EN_ATTENTE', 'CONFIRMEE'] },
        AND: [{ dateDebut: { lt: dateFin } }, { dateFin: { gt: dateDebut } }],
      },
    });

    const totalBookedPersons = overlapping.reduce(
      (sum, r) => sum + r.nombrePersonnes,
      0
    );
    const capacity = Math.max(chambre.capacitePersonnes, chambre.litsDisponibles, 1);

    if (chambre.typeChambre === 'PRIVEE' && chambre.capacitePersonnes <= 1) {
      if (overlapping.length > 0) {
        return res.status(409).json({ error: 'Cette chambre privée n\'est plus disponible sur ces dates' });
      }
    } else {
      if (totalBookedPersons + body.nombrePersonnes > capacity) {
        const remaining = Math.max(0, capacity - totalBookedPersons);
        return res.status(409).json({
          error: `Capacité insuffisante sur ces dates (${remaining} place(s) disponible(s))`,
        });
      }
    }

    const nights = nightsBetween(dateDebut, dateFin);
    const prixMois = Number(chambre.prixParMois);
    const prixTotal = (prixMois * nights) / 30;

    const reservation = await prisma.reservation.create({
      data: {
        clientId: client.userId,
        chambreId: chambre.id,
        dateDebut,
        dateFin,
        nombrePersonnes: body.nombrePersonnes,
        prixTotal: prixTotal.toFixed(2),
        statut: 'EN_ATTENTE',
      },
    });

    res.status(201).json({
      message: 'Demande de réservation envoyée. L’hôte doit la confirmer avant paiement.',
      reservation,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création de la réservation' });
  }
};

export const createPaiementAfterConfirmation = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const reservationId = parseInt(String(req.params.id), 10);
    if (Number.isNaN(reservationId)) {
      return res.status(400).json({ error: 'Identifiant invalide' });
    }

    const { methode } = paiementSchema.parse(req.body);

    const client = await prisma.client.findUnique({ where: { userId } });
    if (!client) {
      return res.status(403).json({ error: 'Réservé aux comptes client' });
    }

    const reservation = await prisma.reservation.findFirst({
      where: { id: reservationId, clientId: client.userId },
      include: { paiement: true },
    });

    if (!reservation) {
      return res.status(404).json({ error: 'Réservation introuvable' });
    }

    if (reservation.statut !== 'CONFIRMEE') {
      return res.status(400).json({
        error: 'Le paiement n’est possible qu’après confirmation de l’hôte',
      });
    }

    if (reservation.paiement) {
      return res.status(400).json({ error: 'Un paiement est déjà enregistré pour cette réservation' });
    }

    const isOnlinePayment = methode === 'PAYPAL' || methode === 'CARTE_BANCAIRE';

    const paiement = await prisma.paiement.create({
      data: {
        reservationId: reservation.id,
        montant: reservation.prixTotal,
        methode: methode as MethodePaiement,
        statut: isOnlinePayment ? 'PAYE' : 'EN_ATTENTE',
      },
    });

    res.status(201).json({
      message: isOnlinePayment ? 'Paiement traité avec succès' : 'Paiement enregistré (en attente de traitement)',
      paiement,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l’enregistrement du paiement' });
  }
};

export const listMyReservations = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const client = await prisma.client.findUnique({ where: { userId } });
    
    if (!client) {
      return res.status(403).json({ error: 'Réservé aux comptes client' });
    }

    const reservations = await prisma.reservation.findMany({
      where: { clientId: client.userId },
      orderBy: { dateCreation: 'desc' },
      include: {
        chambre: {
          include: {
            coliving: {
              include: {
                images: { orderBy: { ordre: 'asc' }, take: 1 },
                hote: {
                  include: {
                    user: {
                      select: { id: true, nom: true },
                    },
                  },
                },
              },
            },
          },
        },
        paiement: true,
      },
    });

    res.json(
      reservations.map((r) => ({
        id: r.id,
        statut: r.statut,
        dateDebut: r.dateDebut,
        dateFin: r.dateFin,
        nombrePersonnes: r.nombrePersonnes,
        prixTotal: r.prixTotal,
        dateCreation: r.dateCreation,
        coliving: {
          id: r.chambre.coliving.id,
          titre: r.chambre.coliving.titre,
          adresse: r.chambre.coliving.adresse,
          image: r.chambre.coliving.images[0]?.url ?? null,
          hoteId: r.chambre.coliving.hote?.user?.id ?? r.chambre.coliving.hoteId,
          hoteNom: r.chambre.coliving.hote?.user?.nom ?? 'Hôte',
        },
        chambre: { id: r.chambre.id, nom: r.chambre.nom },
        paiement: r.paiement
          ? { id: r.paiement.id, statut: r.paiement.statut, methode: r.paiement.methode }
          : null,
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des réservations' });
  }
};
