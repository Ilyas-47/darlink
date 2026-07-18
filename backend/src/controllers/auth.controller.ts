import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { generateToken } from '../utils/jwt';
import { Role } from '@prisma/client';
import * as authService from '../services/auth.service';

const registerSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  motDePasse: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  role: z.enum(['CLIENT', 'HOTE']),
  profession: z.string().optional(),
  ribBanque: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  motDePasse: z.string(),
});

function clientErrorPayload(error: unknown, fallback: string) {
  const detail = error instanceof Error ? error.message : String(error);
  console.error('[auth]', fallback, error);
  return {
    error: fallback,
    detail,
  };
}

export const register = async (req: Request, res: Response) => {
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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(motDePasse, salt);

    const newUser = await authService.createUser({
      nom,
      email,
      motDePasse: hashedPassword,
      role: role as Role,
      profession,
      ribBanque,
    });

    const token = generateToken(newUser.id, newUser.role);

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
  } catch (error: unknown) {
    res.status(500).json(clientErrorPayload(error, "Erreur lors de l'inscription"));
  }
};

export const login = async (req: Request, res: Response) => {
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
      isMatch = await bcrypt.compare(motDePasse, user.motDePasse);
    } catch {
      console.error(
        'login: hash mot de passe invalide en base pour',
        email,
        '— lancez: cd backend && npm run seed'
      );
    }
    if (!isMatch) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const token = generateToken(user.id, user.role);

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
  } catch (error: unknown) {
    res.status(500).json(clientErrorPayload(error, 'Erreur lors de la connexion'));
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const id = req.user!.id;
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
  } catch (error: unknown) {
    res.status(500).json(clientErrorPayload(error, 'Erreur lors du chargement du profil'));
  }
};

const updateSchema = z.object({
  nom: z.string().min(2).optional(),
  telephone: z.string().optional(),
  photoProfil: z.string().url().optional(),
  biographie: z.string().optional(),
  profession: z.string().optional(),
  ribBanque: z.string().optional(),
});

export const updateMe = async (req: Request, res: Response) => {
  try {
    const id = req.user!.id;
    const parsed = updateSchema.parse(req.body);

    const user = await authService.findUserById(id);
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });

    const updatedUser = await authService.updateMeProfile(id, user.role, parsed);

    res.json({
      message: 'Profil mis à jour avec succès',
      user: {
        id: updatedUser!.id,
        nom: updatedUser!.nom,
        email: updatedUser!.email,
        role: updatedUser!.role,
        telephone: updatedUser!.telephone,
        photoProfil: updatedUser!.photoProfil,
        clientId: updatedUser!.client?.userId ?? null,
        hoteId: updatedUser!.hote?.userId ?? null,
        client: updatedUser!.client,
        hote: updatedUser!.hote,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du profil' });
  }
};
