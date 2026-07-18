"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMe = exports.getMe = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = require("zod");
const jwt_1 = require("../utils/jwt");
const authService = __importStar(require("../services/auth.service"));
const registerSchema = zod_1.z.object({
    nom: zod_1.z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    email: zod_1.z.string().email('Email invalide'),
    motDePasse: zod_1.z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
    role: zod_1.z.enum(['CLIENT', 'HOTE']),
    profession: zod_1.z.string().optional(),
    ribBanque: zod_1.z.string().optional(),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email invalide'),
    motDePasse: zod_1.z.string(),
});
function clientErrorPayload(error, fallback) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error('[auth]', fallback, error);
    return {
        error: fallback,
        detail,
    };
}
const register = async (req, res) => {
    try {
        const parsed = registerSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.issues });
        }
        const { nom, email, motDePasse, role, profession, ribBanque } = parsed.data;
        const userExists = await authService.findUserByEmail(email);
        if (userExists) {
            return res.status(400).json({ error: 'Un utilisateur avec cet email existe déjà' });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(motDePasse, salt);
        const newUser = await authService.createUser({
            nom,
            email,
            motDePasse: hashedPassword,
            role: role,
            profession,
            ribBanque,
        });
        const token = (0, jwt_1.generateToken)(newUser.id, newUser.role);
        res.status(201).json({
            message: 'Compte créé avec succès',
            token,
            user: {
                id: newUser.id,
                nom: newUser.nom,
                email: newUser.email,
                role: newUser.role,
            },
        });
    }
    catch (error) {
        res.status(500).json(clientErrorPayload(error, "Erreur lors de l'inscription"));
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.issues });
        }
        const { email, motDePasse } = parsed.data;
        const user = await authService.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }
        let isMatch = false;
        try {
            isMatch = await bcryptjs_1.default.compare(motDePasse, user.motDePasse);
        }
        catch {
            console.error('login: hash mot de passe invalide en base pour', email, '— lancez: cd backend && npm run seed');
        }
        if (!isMatch) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }
        const token = (0, jwt_1.generateToken)(user.id, user.role);
        res.json({
            message: 'Connexion réussie',
            token,
            user: {
                id: user.id,
                nom: user.nom,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        res.status(500).json(clientErrorPayload(error, 'Erreur lors de la connexion'));
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        const id = req.user.id;
        const user = await authService.findUserById(id);
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur introuvable' });
        }
        res.json({
            user: {
                id: user.id,
                nom: user.nom,
                email: user.email,
                role: user.role,
                telephone: user.telephone,
                photoProfil: user.photoProfil,
                clientId: user.client?.userId ?? null,
                hoteId: user.hote?.userId ?? null,
                client: user.client,
                hote: user.hote,
            },
        });
    }
    catch (error) {
        res.status(500).json(clientErrorPayload(error, 'Erreur lors du chargement du profil'));
    }
};
exports.getMe = getMe;
const updateSchema = zod_1.z.object({
    nom: zod_1.z.string().min(2).optional(),
    telephone: zod_1.z.string().optional(),
    photoProfil: zod_1.z.string().url().optional(),
    biographie: zod_1.z.string().optional(),
    profession: zod_1.z.string().optional(),
    ribBanque: zod_1.z.string().optional(),
});
const updateMe = async (req, res) => {
    try {
        const id = req.user.id;
        const parsed = updateSchema.parse(req.body);
        const user = await authService.findUserById(id);
        if (!user)
            return res.status(404).json({ error: 'Utilisateur introuvable' });
        const updatedUser = await authService.updateMeProfile(id, user.role, parsed);
        res.json({
            message: 'Profil mis à jour avec succès',
            user: {
                id: updatedUser.id,
                nom: updatedUser.nom,
                email: updatedUser.email,
                role: updatedUser.role,
                telephone: updatedUser.telephone,
                photoProfil: updatedUser.photoProfil,
                clientId: updatedUser.client?.userId ?? null,
                hoteId: updatedUser.hote?.userId ?? null,
                client: updatedUser.client,
                hote: updatedUser.hote,
            },
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour du profil' });
    }
};
exports.updateMe = updateMe;
