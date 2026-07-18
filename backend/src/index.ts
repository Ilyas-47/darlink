import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

import authRoutes from './routes/auth.routes';
import colivingRoutes from './routes/coliving.routes';
import reservationRoutes from './routes/reservation.routes';
import adminRoutes from './routes/admin.routes';
import hoteRoutes from './routes/hote.routes';
import path from 'path';
import equipementRoutes from './routes/equipement.routes';
import aiRoutes from './routes/ai.routes';
import uploadRoutes from './routes/upload.routes';
import documentRoutes from './routes/document.routes';
import auditRoutes from './routes/audit.routes';
import documentRequestRoutes from './routes/documentRequest.routes';
import messageRoutes from './routes/message.routes';

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Servir les uploads de manière publique
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/colivings', colivingRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/hote', hoteRoutes);
app.use('/api/equipements', equipementRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/document-requests', documentRequestRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ message: 'Bienvenue sur l\'API Darlink ! Connexion à la base de données réussie.' });
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error);
    res.status(500).json({ error: 'Erreur de connexion à la base de données' });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
