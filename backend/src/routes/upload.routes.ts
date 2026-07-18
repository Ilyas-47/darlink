import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

// Configuration du stockage de multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (_req, file, cb) => {
    // Nom unique : timestamp + extension d'origine
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Filtre pour n'accepter que les images
const fileFilter = (_req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers images sont acceptés !'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite : 5 Mo
  },
});

/**
 * POST /api/upload
 * Uploader une image de coliving
 */
router.post('/', protect, upload.single('image'), (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Veuillez sélectionner un fichier image.' });
    }

    // URL absolue/relative de l'image pour le frontend
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    res.json({
      message: 'Fichier uploadé avec succès',
      url: fileUrl,
    });
  } catch (error) {
    console.error('[Upload Route] Error:', error);
    res.status(500).json({ error: 'Erreur lors du téléversement.' });
  }
});

export default router;
