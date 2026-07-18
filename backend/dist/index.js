"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const coliving_routes_1 = __importDefault(require("./routes/coliving.routes"));
const reservation_routes_1 = __importDefault(require("./routes/reservation.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const hote_routes_1 = __importDefault(require("./routes/hote.routes"));
const path_1 = __importDefault(require("path"));
const equipement_routes_1 = __importDefault(require("./routes/equipement.routes"));
const ai_routes_1 = __importDefault(require("./routes/ai.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const document_routes_1 = __importDefault(require("./routes/document.routes"));
const audit_routes_1 = __importDefault(require("./routes/audit.routes"));
const documentRequest_routes_1 = __importDefault(require("./routes/documentRequest.routes"));
const message_routes_1 = __importDefault(require("./routes/message.routes"));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Servir les uploads de manière publique
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.use('/api/auth', auth_routes_1.default);
app.use('/api/colivings', coliving_routes_1.default);
app.use('/api/reservations', reservation_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/hote', hote_routes_1.default);
app.use('/api/equipements', equipement_routes_1.default);
app.use('/api/ai', ai_routes_1.default);
app.use('/api/upload', upload_routes_1.default);
app.use('/api/documents', document_routes_1.default);
app.use('/api/audit', audit_routes_1.default);
app.use('/api/document-requests', documentRequest_routes_1.default);
app.use('/api/messages', message_routes_1.default);
app.get('/', async (_req, res) => {
    try {
        await db_1.prisma.$queryRaw `SELECT 1`;
        res.json({ message: 'Bienvenue sur l\'API Darlink ! Connexion à la base de données réussie.' });
    }
    catch (error) {
        console.error('Erreur de connexion à la base de données:', error);
        res.status(500).json({ error: 'Erreur de connexion à la base de données' });
    }
});
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
