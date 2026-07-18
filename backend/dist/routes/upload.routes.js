"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
// Configuration du stockage de multer
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (_req, file, cb) => {
        // Nom unique : timestamp + extension d'origine
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
// Filtre pour n'accepter que les images
const fileFilter = (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Seuls les fichiers images sont acceptés !'), false);
    }
};
const upload = (0, multer_1.default)({
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
router.post('/', auth_middleware_1.protect, upload.single('image'), (req, res) => {
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
    }
    catch (error) {
        console.error('[Upload Route] Error:', error);
        res.status(500).json({ error: 'Erreur lors du téléversement.' });
    }
});
exports.default = router;
