"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listEquipements = void 0;
const db_1 = require("../config/db");
const listEquipements = async (_req, res) => {
    try {
        const items = await db_1.prisma.equipement.findMany({ orderBy: { nom: 'asc' } });
        res.json(items);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des équipements' });
    }
};
exports.listEquipements = listEquipements;
