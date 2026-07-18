"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyDocuments = exports.uploadDocument = void 0;
const zod_1 = require("zod");
const db_1 = require("../config/db");
const uploadSchema = zod_1.z.object({
    type: zod_1.z.string(),
    fichier: zod_1.z.string(), // URL or base64
});
const uploadDocument = async (req, res) => {
    try {
        const { type, fichier } = uploadSchema.parse(req.body);
        const document = await db_1.prisma.document.create({
            data: {
                userId: req.user.id,
                type,
                fichier,
                statut: 'EN_ATTENTE',
            },
        });
        res.status(201).json(document);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        console.error('Erreur uploadDocument:', error);
        res.status(500).json({ error: "Erreur lors de l'ajout du document" });
    }
};
exports.uploadDocument = uploadDocument;
const getMyDocuments = async (req, res) => {
    try {
        const documents = await db_1.prisma.document.findMany({
            where: { userId: req.user.id },
            orderBy: { dateSoumission: 'desc' },
        });
        res.json(documents);
    }
    catch (error) {
        console.error('Erreur getMyDocuments:', error);
        res.status(500).json({ error: 'Erreur lors du chargement des documents' });
    }
};
exports.getMyDocuments = getMyDocuments;
