import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { logAction } from './audit.controller';

export const requestDocumentFromClient = async (req: Request, res: Response) => {
  try {
    const hoteId = req.user!.id;
    const { clientId } = req.body;

    const request = await prisma.documentRequest.create({
      data: {
        hoteId,
        clientId,
        statut: 'EN_ATTENTE',
      },
    });

    await logAction(hoteId, 'HOTE_REQUEST_DOC', `Demandé au client ID ${clientId}`);

    res.status(201).json({ message: 'Demande envoyée', request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la demande de document' });
  }
};

export const listHostRequests = async (req: Request, res: Response) => {
  try {
    const hoteId = req.user!.id;
    const requests = await prisma.documentRequest.findMany({
      where: { hoteId },
      include: {
        client: { select: { user: { select: { nom: true, email: true } } } },
        document: true,
      },
      orderBy: { dateDemande: 'desc' }
    });

    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des demandes hôte' });
  }
};

export const listClientRequests = async (req: Request, res: Response) => {
  try {
    const clientId = req.user!.id;
    const requests = await prisma.documentRequest.findMany({
      where: { clientId },
      include: {
        hote: { select: { user: { select: { nom: true } } } },
        document: true,
      },
      orderBy: { dateDemande: 'desc' }
    });

    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des demandes' });
  }
};

export const respondToRequest = async (req: Request, res: Response) => {
  try {
    const clientId = req.user!.id;
    const requestId = parseInt(String(req.params.id), 10);
    const { fichier } = req.body;

    // First create the document
    const document = await prisma.document.create({
      data: {
        userId: clientId,
        type: 'PIECE_IDENTITE_CLIENT',
        fichier,
        statut: 'EN_ATTENTE'
      }
    });

    // Link document to the request
    const updatedRequest = await prisma.documentRequest.update({
      where: { id: requestId },
      data: { documentId: document.id }
    });

    await logAction(clientId, 'CLIENT_UPLOAD_DOC', `Document soumis pour la demande ID ${requestId}`);

    res.json({ message: 'Document soumis avec succès', request: updatedRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la soumission du document' });
  }
};

export const validateClientDocument = async (req: Request, res: Response) => {
  try {
    const hoteId = req.user!.id;
    const requestId = parseInt(String(req.params.id), 10);
    const { statut } = req.body; // 'VALIDE' | 'REFUSE'

    const docRequest = await prisma.documentRequest.findUnique({ where: { id: requestId } });
    if (!docRequest || docRequest.hoteId !== hoteId) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    const updatedRequest = await prisma.documentRequest.update({
      where: { id: requestId },
      data: { statut }
    });

    if (docRequest.documentId) {
      await prisma.document.update({
        where: { id: docRequest.documentId },
        data: { statut }
      });
    }

    await logAction(hoteId, 'HOTE_VALIDATE_DOC', `Document de la demande ID ${requestId} statut mis à ${statut}`);

    res.json({ message: `Document ${statut}`, request: updatedRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la validation du document' });
  }
};

export const listAllRequestsAdmin = async (_req: Request, res: Response) => {
  try {
    const requests = await prisma.documentRequest.findMany({
      include: {
        hote: { select: { user: { select: { nom: true } } } },
        client: { select: { user: { select: { nom: true, email: true } } } },
        document: true,
      },
      orderBy: { dateDemande: 'desc' }
    });

    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération globale des demandes' });
  }
};
