"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const jwt_1 = require("../utils/jwt");
const protect = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer')) {
        return res.status(401).json({ error: 'Non autorisé, pas de token' });
    }
    try {
        const token = auth.split(' ')[1];
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = decoded;
        return next();
    }
    catch (error) {
        console.error(error);
        return res.status(401).json({ error: 'Non autorisé, token invalide' });
    }
};
exports.protect = protect;
const authorize = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Accès refusé, rôle insuffisant' });
    }
    return next();
};
exports.authorize = authorize;
