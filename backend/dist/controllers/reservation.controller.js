"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMyReservations = exports.createPaiementAfterConfirmation = exports.createReservation = void 0;
const zod_1 = require("zod");
const db_1 = require("../config/db");
const createSchema = zod_1.z.object({
    chambreId: zod_1.z.coerce.number().int().positive(),
    dateDebut: zod_1.z.string().min(1),
    dateFin: zod_1.z.string().min(1),
    nombrePersonnes: zod_1.z.coerce.number().int().positive(),
});
const paiementSchema = zod_1.z.object({
    methode: zod_1.z.enum(['VIREMENT', 'ESPECE', 'CARTE_BANCAIRE', 'PAYPAL']),
});
function nightsBetween(start, end) {
    const ms = end.getTime() - start.getTime();
    return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}
const createReservation = async (req, res) => {
    try {
        const userId = req.user.id;
        const body = createSchema.parse(req.body);
        const client = await db_1.prisma.client.findUnique({ where: { userId } });
        if (!client) {
            return res.status(403).json({ error: 'Réservé aux comptes client' });
        }
        const chambre = await db_1.prisma.chambre.findUnique({
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
        const overlap = await db_1.prisma.reservation.findFirst({
            where: {
                chambreId: chambre.id,
                statut: { in: ['EN_ATTENTE', 'CONFIRMEE'] },
                AND: [{ dateDebut: { lt: dateFin } }, { dateFin: { gt: dateDebut } }],
            },
        });
        if (overlap) {
            return res.status(409).json({ error: 'Ces dates ne sont plus disponibles pour cette chambre' });
        }
        const nights = nightsBetween(dateDebut, dateFin);
        const prixMois = Number(chambre.prixParMois);
        const prixTotal = (prixMois * nights) / 30;
        const reservation = await db_1.prisma.reservation.create({
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
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la création de la réservation' });
    }
};
exports.createReservation = createReservation;
const createPaiementAfterConfirmation = async (req, res) => {
    try {
        const userId = req.user.id;
        const reservationId = parseInt(String(req.params.id), 10);
        if (Number.isNaN(reservationId)) {
            return res.status(400).json({ error: 'Identifiant invalide' });
        }
        const { methode } = paiementSchema.parse(req.body);
        const client = await db_1.prisma.client.findUnique({ where: { userId } });
        if (!client) {
            return res.status(403).json({ error: 'Réservé aux comptes client' });
        }
        const reservation = await db_1.prisma.reservation.findFirst({
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
        const paiement = await db_1.prisma.paiement.create({
            data: {
                reservationId: reservation.id,
                montant: reservation.prixTotal,
                methode: methode,
                statut: isOnlinePayment ? 'PAYE' : 'EN_ATTENTE',
            },
        });
        res.status(201).json({
            message: isOnlinePayment ? 'Paiement traité avec succès' : 'Paiement enregistré (en attente de traitement)',
            paiement,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de l’enregistrement du paiement' });
    }
};
exports.createPaiementAfterConfirmation = createPaiementAfterConfirmation;
const listMyReservations = async (req, res) => {
    try {
        const userId = req.user.id;
        const client = await db_1.prisma.client.findUnique({ where: { userId } });
        if (!client) {
            return res.status(403).json({ error: 'Réservé aux comptes client' });
        }
        const reservations = await db_1.prisma.reservation.findMany({
            where: { clientId: client.userId },
            orderBy: { dateCreation: 'desc' },
            include: {
                chambre: {
                    include: {
                        coliving: {
                            include: {
                                images: { orderBy: { ordre: 'asc' }, take: 1 },
                            }
                        }
                    }
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
            coliving: {
                id: r.chambre.coliving.id,
                titre: r.chambre.coliving.titre,
                adresse: r.chambre.coliving.adresse,
                image: r.chambre.coliving.images[0]?.url ?? null,
            },
            chambre: { id: r.chambre.id, nom: r.chambre.nom },
            paiement: r.paiement
                ? { id: r.paiement.id, statut: r.paiement.statut, methode: r.paiement.methode }
                : null,
        })));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des réservations' });
    }
};
exports.listMyReservations = listMyReservations;
