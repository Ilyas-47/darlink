import { Request, Response } from 'express';
import { prisma } from '../config/db';

export const logAction = async (userId: number | null, action: string, details?: string) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        details,
      },
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
};

export const getAuditLogs = async (_req: Request, res: Response) => {
  try {
    const logs = await prisma.auditLog.findMany({
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des logs' });
  }
};
