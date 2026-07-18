"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableChambres = exports.createReservation = exports.getColivingById = exports.getAllColivings = void 0;
const db_1 = require("../config/db");
const getAllColivings = async (req, res) => {
    try {
        const colivings = await db_1.prisma.coliving.findMany({
            where: { statut: 'VALIDE' },
            include: {
                images: { orderBy: { ordre: 'asc' } },
                equipementLinks: { include: { equipement: true } },
                chambres: true,
                avis: true,
                hote: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                nom: true,
                                email: true,
                                photoProfil: true,
                            },
                        },
                    },
                },
            },
        });
        const formatted = colivings.map((col) => {
            const avis = col.avis;
            const moyenne = avis.length > 0 ? avis.reduce((a, b) => a + (b.note || 0), 0) / avis.length : 0;
            return {
                id: col.id,
                titre: col.titre,
                description: col.description,
                adresse: col.adresse,
                lienGoogleMap: col.lienGoogleMap,
                regles: col.regles,
                prixParMois: col.chambres.length > 0 ? Math.min(...col.chambres.map((c) => Number(c.prixParMois))) : 0,
                image: col.images[0]?.url || 'https://via.placeholder.com/400x300',
                images: col.images.map((img) => ({ url: img.url, isPrincipale: img.isPrincipale })),
                note: parseFloat(moyenne.toFixed(1)),
                reviews: avis.length,
                capacite: col.chambres.reduce((a, c) => a + c.capacitePersonnes, 0),
                equipements: col.equipementLinks.map((el) => el.equipement.nom),
                hote: {
                    id: col.hote.user.id,
                    nom: col.hote.user.nom,
                    email: col.hote.user.email,
                    photoProfil: col.hote.user.photoProfil,
                },
                chambres: col.chambres.map((c) => ({
                    id: c.id,
                    nom: c.nom,
                    description: c.description,
                    capacitePersonnes: c.capacitePersonnes,
                    litsDisponibles: c.litsDisponibles,
                    prixParMois: c.prixParMois,
                    typeChambre: c.typeChambre,
                })),
            };
        });
        res.json(formatted);
    }
    catch (error) {
        console.error('Erreur getAllColivings:', error);
        res.status(500).json({ error: 'Erreur', details: error.message });
    }
};
exports.getAllColivings = getAllColivings;
const getColivingById = async (req, res) => {
    try {
        const idStr = typeof req.params.id === 'string' ? req.params.id : String(req.params.id);
        const colivingId = parseInt(idStr || '0');
        const col = await db_1.prisma.coliving.findUnique({
            where: { id: colivingId },
            include: {
                images: { orderBy: { ordre: 'asc' } },
                equipementLinks: { include: { equipement: true } },
                chambres: true,
                activites: true,
                avis: {
                    include: {
                        client: {
                            include: {
                                user: { select: { nom: true, photoProfil: true } },
                            },
                        },
                    },
                },
                hote: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                nom: true,
                                email: true,
                                photoProfil: true,
                                telephone: true,
                            },
                        },
                    },
                },
            },
        });
        if (!col) {
            return res.status(404).json({ error: 'Non trouvé' });
        }
        const avis = col.avis;
        const moyenne = avis.length > 0 ? avis.reduce((a, b) => a + (b.note || 0), 0) / avis.length : 0;
        res.json({
            id: col.id,
            titre: col.titre,
            description: col.description,
            adresse: col.adresse,
            lienGoogleMap: col.lienGoogleMap,
            regles: col.regles,
            prixParMois: col.chambres.length > 0 ? Math.min(...col.chambres.map((c) => Number(c.prixParMois))) : 0,
            images: col.images.map((img) => ({ url: img.url, isPrincipale: img.isPrincipale })),
            note: parseFloat(moyenne.toFixed(1)),
            reviews: avis.length,
            capacite: col.chambres.reduce((a, c) => a + c.capacitePersonnes, 0),
            equipements: col.equipementLinks.map((el) => el.equipement.nom),
            activites: col.activites.map((a) => ({
                id: a.id,
                titre: a.titre,
                description: a.description,
                datePrevue: a.datePrevue,
                prixOptionnel: a.prixOptionnel,
                typeActivite: a.typeActivite,
            })),
            avis: avis.map((a) => ({
                id: a.id,
                note: a.note,
                commentaire: a.commentaire,
                dateCreation: a.dateCreation,
                client: {
                    nom: a.client.user.nom,
                    photoProfil: a.client.user.photoProfil,
                },
            })),
            hote: {
                id: col.hote.user.id,
                nom: col.hote.user.nom,
                email: col.hote.user.email,
                photoProfil: col.hote.user.photoProfil,
                telephone: col.hote.user.telephone,
            },
            chambres: col.chambres.map((c) => ({
                id: c.id,
                nom: c.nom,
                description: c.description,
                capacitePersonnes: c.capacitePersonnes,
                litsDisponibles: c.litsDisponibles,
                prixParMois: c.prixParMois,
                typeChambre: c.typeChambre,
            })),
        });
    }
    catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur' });
    }
};
exports.getColivingById = getColivingById;
const createReservation = async (req, res) => {
    try {
        const { clientId, chambreId, dateDebut, dateFin, nombrePersonnes } = req.body;
        const chambre = await db_1.prisma.chambre.findUnique({
            where: { id: chambreId },
        });
        if (!chambre) {
            return res.status(404).json({ error: 'Chambre non trouvée' });
        }
        const start = new Date(dateDebut);
        const end = new Date(dateFin);
        const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        const prixTotal = Number(chambre.prixParMois) * (nights / 30);
        const reservation = await db_1.prisma.reservation.create({
            data: {
                clientId,
                chambreId,
                dateDebut: start,
                dateFin: end,
                nombrePersonnes,
                prixTotal: prixTotal,
            },
        });
        res.status(201).json(reservation);
    }
    catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur' });
    }
};
exports.createReservation = createReservation;
const getAvailableChambres = async (req, res) => {
    try {
        const colivingIdStr = typeof req.query.colivingId === 'string' ? req.query.colivingId : String(req.query.colivingId);
        const dateDebutStr = typeof req.query.dateDebut === 'string' ? req.query.dateDebut : String(req.query.dateDebut);
        const dateFinStr = typeof req.query.dateFin === 'string' ? req.query.dateFin : String(req.query.dateFin);
        const colivingIdNum = parseInt(colivingIdStr || '0');
        const dateDebut = new Date(dateDebutStr || '');
        const dateFin = new Date(dateFinStr || '');
        const chambres = await db_1.prisma.chambre.findMany({
            where: {
                colivingId: colivingIdNum,
                reservations: {
                    none: {
                        AND: [{ dateDebut: { lt: dateFin } }, { dateFin: { gt: dateDebut } }],
                    },
                },
            },
        });
        res.json(chambres);
    }
    catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur' });
    }
};
exports.getAvailableChambres = getAvailableChambres;
