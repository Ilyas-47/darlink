import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; role: string };
    }
  }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer')) {
    return res.status(401).json({ error: 'Non autorisé, pas de token' });
  }

  try {
    const token = auth.split(' ')[1];
    const decoded = verifyToken(token) as { id: number; role: string };
    req.user = decoded;
    return next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Non autorisé, token invalide' });
  }
};

export const authorize =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Accès refusé, rôle insuffisant' });
    }
    return next();
  };
