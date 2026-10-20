import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/db';
import { TypeChambre } from '@prisma/client';

const chambreInput = z.object({
  id: z.coerce.number().int().positive().optional(),
  nom: z.string().min(1),
  description: z.string().optional(),
  capacitePersonnes: z.coerce.number().int().positive(),
  litsDisponibles: z.coerce.number().int().min(0),
  prixParMois: z.coerce.number().positive(),
  typeChambre: z.enum(['PRIVEE', 'PARTAGEE_DORTOIR']),
});

const createColivingSchema = z.object({
  titre: z.string().min(2),
  description: z.string().optional(),
  adresse: z.string().min(2),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  lienGoogleMap: z.string().optional(),
  regles: z.string().optional(),
  equipementIds: z.array(z.coerce.number().int().positive()).default([]),
  imageUrls: z.array(z.string().min(1)).min(1, 'Au moins une image'),
  chambres: z.array(chambreInput).min(1, 'Au moins une chambre'),
});

export const createColiving = async (req: Request, res: Response) => {
  try {
    const hoteUserId = req.user!.id;
    const parsed = createColivingSchema.parse(req.body);

    const hote = await prisma.hote.findUnique({ where: { userId: hoteUserId } });
    if (!hote) {
      return res.status(403).json({ error: 'Profil hôte introuvable' });
    }

    if (parsed.equipementIds.length > 0) {
      const equipements = await prisma.equipement.findMany({ where: { id: { in: parsed.equipementIds } } });
      if (equipements.length !== parsed.equipementIds.length) {
        return res.status(400).json({ error: 'Un ou plusieurs équipements sont invalides' });
      }
    }

    const lienGoogleMap =
      parsed.lienGoogleMap && parsed.lienGoogleMap.length > 0 ? parsed.lienGoogleMap : undefined;

    const coliving = await prisma.coliving.create({
      data: {
        hoteId: hote.userId,
        titre: parsed.titre,
        description: parsed.description,
        adresse: parsed.adresse,
        latitude: parsed.latitude,
        longitude: parsed.longitude,
        lienGoogleMap,
        regles: parsed.regles,
        statut: 'EN_ATTENTE',
        ...(parsed.equipementIds.length > 0 && {
          equipementLinks: {
            create: parsed.equipementIds.map((equipementId) => ({ equipementId })),
          },
        }),
        images: {
          create: parsed.imageUrls.map((url, idx) => ({
            url,
            isPrincipale: idx === 0,
            ordre: idx,
          })),
        },
        chambres: {
          create: parsed.chambres.map((c) => ({
            nom: c.nom,
            description: c.description,
            capacitePersonnes: c.capacitePersonnes,
            litsDisponibles: c.litsDisponibles,
            prixParMois: c.prixParMois,
            typeChambre: c.typeChambre as TypeChambre,
          })),
        },
      },
      include: { images: true, chambres: true, equipementLinks: { include: { equipement: true } } },
    });

    res.status(201).json({
      message:
        'Coliving créé et soumis pour validation. Un administrateur le publiera une fois approuvé.',
      coliving: {
        id: coliving.id,
        titre: coliving.titre,
        statut: coliving.statut,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création du coliving' });
  }
};

export const listMyColivings = async (req: Request, res: Response) => {
  try {
    const hoteUserId = req.user!.id;
    const hote = await prisma.hote.findUnique({ where: { userId: hoteUserId } });
    if (!hote) {
      return res.status(403).json({ error: 'Profil hôte introuvable' });
    }

    const list = await prisma.coliving.findMany({
      where: { hoteId: hote.userId },
      orderBy: { dateCreation: 'desc' },
      include: {
        images: { orderBy: { ordre: 'asc' }, take: 1 },
        chambres: true,
      },
    });

    res.json(
      list.map((c) => ({
        id: c.id,
        titre: c.titre,
        adresse: c.adresse,
        statut: c.statut,
        dateCreation: c.dateCreation,
        image: c.images[0]?.url ?? null,
        nbChambres: c.chambres.length,
        prixMin: c.chambres.length ? Math.min(...c.chambres.map((ch) => Number(ch.prixParMois))) : null,
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors du chargement de vos colivings' });
  }
};

const decisionSchema = z.object({
  decision: z.enum(['confirm', 'reject']),
});

export const listReservationsForHost = async (req: Request, res: Response) => {
  try {
    const hoteUserId = req.user!.id;
    const hote = await prisma.hote.findUnique({ where: { userId: hoteUserId } });
    if (!hote) {
      return res.status(403).json({ error: 'Profil hôte introuvable' });
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        chambre: { coliving: { hoteId: hote.userId } },
      },
      orderBy: { dateCreation: 'desc' },
      include: {
        client: {
          include: { user: { select: { nom: true, email: true, telephone: true, photoProfil: true } } },
        },
        chambre: {
          include: { coliving: { select: { id: true, titre: true } } },
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
        clientId: r.clientId,
        client: {
          nom: r.client.user.nom,
          email: r.client.user.email,
          telephone: r.client.user.telephone,
          photoProfil: r.client.user.photoProfil,
        },
        coliving: { id: r.chambre.coliving.id, titre: r.chambre.coliving.titre },
        chambre: { id: r.chambre.id, nom: r.chambre.nom },
        paiement: r.paiement
          ? { id: r.paiement.id, statut: r.paiement.statut, methode: r.paiement.methode }
          : null,
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors du chargement des réservations' });
  }
};

export const updateReservationDecision = async (req: Request, res: Response) => {
  try {
    const hostUserId = req.user!.id;
    const reservationId = parseInt(String(req.params.id), 10);
    if (Number.isNaN(reservationId)) {
      return res.status(400).json({ error: 'Identifiant invalide' });
    }

    const { decision } = decisionSchema.parse(req.body);

    const reservation = await prisma.reservation.findFirst({
      where: {
        id: reservationId,
        chambre: { coliving: { hoteId: hostUserId } },
      },
    });

    if (!reservation) {
      return res.status(404).json({ error: 'Réservation introuvable' });
    }

    if (reservation.statut !== 'EN_ATTENTE') {
      return res.status(400).json({ error: 'Cette réservation ne peut plus être modifiée' });
    }

    const statut = decision === 'confirm' ? 'CONFIRMEE' : 'ANNULEE';

    const updated = await prisma.reservation.update({
      where: { id: reservationId },
      data: { statut },
    });

    res.json({
      message: decision === 'confirm' ? 'Réservation confirmée' : 'Réservation refusée',
      reservation: { id: updated.id, statut: updated.statut },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
};

export const updateColiving = async (req: Request, res: Response) => {
  try {
    const hoteUserId = req.user!.id;
    const colivingId = parseInt(String(req.params.id), 10);
    if (Number.isNaN(colivingId)) {
      return res.status(400).json({ error: 'Identifiant invalide' });
    }

    const parsed = createColivingSchema.parse(req.body);

    const hote = await prisma.hote.findUnique({ where: { userId: hoteUserId } });
    if (!hote) {
      return res.status(403).json({ error: 'Profil hôte introuvable' });
    }

    const existing = await prisma.coliving.findFirst({
      where: { id: colivingId, hoteId: hote.userId },
    });
    if (!existing) {
      return res.status(404).json({ error: 'Coliving introuvable ou vous n\'en êtes pas le propriétaire' });
    }

    if (parsed.equipementIds.length > 0) {
      const equipements = await prisma.equipement.findMany({ where: { id: { in: parsed.equipementIds } } });
      if (equipements.length !== parsed.equipementIds.length) {
        return res.status(400).json({ error: 'Un ou plusieurs équipements sont invalides' });
      }
    }

    const lienGoogleMap =
      parsed.lienGoogleMap && parsed.lienGoogleMap.length > 0 ? parsed.lienGoogleMap : undefined;

    // Transaction pour mettre à jour la propriété, les équipements, images et chambres de manière sûre
    await prisma.$transaction(async (tx) => {
      // 1. Équipements
      await tx.colivingEquipement.deleteMany({ where: { colivingId } });
      if (parsed.equipementIds.length > 0) {
        await tx.colivingEquipement.createMany({
          data: parsed.equipementIds.map((equipementId) => ({
            colivingId,
            equipementId,
          })),
        });
      }

      // 2. Images
      await tx.image.deleteMany({ where: { colivingId } });
      if (parsed.imageUrls.length > 0) {
        await tx.image.createMany({
          data: parsed.imageUrls.map((url, idx) => ({
            colivingId,
            url,
            isPrincipale: idx === 0,
            ordre: idx,
          })),
        });
      }

      // 3. Gestion sécurisée des chambres (ne supprime pas les chambres ayant des réservations)
      const existingChambres = await tx.chambre.findMany({
        where: { colivingId },
        include: {
          _count: {
            select: { reservations: true },
          },
        },
      });

      const matchedChambreIds = new Set<number>();

      for (const c of parsed.chambres) {
        let matched = null;

        // Si un ID explicite est fourni et existe déjà pour ce coliving
        if (c.id) {
          matched = existingChambres.find((ec) => ec.id === c.id);
        }

        // Sinon, associer à une chambre existante non encore appariée
        if (!matched) {
          matched = existingChambres.find((ec) => !matchedChambreIds.has(ec.id));
        }

        if (matched) {
          matchedChambreIds.add(matched.id);
          await tx.chambre.update({
            where: { id: matched.id },
            data: {
              nom: c.nom,
              description: c.description,
              capacitePersonnes: c.capacitePersonnes,
              litsDisponibles: c.litsDisponibles,
              prixParMois: c.prixParMois,
              typeChambre: c.typeChambre as TypeChambre,
            },
          });
        } else {
          // Nouvelle chambre
          await tx.chambre.create({
            data: {
              colivingId,
              nom: c.nom,
              description: c.description,
              capacitePersonnes: c.capacitePersonnes,
              litsDisponibles: c.litsDisponibles,
              prixParMois: c.prixParMois,
              typeChambre: c.typeChambre as TypeChambre,
            },
          });
        }
      }

      // Supprimer les chambres retirées SEULEMENT si elles n'ont aucune réservation
      for (const ec of existingChambres) {
        if (!matchedChambreIds.has(ec.id)) {
          if (ec._count.reservations === 0) {
            await tx.chambre.delete({ where: { id: ec.id } });
          } else {
            // Conserver pour garantir l'intégrité référentielle des réservations existantes
            await tx.chambre.update({
              where: { id: ec.id },
              data: { litsDisponibles: 0 },
            });
          }
        }
      }

      // 4. Mettre à jour le coliving
      await tx.coliving.update({
        where: { id: colivingId },
        data: {
          titre: parsed.titre,
          description: parsed.description,
          adresse: parsed.adresse,
          ...(parsed.latitude !== undefined && { latitude: parsed.latitude }),
          ...(parsed.longitude !== undefined && { longitude: parsed.longitude }),
          lienGoogleMap,
          regles: parsed.regles,
          statut: 'EN_ATTENTE', // Soumis de nouveau pour approbation de l'admin
        },
      });
    });

    res.json({
      message: 'Coliving modifié avec succès et soumis pour nouvelle approbation.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la modification du coliving' });
  }
};
