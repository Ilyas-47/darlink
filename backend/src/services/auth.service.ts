import { prisma } from '../config/db';
import { Role } from '@prisma/client';

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
    include: {
      client: true,
      hote: true
    }
  });
};

export const findUserById = async (id: number) => {
  return await prisma.user.findUnique({
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

export const createUser = async (data: {
  nom: string;
  email: string;
  motDePasse: string;
  role: Role;
  profession?: string;
  ribBanque?: string;
}) => {
  const { nom, email, motDePasse, role, profession, ribBanque } = data;
  return await prisma.user.create({
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

export const updateMeProfile = async (
  id: number,
  userRole: string,
  data: {
    nom?: string;
    telephone?: string;
    photoProfil?: string;
    biographie?: string;
    profession?: string;
    ribBanque?: string;
  }
) => {
  await prisma.$transaction(async (tx) => {
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

  return await findUserById(id);
};
