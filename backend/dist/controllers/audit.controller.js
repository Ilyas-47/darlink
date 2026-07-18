"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuditLogs = exports.logAction = void 0;
const db_1 = require("../config/db");
const logAction = async (userId, action, details) => {
    try {
        await db_1.prisma.auditLog.create({
            data: {
                userId,
                action,
                details,
            },
        });
    }
    catch (error) {
        console.error('Failed to write audit log:', error);
    }
};
exports.logAction = logAction;
const getAuditLogs = async (_req, res) => {
    try {
        const logs = await db_1.prisma.auditLog.findMany({
            orderBy: { dateCreation: 'desc' },
            include: {
                user: { select: { nom: true, email: true, role: true } },
            },
            take: 100, // limit to 100 for performance
        });
        const formatted = logs.map(l => ({
            id: l.id,
            user: l.user ? `${l.user.nom} (${l.user.role})` : 'Système',
            email: l.user?.email || '-',
            action: l.action,
            details: l.details || '',
            dateCreation: l.dateCreation,
        }));
        res.json(formatted);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des logs' });
    }
};
exports.getAuditLogs = getAuditLogs;
