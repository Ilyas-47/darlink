"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMeProfile = exports.createUser = exports.findUserById = exports.findUserByEmail = void 0;
const db_1 = require("../config/db");
const findUserByEmail = async (email) => {
    return await db_1.prisma.user.findUnique({
        where: { email },
        include: {
            client: true,
            hote: true
        }
    });
};
exports.findUserByEmail = findUserByEmail;
const findUserById = async (id) => {
    return await db_1.prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            nom: true,
            email: true,
            role: true,
            telephone: true,
            photoProfil: true,
            client: true,
            hote: true,
        },
    });
};
exports.findUserById = findUserById;
const createUser = async (data) => {
    const { nom, email, motDePasse, role, profession, ribBanque } = data;
    return await db_1.prisma.user.create({
        data: {
            nom,
            email,
            motDePasse,
            role,
            ...(role === 'CLIENT' && {
                client: {
                    create: { profession },
                },
            }),
            ...(role === 'HOTE' && {
                hote: {
                    create: { ribBanque },
                },
            }),
        },
    });
};
exports.createUser = createUser;
const updateMeProfile = async (id, userRole, data) => {
    await db_1.prisma.$transaction(async (tx) => {
        await tx.user.update({
            where: { id },
            data: {
                ...(data.nom && { nom: data.nom }),
                ...(data.telephone !== undefined && { telephone: data.telephone }),
                ...(data.photoProfil !== undefined && { photoProfil: data.photoProfil }),
            },
        });
        if (userRole === 'CLIENT' && (data.biographie !== undefined || data.profession !== undefined)) {
            await tx.client.update({
                where: { userId: id },
                data: {
                    ...(data.biographie !== undefined && { biographie: data.biographie }),
                    ...(data.profession !== undefined && { profession: data.profession }),
                },
            });
        }
        if (userRole === 'HOTE' && data.ribBanque !== undefined) {
            await tx.hote.update({
                where: { userId: id },
                data: {
                    ribBanque: data.ribBanque,
                },
            });
        }
    });
    return await (0, exports.findUserById)(id);
};
exports.updateMeProfile = updateMeProfile;
