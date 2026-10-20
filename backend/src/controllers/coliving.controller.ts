import { Request, Response } from 'express';
import { prisma } from '../config/db';

export const getAllColivings = async (req: Request, res: Response) => {
  try {
    const colivings = await prisma.coliving.findMany({
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
      const avis = col.avis as any[];
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
        equipements: col.equipementLinks.map((el: any) => el.equipement.nom),
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
  } catch (error) {
    console.error('Erreur getAllColivings:', error);
    res.status(500).json({ error: 'Erreur', details: (error as any).message });
  }
};

export const getColivingById = async (req: Request, res: Response) => {
  try {
    const idStr = typeof req.params.id === 'string' ? req.params.id : String(req.params.id);
    const colivingId = parseInt(idStr || '0');

    const col = await prisma.coliving.findUnique({
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

    const avis = col.avis as any[];
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
      equipements: col.equipementLinks.map((el: any) => el.equipement.nom),
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
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur' });
  }
};

export const createReservation = async (req: Request, res: Response) => {
  try {
    const { clientId, chambreId, dateDebut, dateFin, nombrePersonnes } = req.body;

    const chambre = await prisma.chambre.findUnique({
      where: { id: chambreId },
    });

    if (!chambre) {
      return res.status(404).json({ error: 'Chambre non trouvée' });
    }

    const start = new Date(dateDebut);
    const end = new Date(dateFin);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const prixTotal = Number(chambre.prixParMois) * (nights / 30);

    const reservation = await prisma.reservation.create({
      data: {
        clientId,
        chambreId,
        dateDebut: start,
        dateFin: end,
        nombrePersonnes,
        prixTotal: prixTotal as any,
      },
    });

    res.status(201).json(reservation);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur' });
  }
};

export const getAvailableChambres = async (req: Request, res: Response) => {
  try {
    const colivingIdStr = typeof req.query.colivingId === 'string' ? req.query.colivingId : String(req.query.colivingId);
    const dateDebutStr = typeof req.query.dateDebut === 'string' ? req.query.dateDebut : String(req.query.dateDebut);
    const dateFinStr = typeof req.query.dateFin === 'string' ? req.query.dateFin : String(req.query.dateFin);

    const colivingIdNum = parseInt(colivingIdStr || '0', 10);
    if (!colivingIdNum) {
      return res.status(400).json({ error: 'Coliving ID manquant ou invalide' });
    }

    const dateDebut = dateDebutStr ? new Date(dateDebutStr) : null;
    const dateFin = dateFinStr ? new Date(dateFinStr) : null;
    const hasValidDates =
      dateDebut &&
      dateFin &&
      !isNaN(dateDebut.getTime()) &&
      !isNaN(dateFin.getTime()) &&
      dateDebut < dateFin;

    // Récupérer toutes les chambres avec leurs réservations actives
    const chambres = await prisma.chambre.findMany({
      where: { colivingId: colivingIdNum },
      include: {
        reservations: hasValidDates
          ? {
              where: {
                statut: { in: ['CONFIRMEE', 'EN_ATTENTE'] },
                AND: [{ dateDebut: { lt: dateFin } }, { dateFin: { gt: dateDebut } }],
              },
            }
          : false,
      },
    });

    if (!hasValidDates) {
      return res.json(chambres);
    }

    // Filtrer les chambres disponibles en fonction de la capacité restante
    const available = chambres.filter((ch) => {
      const activeReservations = (ch as any).reservations || [];
      if (activeReservations.length === 0) return true;

      const totalBookedPersons = activeReservations.reduce(
        (sum: number, r: any) => sum + (r.nombrePersonnes || 1),
        0
      );
      const capacity = Math.max(ch.capacitePersonnes, ch.litsDisponibles, 1);

      // Pour une chambre strictement privée pour 1 seule personne
      if (ch.typeChambre === 'PRIVEE' && ch.capacitePersonnes <= 1) {
        return activeReservations.length === 0;
      }

      // Pour les dortoirs et chambres multi-places, disponible tant que la capacité n'est pas atteinte
      return totalBookedPersons < capacity;
    });

    // Retourner les chambres disponibles ou l'ensemble des chambres si disponible
    res.json(available.length > 0 ? available : chambres);
  } catch (error) {
    console.error('Erreur getAvailableChambres:', error);
    res.status(500).json({ error: 'Erreur lors de la recherche des chambres' });
  }
};
