"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAllRequestsAdmin = exports.validateClientDocument = exports.respondToRequest = exports.listClientRequests = exports.listHostRequests = exports.requestDocumentFromClient = void 0;
const db_1 = require("../config/db");
const audit_controller_1 = require("./audit.controller");
const requestDocumentFromClient = async (req, res) => {
    try {
        const hoteId = req.user.id;
        const { clientId } = req.body;
        const request = await db_1.prisma.documentRequest.create({
            data: {
                hoteId,
                clientId,
                statut: 'EN_ATTENTE',
            },
        });
        await (0, audit_controller_1.logAction)(hoteId, 'HOTE_REQUEST_DOC', `Demandé au client ID ${clientId}`);
        res.status(201).json({ message: 'Demande envoyée', request });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la demande de document' });
    }
};
exports.requestDocumentFromClient = requestDocumentFromClient;
const listHostRequests = async (req, res) => {
    try {
        const hoteId = req.user.id;
        const requests = await db_1.prisma.documentRequest.findMany({
            where: { hoteId },
            include: {
                client: { select: { user: { select: { nom: true, email: true } } } },
                document: true,
            },
            orderBy: { dateDemande: 'desc' }
        });
        res.json(requests);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des demandes hôte' });
    }
};
exports.listHostRequests = listHostRequests;
const listClientRequests = async (req, res) => {
    try {
        const clientId = req.user.id;
        const requests = await db_1.prisma.documentRequest.findMany({
            where: { clientId },
            include: {
                hote: { select: { user: { select: { nom: true } } } },
                document: true,
            },
            orderBy: { dateDemande: 'desc' }
        });
        res.json(requests);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des demandes' });
    }
};
exports.listClientRequests = listClientRequests;
const respondToRequest = async (req, res) => {
    try {
        const clientId = req.user.id;
        const requestId = parseInt(String(req.params.id), 10);
        const { fichier } = req.body;
        // First create the document
        const document = await db_1.prisma.document.create({
            data: {
                userId: clientId,
                type: 'PIECE_IDENTITE_CLIENT',
                fichier,
                statut: 'EN_ATTENTE'
            }
        });
        // Link document to the request
        const updatedRequest = await db_1.prisma.documentRequest.update({
            where: { id: requestId },
            data: { documentId: document.id }
        });
        await (0, audit_controller_1.logAction)(clientId, 'CLIENT_UPLOAD_DOC', `Document soumis pour la demande ID ${requestId}`);
        res.json({ message: 'Document soumis avec succès', request: updatedRequest });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la soumission du document' });
    }
};
exports.respondToRequest = respondToRequest;
const validateClientDocument = async (req, res) => {
    try {
        const hoteId = req.user.id;
        const requestId = parseInt(String(req.params.id), 10);
        const { statut } = req.body; // 'VALIDE' | 'REFUSE'
        const docRequest = await db_1.prisma.documentRequest.findUnique({ where: { id: requestId } });
        if (!docRequest || docRequest.hoteId !== hoteId) {
            return res.status(403).json({ error: 'Accès refusé' });
        }
        const updatedRequest = await db_1.prisma.documentRequest.update({
            where: { id: requestId },
            data: { statut }
        });
        if (docRequest.documentId) {
            await db_1.prisma.document.update({
                where: { id: docRequest.documentId },
                data: { statut }
            });
        }
        await (0, audit_controller_1.logAction)(hoteId, 'HOTE_VALIDATE_DOC', `Document de la demande ID ${requestId} statut mis à ${statut}`);
        res.json({ message: `Document ${statut}`, request: updatedRequest });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la validation du document' });
    }
};
exports.validateClientDocument = validateClientDocument;
const listAllRequestsAdmin = async (_req, res) => {
    try {
        const requests = await db_1.prisma.documentRequest.findMany({
            include: {
                hote: { select: { user: { select: { nom: true } } } },
                client: { select: { user: { select: { nom: true, email: true } } } },
                document: true,
            },
            orderBy: { dateDemande: 'desc' }
        });
        res.json(requests);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération globale des demandes' });
    }
};
exports.listAllRequestsAdmin = listAllRequestsAdmin;
