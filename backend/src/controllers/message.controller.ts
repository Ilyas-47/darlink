import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { z } from 'zod';

const sendMessageSchema = z.object({
  destinataireId: z.coerce.number().int().positive(),
  colivingId: z.coerce.number().int().positive().optional(),
  contenu: z.string().min(1, 'Le message ne peut pas être vide'),
});

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const expediteurId = req.user!.id;
    const parsed = sendMessageSchema.parse(req.body);

    const message = await prisma.message.create({
      data: {
        expediteurId,
        destinataireId: parsed.destinataireId,
        colivingId: parsed.colivingId,
        contenu: parsed.contenu,
      },
    });

    res.status(201).json(message);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues.map((e: any) => e.message).join(', ') });
    }
    console.error('Erreur sendMessage:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi du message' });
  }
};

export const getConversations = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    // Fetch all messages where user is either sender or receiver
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { expediteurId: userId },
          { destinataireId: userId },
        ],
      },
      include: {
        expediteur: { select: { id: true, nom: true, photoProfil: true, role: true } },
        destinataire: { select: { id: true, nom: true, photoProfil: true, role: true } },
        coliving: { select: { id: true, titre: true } },
      },
      orderBy: { dateEnvoi: 'desc' },
    });

    // Group by contact (the other person in the conversation)
    const conversationsMap = new Map<number, any>();

    for (const msg of messages) {
      const isSender = msg.expediteurId === userId;
      const contactId = isSender ? msg.destinataireId : msg.expediteurId;
      const contactUser = isSender ? msg.destinataire : msg.expediteur;

      if (!conversationsMap.has(contactId)) {
        conversationsMap.set(contactId, {
          contactId,
          contactUser,
          lastMessage: msg,
          unreadCount: 0,
        });
      }

      if (!isSender && !msg.lu) {
        conversationsMap.get(contactId).unreadCount++;
      }
    }

    const conversations = Array.from(conversationsMap.values());
    res.json(conversations);
  } catch (error) {
    console.error('Erreur getConversations:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des conversations' });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const contactIdStr = Array.isArray(req.params.contactId) ? req.params.contactId[0] : req.params.contactId;
    const contactId = parseInt(contactIdStr || '', 10);

    if (isNaN(contactId)) {
      return res.status(400).json({ error: 'ID contact invalide' });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { expediteurId: userId, destinataireId: contactId },
          { expediteurId: contactId, destinataireId: userId },
        ],
      },
      include: {
        coliving: { select: { id: true, titre: true } },
      },
      orderBy: { dateEnvoi: 'asc' },
    });

    // Mark as read
    const unreadIds = messages
      .filter((m) => m.destinataireId === userId && !m.lu)
      .map((m) => m.id);

    if (unreadIds.length > 0) {
      await prisma.message.updateMany({
        where: { id: { in: unreadIds } },
        data: { lu: true },
      });
    }

    res.json(messages);
  } catch (error) {
    console.error('Erreur getMessages:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
  }
};
