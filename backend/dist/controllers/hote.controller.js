"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateColiving = exports.updateReservationDecision = exports.listReservationsForHost = exports.listMyColivings = exports.createColiving = void 0;
const zod_1 = require("zod");
const db_1 = require("../config/db");
const chambreInput = zod_1.z.object({
    nom: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    capacitePersonnes: zod_1.z.coerce.number().int().positive(),
    litsDisponibles: zod_1.z.coerce.number().int().min(0),
    prixParMois: zod_1.z.coerce.number().positive(),
    typeChambre: zod_1.z.enum(['PRIVEE', 'PARTAGEE_DORTOIR']),
});
const createColivingSchema = zod_1.z.object({
    titre: zod_1.z.string().min(2),
    description: zod_1.z.string().optional(),
    adresse: zod_1.z.string().min(2),
    latitude: zod_1.z.coerce.number().optional(),
    longitude: zod_1.z.coerce.number().optional(),
    lienGoogleMap: zod_1.z.string().optional(),
    regles: zod_1.z.string().optional(),
    equipementIds: zod_1.z.array(zod_1.z.coerce.number().int().positive()).default([]),
    imageUrls: zod_1.z.array(zod_1.z.string().min(1)).min(1, 'Au moins une image'),
    chambres: zod_1.z.array(chambreInput).min(1, 'Au moins une chambre'),
});
const createColiving = async (req, res) => {
    try {
        const hoteUserId = req.user.id;
        const parsed = createColivingSchema.parse(req.body);
        const hote = await db_1.prisma.hote.findUnique({ where: { userId: hoteUserId } });
        if (!hote) {
            return res.status(403).json({ error: 'Profil hôte introuvable' });
        }
        if (parsed.equipementIds.length > 0) {
            const equipements = await db_1.prisma.equipement.findMany({ where: { id: { in: parsed.equipementIds } } });
            if (equipements.length !== parsed.equipementIds.length) {
                return res.status(400).json({ error: 'Un ou plusieurs équipements sont invalides' });
            }
        }
        const lienGoogleMap = parsed.lienGoogleMap && parsed.lienGoogleMap.length > 0 ? parsed.lienGoogleMap : undefined;
        const coliving = await db_1.prisma.coliving.create({
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
                        typeChambre: c.typeChambre,
                    })),
                },
            },
            include: { images: true, chambres: true, equipementLinks: { include: { equipement: true } } },
        });
        res.status(201).json({
            message: 'Coliving créé et soumis pour validation. Un administrateur le publiera une fois approuvé.',
            coliving: {
                id: coliving.id,
                titre: coliving.titre,
                statut: coliving.statut,
            },
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la création du coliving' });
    }
};
exports.createColiving = createColiving;
const listMyColivings = async (req, res) => {
    try {
        const hoteUserId = req.user.id;
        const hote = await db_1.prisma.hote.findUnique({ where: { userId: hoteUserId } });
        if (!hote) {
            return res.status(403).json({ error: 'Profil hôte introuvable' });
        }
        const list = await db_1.prisma.coliving.findMany({
            where: { hoteId: hote.userId },
            orderBy: { dateCreation: 'desc' },
            include: {
                images: { orderBy: { ordre: 'asc' }, take: 1 },
                chambres: true,
            },
        });
        res.json(list.map((c) => ({
            id: c.id,
            titre: c.titre,
            adresse: c.adresse,
            statut: c.statut,
            dateCreation: c.dateCreation,
            image: c.images[0]?.url ?? null,
            nbChambres: c.chambres.length,
            prixMin: c.chambres.length ? Math.min(...c.chambres.map((ch) => Number(ch.prixParMois))) : null,
        })));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors du chargement de vos colivings' });
    }
};
exports.listMyColivings = listMyColivings;
const decisionSchema = zod_1.z.object({
    decision: zod_1.z.enum(['confirm', 'reject']),
});
const listReservationsForHost = async (req, res) => {
    try {
        const hoteUserId = req.user.id;
        const hote = await db_1.prisma.hote.findUnique({ where: { userId: hoteUserId } });
        if (!hote) {
            return res.status(403).json({ error: 'Profil hôte introuvable' });
        }
        const reservations = await db_1.prisma.reservation.findMany({
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
        res.json(reservations.map((r) => ({
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
        })));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors du chargement des réservations' });
    }
};
exports.listReservationsForHost = listReservationsForHost;
const updateReservationDecision = async (req, res) => {
    try {
        const hostUserId = req.user.id;
        const reservationId = parseInt(String(req.params.id), 10);
        if (Number.isNaN(reservationId)) {
            return res.status(400).json({ error: 'Identifiant invalide' });
        }
        const { decision } = decisionSchema.parse(req.body);
        const reservation = await db_1.prisma.reservation.findFirst({
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
        const updated = await db_1.prisma.reservation.update({
            where: { id: reservationId },
            data: { statut },
        });
        res.json({
            message: decision === 'confirm' ? 'Réservation confirmée' : 'Réservation refusée',
            reservation: { id: updated.id, statut: updated.statut },
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
};
exports.updateReservationDecision = updateReservationDecision;
const updateColiving = async (req, res) => {
    try {
        const hoteUserId = req.user.id;
        const colivingId = parseInt(String(req.params.id), 10);
        if (Number.isNaN(colivingId)) {
            return res.status(400).json({ error: 'Identifiant invalide' });
        }
        const parsed = createColivingSchema.parse(req.body);
        const hote = await db_1.prisma.hote.findUnique({ where: { userId: hoteUserId } });
        if (!hote) {
            return res.status(403).json({ error: 'Profil hôte introuvable' });
        }
        const existing = await db_1.prisma.coliving.findFirst({
            where: { id: colivingId, hoteId: hote.userId },
        });
        if (!existing) {
            return res.status(404).json({ error: 'Coliving introuvable ou vous n\'en êtes pas le propriétaire' });
        }
        if (parsed.equipementIds.length > 0) {
            const equipements = await db_1.prisma.equipement.findMany({ where: { id: { in: parsed.equipementIds } } });
            if (equipements.length !== parsed.equipementIds.length) {
                return res.status(400).json({ error: 'Un ou plusieurs équipements sont invalides' });
            }
        }
        const lienGoogleMap = parsed.lienGoogleMap && parsed.lienGoogleMap.length > 0 ? parsed.lienGoogleMap : undefined;
        // Transaction pour mettre à jour la propriété, vider les anciens équipements/images et recréer
        await db_1.prisma.$transaction([
            db_1.prisma.colivingEquipement.deleteMany({ where: { colivingId } }),
            db_1.prisma.image.deleteMany({ where: { colivingId } }),
            db_1.prisma.chambre.deleteMany({ where: { colivingId } }),
            db_1.prisma.coliving.update({
                where: { id: colivingId },
                data: {
                    titre: parsed.titre,
                    description: parsed.description,
                    adresse: parsed.adresse,
                    lienGoogleMap,
                    regles: parsed.regles,
                    statut: 'EN_ATTENTE', // Soumis de nouveau pour approbation de l'admin
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
                            typeChambre: c.typeChambre,
                        })),
                    },
                },
            }),
        ]);
        res.json({
            message: 'Coliving modifié avec succès et soumis pour nouvelle approbation.',
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la modification du coliving' });
    }
};
exports.updateColiving = updateColiving;
