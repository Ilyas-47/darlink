import { Role, StatutValidation, TypeChambre } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { prisma } from '../src/config/db';

// Fonction pour télécharger une image
const downloadImage = (url: string, filename: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'colivings');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const filePath = path.join(uploadDir, filename);
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(`/uploads/colivings/${filename}`);
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
};

async function main() {
  console.log('🌱 Démarrage du seed avec des données réelles marocaines...');

  // 1. Nettoyage de la base de données
  console.log('🧹 Suppression des anciennes données...');
  await prisma.paiement.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.participationActivite.deleteMany();
  await prisma.activite.deleteMany();
  await prisma.avis.deleteMany();
  await prisma.chambre.deleteMany();
  await prisma.image.deleteMany();
  await prisma.colivingEquipement.deleteMany();
  await prisma.coliving.deleteMany();
  await prisma.documentRequest.deleteMany();
  await prisma.document.deleteMany();
  
  // On supprime uniquement les hôtes pour garder les clients
  await prisma.hote.deleteMany();
  await prisma.user.deleteMany({ where: { role: Role.HOTE } });
  
  // Equipements
  await prisma.equipement.deleteMany();

  // 2. Création du mot de passe partagé
  const hashedPassword = await bcrypt.hash('darlink', 10);

  // 3. Création des Hôtes Réels
  console.log('👤 Création des hôtes marocains...');
  
  const hote1 = await prisma.user.create({
    data: {
      nom: 'Mehdi Alaoui',
      email: 'mehdi@darlink.com',
      motDePasse: hashedPassword,
      telephone: '+212600112233',
      photoProfil: 'https://ui-avatars.com/api/?background=1A1A2E&color=fff&name=Mehdi+Alaoui',
      role: Role.HOTE,
      hote: { create: { ribBanque: 'MA123456789012345678901234' } }
    },
    include: { hote: true }
  });

  const hote2 = await prisma.user.create({
    data: {
      nom: 'Youssef Benjelloun',
      email: 'youssef@darlink.com',
      motDePasse: hashedPassword,
      telephone: '+212600445566',
      photoProfil: 'https://ui-avatars.com/api/?background=DD7246&color=fff&name=Youssef+B',
      role: Role.HOTE,
      hote: { create: { ribBanque: 'MA987654321098765432109876' } }
    },
    include: { hote: true }
  });

  const hote3 = await prisma.user.create({
    data: {
      nom: 'Salma El Fassi',
      email: 'salma@darlink.com',
      motDePasse: hashedPassword,
      telephone: '+212600778899',
      photoProfil: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=Salma+E',
      role: Role.HOTE,
      hote: { create: { ribBanque: 'MA555555555555555555555555' } }
    },
    include: { hote: true }
  });

  // 4. Équipements de base
  console.log('🛠️ Création des équipements...');
  const equipements = await Promise.all([
    prisma.equipement.create({ data: { nom: 'Fibre Optique 100Mbps', icone: 'wifi' } }),
    prisma.equipement.create({ data: { nom: 'Espace Coworking', icone: 'laptop' } }),
    prisma.equipement.create({ data: { nom: 'Rooftop Vue Mer', icone: 'sun' } }),
    prisma.equipement.create({ data: { nom: 'Piscine Traditionnelle', icone: 'droplet' } }),
    prisma.equipement.create({ data: { nom: 'Cuisine Marocaine', icone: 'coffee' } }),
    prisma.equipement.create({ data: { nom: 'Cours de Surf', icone: 'activity' } })
  ]);

  // 5. Téléchargement des images réelles et création des colivings
  console.log('📸 Téléchargement des images locales et création des espaces...');
  
  const sundeskImg1 = await downloadImage('https://images.unsplash.com/photo-1544254247-fba29302e1c9?w=800&q=80', 'sundesk1.jpg').catch(() => '/uploads/colivings/sundesk2.jpg');
  const sundeskImg2 = await downloadImage('https://images.unsplash.com/photo-1583416750470-965b2707b355?w=800&q=80', 'sundesk2.jpg');
  
  await prisma.coliving.create({
    data: {
      hoteId: hote2.id,
      titre: 'SunDesk Coliving Taghazout',
      description: 'Situé au coeur du village de surfeurs de Taghazout. Un espace conçu pour les nomades digitaux avec des bureaux ergonomiques, une vue imprenable sur l\'océan et une communauté internationale dynamique. Nous organisons des repas marocains familiaux et des sorties surf.',
      adresse: 'Centre ville, Taghazout, Agadir 80200, Maroc',
      latitude: 30.545,
      longitude: -9.713,
      lienGoogleMap: 'https://maps.app.goo.gl/Taghazout',
      regles: 'Respect des heures de silence dans l\'espace coworking. Planche de surf à rincer à l\'extérieur.',
      statut: StatutValidation.VALIDE,
      images: {
        create: [
          { url: sundeskImg1, isPrincipale: true, ordre: 1 },
          { url: sundeskImg2, isPrincipale: false, ordre: 2 }
        ]
      },
      chambres: {
        create: [
          { nom: 'Chambre Vue Océan', description: 'Chambre privée avec balcon', capacitePersonnes: 1, litsDisponibles: 1, prixParMois: 6500, typeChambre: TypeChambre.PRIVEE },
          { nom: 'Dortoir des Surfeurs', description: 'Lit superposé dans un espace partagé', capacitePersonnes: 4, litsDisponibles: 4, prixParMois: 3000, typeChambre: TypeChambre.PARTAGEE_DORTOIR }
        ]
      },
      equipementLinks: {
        create: [
          { equipementId: equipements[0].id },
          { equipementId: equipements[1].id },
          { equipementId: equipements[2].id },
          { equipementId: equipements[5].id }
        ]
      }
    }
  });

  const outsiteImg1 = await downloadImage('https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80', 'outsite1.jpg');
  const outsiteImg2 = await downloadImage('https://images.unsplash.com/photo-1558450125-99d984cfb926?w=800&q=80', 'outsite2.jpg').catch(() => '/uploads/colivings/outsite1.jpg');

  await prisma.coliving.create({
    data: {
      hoteId: hote1.id,
      titre: 'Outsite Marrakech Medina',
      description: 'Un magnifique Riad rénové en plein coeur de la Medina de Marrakech. Plongez dans l\'histoire marocaine tout en bénéficiant du haut débit. Le patio central avec sa piscine traditionnelle offre un espace rafraîchissant après une journée de travail.',
      adresse: 'Derb Assehbe, Medina, Marrakech 40000, Maroc',
      latitude: 31.630,
      longitude: -7.981,
      lienGoogleMap: 'https://maps.app.goo.gl/MarrakechMedina',
      regles: 'Espace 100% non fumeur. Respecter la quiétude du patio.',
      statut: StatutValidation.VALIDE,
      images: {
        create: [
          { url: outsiteImg1, isPrincipale: true, ordre: 1 },
          { url: outsiteImg2, isPrincipale: false, ordre: 2 }
        ]
      },
      chambres: {
        create: [
          { nom: 'Suite Majorelle', description: 'Suite luxueuse avec zellige traditionnel', capacitePersonnes: 2, litsDisponibles: 2, prixParMois: 9000, typeChambre: TypeChambre.PRIVEE },
          { nom: 'Chambre Atlas', description: 'Petite chambre confortable', capacitePersonnes: 1, litsDisponibles: 1, prixParMois: 5500, typeChambre: TypeChambre.PRIVEE }
        ]
      },
      equipementLinks: {
        create: [
          { equipementId: equipements[0].id },
          { equipementId: equipements[1].id },
          { equipementId: equipements[3].id },
          { equipementId: equipements[4].id }
        ]
      }
    }
  });

  const spotImg1 = await downloadImage('https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80', 'spot1.jpg');
  const spotImg2 = await downloadImage('https://images.unsplash.com/photo-1540339832862-474599807836?w=800&q=80', 'spot2.jpg');

  await prisma.coliving.create({
    data: {
      hoteId: hote3.id,
      titre: 'The Spot Essaouira',
      description: 'Au coeur des remparts d\'Essaouira, "The Spot" rassemble créatifs, artistes et développeurs. C\'est un espace de vie communautaire authentique, avec un grand salon marocain et un accès immédiat à la plage pour le kitesurf.',
      adresse: 'Rue Skala, Medina, Essaouira 44000, Maroc',
      latitude: 31.512,
      longitude: -9.762,
      lienGoogleMap: 'https://maps.app.goo.gl/Essaouira',
      regles: 'Les événements musicaux doivent se terminer à 23h.',
      statut: StatutValidation.VALIDE,
      images: {
        create: [
          { url: spotImg1, isPrincipale: true, ordre: 1 },
          { url: spotImg2, isPrincipale: false, ordre: 2 }
        ]
      },
      chambres: {
        create: [
          { nom: 'Chambre Gnaoua', description: 'Design rustique et coloré', capacitePersonnes: 1, litsDisponibles: 1, prixParMois: 4500, typeChambre: TypeChambre.PRIVEE },
          { nom: 'Dortoir des Artistes', description: 'Grand espace partagé lumineux', capacitePersonnes: 6, litsDisponibles: 6, prixParMois: 2000, typeChambre: TypeChambre.PARTAGEE_DORTOIR }
        ]
      },
      equipementLinks: {
        create: [
          { equipementId: equipements[0].id },
          { equipementId: equipements[1].id },
          { equipementId: equipements[4].id }
        ]
      }
    }
  });

  console.log('📸 Téléchargement des nouvelles images et création de nouveaux espaces...');

  const surfImg1 = await downloadImage('https://images.unsplash.com/photo-1520116468816-95b69f847357?w=800&q=80', 'surfhouse1.jpg').catch(() => '/uploads/colivings/sundesk2.jpg');
  const surfImg2 = await downloadImage('https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80', 'surfhouse2.jpg').catch(() => '/uploads/colivings/sundesk2.jpg');

  await prisma.coliving.create({
    data: {
      hoteId: hote1.id,
      titre: 'The Surf House Taghazout',
      description: 'L\'endroit parfait pour équilibrer travail et vagues. Notre coworking offre une connexion stable de 100Mbps et une terrasse sur le toit pour checker les spots de surf.',
      adresse: 'Route d\'Essaouira, Taghazout, Agadir 80200, Maroc',
      latitude: 30.548,
      longitude: -9.715,
      lienGoogleMap: 'https://maps.app.goo.gl/TaghazoutSurf',
      regles: 'Planches de surf interdites dans les chambres.',
      statut: StatutValidation.VALIDE,
      images: {
        create: [
          { url: surfImg1, isPrincipale: true, ordre: 1 },
          { url: surfImg2, isPrincipale: false, ordre: 2 }
        ]
      },
      chambres: {
        create: [
          { nom: 'Chambre Zen', description: 'Chambre double confortable', capacitePersonnes: 2, litsDisponibles: 2, prixParMois: 5000, typeChambre: TypeChambre.PRIVEE },
          { nom: 'Dortoir Mixte', description: 'Idéal pour petits budgets', capacitePersonnes: 6, litsDisponibles: 6, prixParMois: 2500, typeChambre: TypeChambre.PARTAGEE_DORTOIR }
        ]
      },
      equipementLinks: {
        create: [
          { equipementId: equipements[0].id },
          { equipementId: equipements[1].id },
          { equipementId: equipements[2].id },
          { equipementId: equipements[5].id }
        ]
      }
    }
  });

  const rabatImg1 = await downloadImage('https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80', 'rabat1.jpg').catch(() => '/uploads/colivings/outsite1.jpg');
  const rabatImg2 = await downloadImage('https://images.unsplash.com/photo-1553524913-92f70b77b7cc?w=800&q=80', 'rabat2.jpg').catch(() => '/uploads/colivings/outsite1.jpg');

  await prisma.coliving.create({
    data: {
      hoteId: hote2.id,
      titre: 'Dar Zouina Rabat',
      description: 'Découvrez la vie paisible dans la capitale marocaine. Un espace moderne situé au centre de Rabat (Agdal), à proximité des cafés, tramways et parcs.',
      adresse: 'Quartier Agdal, Rabat 10000, Maroc',
      latitude: 34.004,
      longitude: -6.852,
      lienGoogleMap: 'https://maps.app.goo.gl/RabatAgdal',
      regles: 'Espace de travail calme. Réunions dans la salle dédiée.',
      statut: StatutValidation.VALIDE,
      images: {
        create: [
          { url: rabatImg1, isPrincipale: true, ordre: 1 },
          { url: rabatImg2, isPrincipale: false, ordre: 2 }
        ]
      },
      chambres: {
        create: [
          { nom: 'Studio Privé', description: 'Un petit studio totalement équipé', capacitePersonnes: 1, litsDisponibles: 1, prixParMois: 7000, typeChambre: TypeChambre.PRIVEE },
          { nom: 'Chambre Partagée', description: 'Chambre spacieuse avec 2 lits', capacitePersonnes: 2, litsDisponibles: 2, prixParMois: 3500, typeChambre: TypeChambre.PARTAGEE_DORTOIR }
        ]
      },
      equipementLinks: {
        create: [
          { equipementId: equipements[0].id },
          { equipementId: equipements[1].id },
          { equipementId: equipements[4].id }
        ]
      }
    }
  });

  const chefImg1 = await downloadImage('https://images.unsplash.com/photo-1512633017083-67231aba710d?w=800&q=80', 'chef1.jpg').catch(() => '/uploads/colivings/spot1.jpg');
  const chefImg2 = await downloadImage('https://images.unsplash.com/photo-1558485292-2df283fcc069?w=800&q=80', 'chef2.jpg').catch(() => '/uploads/colivings/spot1.jpg');

  await prisma.coliving.create({
    data: {
      hoteId: hote3.id,
      titre: 'Nomad House Chefchaouen',
      description: 'L\'inspiration créative à son apogée dans la célèbre ville bleue du Maroc. La maison dispose de cheminées, d\'une cuisine marocaine typique et d\'une terrasse avec vue sur les montagnes du Rif.',
      adresse: 'Quartier Andalou, Medina, Chefchaouen 91000, Maroc',
      latitude: 35.168,
      longitude: -5.263,
      lienGoogleMap: 'https://maps.app.goo.gl/Chefchaouen',
      regles: 'Respect des traditions locales. Espaces communs partagés avec bienveillance.',
      statut: StatutValidation.VALIDE,
      images: {
        create: [
          { url: chefImg1, isPrincipale: true, ordre: 1 },
          { url: chefImg2, isPrincipale: false, ordre: 2 }
        ]
      },
      chambres: {
        create: [
          { nom: 'Chambre Bleue', description: 'Une chambre avec vue sur les montagnes', capacitePersonnes: 2, litsDisponibles: 2, prixParMois: 4800, typeChambre: TypeChambre.PRIVEE },
          { nom: 'Chambre Simple', description: 'Petite chambre très confortable', capacitePersonnes: 1, litsDisponibles: 1, prixParMois: 3800, typeChambre: TypeChambre.PRIVEE }
        ]
      },
      equipementLinks: {
        create: [
          { equipementId: equipements[0].id },
          { equipementId: equipements[1].id },
          { equipementId: equipements[4].id }
        ]
      }
    }
  });

  console.log('📸 Téléchargement des 6 dernières images et création des espaces restants (Total: 12)...');

  // 7. Dar Digital Nomad (Ouarzazate)
  const ouarzazateImg1 = await downloadImage('https://images.unsplash.com/photo-1548695607-9c73430ba065?w=800&q=80', 'ouarzazate1.jpg').catch(() => '/uploads/colivings/spot1.jpg');
  const ouarzazateImg2 = await downloadImage('https://images.unsplash.com/photo-1473280025148-643f9b0cbac2?w=800&q=80', 'ouarzazate2.jpg').catch(() => '/uploads/colivings/spot1.jpg');
  await prisma.coliving.create({
    data: {
      hoteId: hote1.id,
      titre: 'Dar Digital Nomad Ouarzazate',
      description: 'L\'expérience ultime du désert marocain avec une fibre optique incroyablement stable. Un espace inspirant aux portes du Sahara, parfait pour la concentration.',
      adresse: 'Kasbah Taourirt, Ouarzazate 45000, Maroc',
      latitude: 30.919, longitude: -6.893,
      lienGoogleMap: 'https://maps.app.goo.gl/Ouarzazate',
      regles: 'Respecter le calme du désert. S\'hydrater régulièrement.',
      statut: StatutValidation.VALIDE,
      images: { create: [{ url: ouarzazateImg1, isPrincipale: true, ordre: 1 }, { url: ouarzazateImg2, isPrincipale: false, ordre: 2 }] },
      chambres: {
        create: [
          { nom: 'Chambre Kasbah', description: 'Architecture en terre cuite', capacitePersonnes: 1, litsDisponibles: 1, prixParMois: 4200, typeChambre: TypeChambre.PRIVEE },
          { nom: 'Tente Berbère Coworking', description: 'Expérience authentique', capacitePersonnes: 2, litsDisponibles: 2, prixParMois: 2500, typeChambre: TypeChambre.PARTAGEE_DORTOIR }
        ]
      },
      equipementLinks: { create: [{ equipementId: equipements[0].id }, { equipementId: equipements[1].id }] }
    }
  });

  // 8. Aourir Surf Camp (Aourir)
  const aourirImg1 = await downloadImage('https://images.unsplash.com/photo-1512803362143-6d0e806742de?w=800&q=80', 'aourir1.jpg').catch(() => '/uploads/colivings/sundesk1.jpg');
  const aourirImg2 = await downloadImage('https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80', 'aourir2.jpg').catch(() => '/uploads/colivings/sundesk1.jpg');
  await prisma.coliving.create({
    data: {
      hoteId: hote2.id,
      titre: 'Aourir Surf & Work',
      description: 'Le "Banana Village" du Maroc. Moins bondé que Taghazout, parfait pour les surfeurs de tous niveaux avec un espace de travail à deux pas de l\'océan.',
      adresse: 'Banana Beach, Aourir 80750, Maroc',
      latitude: 30.499, longitude: -9.645,
      lienGoogleMap: 'https://maps.app.goo.gl/Aourir',
      regles: 'Nettoyage des combinaisons à l\'extérieur.',
      statut: StatutValidation.VALIDE,
      images: { create: [{ url: aourirImg1, isPrincipale: true, ordre: 1 }, { url: aourirImg2, isPrincipale: false, ordre: 2 }] },
      chambres: {
        create: [
          { nom: 'Bungalow Océan', description: 'Petit bungalow privé', capacitePersonnes: 2, litsDisponibles: 2, prixParMois: 5500, typeChambre: TypeChambre.PRIVEE },
          { nom: 'Dortoir Banana', description: 'Spacieux et lumineux', capacitePersonnes: 4, litsDisponibles: 4, prixParMois: 2200, typeChambre: TypeChambre.PARTAGEE_DORTOIR }
        ]
      },
      equipementLinks: { create: [{ equipementId: equipements[0].id }, { equipementId: equipements[5].id }] }
    }
  });

  // 9. Coworking Tangier (Tanger)
  const tangerImg1 = await downloadImage('https://images.unsplash.com/photo-1583091176044-6a0b9435b642?w=800&q=80', 'tanger1.jpg').catch(() => '/uploads/colivings/outsite1.jpg');
  const tangerImg2 = await downloadImage('https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80', 'tanger2.jpg').catch(() => '/uploads/colivings/outsite1.jpg');
  await prisma.coliving.create({
    data: {
      hoteId: hote3.id,
      titre: 'Kasbah Hub Tanger',
      description: 'Un magnifique coliving situé dans la Kasbah de Tanger, offrant une vue sur le détroit de Gibraltar. Inspiration garantie pour les écrivains et les entrepreneurs.',
      adresse: 'Rue Kasbah, Tanger 90000, Maroc',
      latitude: 35.787, longitude: -5.812,
      lienGoogleMap: 'https://maps.app.goo.gl/Tanger',
      regles: 'Respecter le silence dans la bibliothèque.',
      statut: StatutValidation.VALIDE,
      images: { create: [{ url: tangerImg1, isPrincipale: true, ordre: 1 }, { url: tangerImg2, isPrincipale: false, ordre: 2 }] },
      chambres: {
        create: [
          { nom: 'Suite Détroit', description: 'Vue sur l\'Espagne', capacitePersonnes: 1, litsDisponibles: 1, prixParMois: 7500, typeChambre: TypeChambre.PRIVEE },
          { nom: 'Chambre Méditerranée', description: 'Balcon partagé', capacitePersonnes: 2, litsDisponibles: 2, prixParMois: 4000, typeChambre: TypeChambre.PARTAGEE_DORTOIR }
        ]
      },
      equipementLinks: { create: [{ equipementId: equipements[0].id }, { equipementId: equipements[1].id }, { equipementId: equipements[2].id }] }
    }
  });

  // 10. Riad Coliving Fez (Fès)
  const fezImg1 = await downloadImage('https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=800&q=80', 'fez1.jpg').catch(() => '/uploads/colivings/spot1.jpg');
  const fezImg2 = await downloadImage('https://images.unsplash.com/photo-1538612140411-8078028afcc9?w=800&q=80', 'fez2.jpg').catch(() => '/uploads/colivings/spot1.jpg');
  await prisma.coliving.create({
    data: {
      hoteId: hote1.id,
      titre: 'Riad Innov Fès',
      description: 'Plongez dans le Moyen Âge avec le Wi-Fi du 21e siècle. Situé dans la plus grande médina piétonne du monde, ce riad historique a été reconverti pour les créatifs nomades.',
      adresse: 'Batha, Fès 30000, Maroc',
      latitude: 34.062, longitude: -4.978,
      lienGoogleMap: 'https://maps.app.goo.gl/Fes',
      regles: 'Les portes ferment à minuit.',
      statut: StatutValidation.VALIDE,
      images: { create: [{ url: fezImg1, isPrincipale: true, ordre: 1 }, { url: fezImg2, isPrincipale: false, ordre: 2 }] },
      chambres: {
        create: [
          { nom: 'Suite Zellige', description: 'Lit à baldaquin', capacitePersonnes: 2, litsDisponibles: 2, prixParMois: 6000, typeChambre: TypeChambre.PRIVEE },
          { nom: 'Chambre Andalousie', description: 'Petite chambre cosy', capacitePersonnes: 1, litsDisponibles: 1, prixParMois: 3500, typeChambre: TypeChambre.PRIVEE }
        ]
      },
      equipementLinks: { create: [{ equipementId: equipements[0].id }, { equipementId: equipements[4].id }] }
    }
  });

  // 11. Essaouira Kitesurf Coliving (Essaouira)
  const essaouiraImg1 = await downloadImage('https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?w=800&q=80', 'essaouira_kite1.jpg').catch(() => '/uploads/colivings/sundesk2.jpg');
  const essaouiraImg2 = await downloadImage('https://images.unsplash.com/photo-1549420077-83ebce287b41?w=800&q=80', 'essaouira_kite2.jpg').catch(() => '/uploads/colivings/sundesk2.jpg');
  await prisma.coliving.create({
    data: {
      hoteId: hote2.id,
      titre: 'Kite & Code Essaouira',
      description: 'Travailler le matin, naviguer l\'après-midi. Une communauté axée sur les sports nautiques avec des bureaux ergonomiques et un local sécurisé pour le matériel.',
      adresse: 'Sidi Kaouki, Essaouira 44000, Maroc',
      latitude: 31.349, longitude: -9.794,
      lienGoogleMap: 'https://maps.app.goo.gl/SidiKaouki',
      regles: 'Matériel de kite à rincer au jet d\'eau extérieur.',
      statut: StatutValidation.VALIDE,
      images: { create: [{ url: essaouiraImg1, isPrincipale: true, ordre: 1 }, { url: essaouiraImg2, isPrincipale: false, ordre: 2 }] },
      chambres: {
        create: [
          { nom: 'Chambre Alizé', description: 'Vue mer', capacitePersonnes: 2, litsDisponibles: 2, prixParMois: 6500, typeChambre: TypeChambre.PRIVEE },
          { nom: 'Dortoir des Riders', description: 'Lits superposés', capacitePersonnes: 6, litsDisponibles: 6, prixParMois: 2800, typeChambre: TypeChambre.PARTAGEE_DORTOIR }
        ]
      },
      equipementLinks: { create: [{ equipementId: equipements[0].id }, { equipementId: equipements[1].id }, { equipementId: equipements[5].id }] }
    }
  });

  // 12. Marrakech Medina Hub (Marrakech)
  const kechHubImg1 = await downloadImage('https://images.unsplash.com/photo-1558223697-3e813fffa16c?w=800&q=80', 'kech_hub1.jpg').catch(() => '/uploads/colivings/outsite1.jpg');
  const kechHubImg2 = await downloadImage('https://images.unsplash.com/photo-1528699633788-424224dc89b5?w=800&q=80', 'kech_hub2.jpg').catch(() => '/uploads/colivings/outsite1.jpg');
  await prisma.coliving.create({
    data: {
      hoteId: hote3.id,
      titre: 'Gueliz Digital Oasis',
      description: 'Pour ceux qui préfèrent le quartier moderne de Gueliz. Une villa avec piscine offrant des espaces de coworking ultra-modernes, une salle de réunion et un café de spécialité sur place.',
      adresse: 'Rue Ibn Aicha, Gueliz, Marrakech 40000, Maroc',
      latitude: 31.636, longitude: -8.013,
      lienGoogleMap: 'https://maps.app.goo.gl/Gueliz',
      regles: 'L\'espace coworking est ouvert 24/7 pour les résidents.',
      statut: StatutValidation.VALIDE,
      images: { create: [{ url: kechHubImg1, isPrincipale: true, ordre: 1 }, { url: kechHubImg2, isPrincipale: false, ordre: 2 }] },
      chambres: {
        create: [
          { nom: 'Master Suite Gueliz', description: 'Grande chambre avec bureau', capacitePersonnes: 2, litsDisponibles: 2, prixParMois: 10000, typeChambre: TypeChambre.PRIVEE },
          { nom: 'Chambre Exécutive', description: 'Confort et design moderne', capacitePersonnes: 1, litsDisponibles: 1, prixParMois: 6500, typeChambre: TypeChambre.PRIVEE }
        ]
      },
      equipementLinks: { create: [{ equipementId: equipements[0].id }, { equipementId: equipements[1].id }, { equipementId: equipements[3].id }] }
    }
  });

  console.log('✅ Base de données seedée avec succès avec des images téléchargées localement !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
