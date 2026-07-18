import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const DEMO_PASSWORD = 'darlink123';

async function main() {
  await prisma.participationActivite.deleteMany();
  await prisma.activite.deleteMany();
  await prisma.paiement.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.avis.deleteMany();
  await prisma.colivingEquipement.deleteMany();
  await prisma.chambre.deleteMany();
  await prisma.image.deleteMany();
  await prisma.coliving.deleteMany();
  await prisma.client.deleteMany();
  await prisma.hote.deleteMany();
  await prisma.document.deleteMany();
  await prisma.equipement.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const wifi = await prisma.equipement.create({
    data: { nom: 'WiFi Haut Débit', icone: '📶' },
  });
  const cuisine = await prisma.equipement.create({
    data: { nom: 'Cuisine Équipée', icone: '🍳' },
  });
  const gym = await prisma.equipement.create({
    data: { nom: 'Salle de Sport', icone: '💪' },
  });
  const piscine = await prisma.equipement.create({
    data: { nom: 'Piscine', icone: '🏊' },
  });
  const vue = await prisma.equipement.create({
    data: { nom: 'Vue Mer', icone: '🌊' },
  });
  const espace = await prisma.equipement.create({
    data: { nom: 'Espace Commun', icone: '👥' },
  });
  const clim = await prisma.equipement.create({
    data: { nom: 'Climatisation', icone: '❄️' },
  });

  const adminUser = await prisma.user.create({
    data: {
      nom: 'Admin Darlink',
      email: 'admin@darlink.com',
      motDePasse: passwordHash,
      telephone: '+212600000001',
      photoProfil: 'https://ui-avatars.com/api/?background=DD7246&color=fff&bold=true&name=Admin',
      role: 'ADMIN',
    },
  });

  const hote1User = await prisma.user.create({
    data: {
      nom: 'Marie Laurent',
      email: 'marie@darlink.com',
      motDePasse: passwordHash,
      telephone: '+212612345678',
      photoProfil: 'https://ui-avatars.com/api/?background=DD7246&color=fff&bold=true&name=Marie',
      role: 'HOTE',
    },
  });

  const hote1 = await prisma.hote.create({
    data: { userId: hote1User.id, ribBanque: 'MA123456789' },
  });

  const hote2User = await prisma.user.create({
    data: {
      nom: 'Ahmed Bennani',
      email: 'ahmed@darlink.com',
      motDePasse: passwordHash,
      telephone: '+212612345679',
      photoProfil: 'https://ui-avatars.com/api/?background=DD7246&color=fff&bold=true&name=Ahmed',
      role: 'HOTE',
    },
  });

  const hote2 = await prisma.hote.create({
    data: { userId: hote2User.id, ribBanque: 'MA987654321' },
  });

  const hote3User = await prisma.user.create({
    data: {
      nom: 'Fatima Bouazza',
      email: 'fatima@darlink.com',
      motDePasse: passwordHash,
      telephone: '+212612345680',
      photoProfil: 'https://ui-avatars.com/api/?background=DD7246&color=fff&bold=true&name=Fatima',
      role: 'HOTE',
    },
  });

  const hote3 = await prisma.hote.create({
    data: { userId: hote3User.id, ribBanque: 'MA456789123' },
  });

  const coliving1 = await prisma.coliving.create({
    data: {
      hoteId: hote1.userId,
      titre: 'Villa Surf & Yoga',
      description:
        "Une magnifique villa avec vue sur l'océan, parfaite pour les surfeurs et les passionnés de yoga. Ambiance communautaire chaleureuse.",
      adresse: 'Tamraght, Agadir',
      latitude: 30.5186,
      longitude: -9.6798,
      lienGoogleMap: 'https://maps.google.com/?q=Tamraght+Agadir',
      regles: 'Pas de bruit après 22h, partage des tâches communes, respect des espaces partagés',
      statut: 'VALIDE',
      equipementLinks: {
        create: [wifi.id, cuisine.id, gym.id, piscine.id, vue.id, espace.id].map((equipementId) => ({
          equipementId,
        })),
      },
    },
  });

  const coliving2 = await prisma.coliving.create({
    data: {
      hoteId: hote2.userId,
      titre: 'Médina Digital Hub',
      description:
        'Un hub numérique situé au cœur de la médina de Marrakech. Parfait pour les digital nomads et entrepreneurs.',
      adresse: 'Marrakech, Maroc',
      latitude: 31.6295,
      longitude: -7.9811,
      lienGoogleMap: 'https://maps.google.com/?q=Marrakech',
      regles: 'Horaires flexibles, environnement de travail partagé, événements mensuels',
      statut: 'VALIDE',
      equipementLinks: {
        create: [wifi.id, cuisine.id, espace.id].map((equipementId) => ({ equipementId })),
      },
    },
  });

  const coliving3 = await prisma.coliving.create({
    data: {
      hoteId: hote3.userId,
      titre: 'Océan Coworking House',
      description:
        "Une maison de coworking accueillante avec vue sur l'océan Atlantique. Idéale pour les créatifs et les startups.",
      adresse: 'Essaouira, Maroc',
      latitude: 31.5085,
      longitude: -9.7595,
      lienGoogleMap: 'https://maps.google.com/?q=Essaouira',
      regles: 'Respect du calme, partage équitable, communauté engagée',
      statut: 'VALIDE',
      equipementLinks: {
        create: [wifi.id, cuisine.id, espace.id, vue.id].map((equipementId) => ({ equipementId })),
      },
    },
  });

  const colivingPending1 = await prisma.coliving.create({
    data: {
      hoteId: hote2.userId,
      titre: 'Atlas Nomad Lodge',
      description: 'Nouveau coliving en montagne, en attente de validation admin.',
      adresse: 'Imlil, Haut Atlas',
      latitude: 31.1345,
      longitude: -7.9157,
      regles: 'Éco-responsable, feu interdit en intérieur',
      statut: 'EN_ATTENTE',
      equipementLinks: {
        create: [wifi.id, cuisine.id, clim.id].map((equipementId) => ({ equipementId })),
      },
    },
  });

  const colivingPending2 = await prisma.coliving.create({
    data: {
      hoteId: hote2.userId,
      titre: 'Casablanca Tech House',
      description: 'Deuxième soumission en attente pour le même hôte (flux multi-colivings).',
      adresse: 'Ain Diab, Casablanca',
      latitude: 33.5928,
      longitude: -7.6192,
      regles: 'Coworking 9h-20h',
      statut: 'EN_ATTENTE',
      equipementLinks: {
        create: [wifi.id, espace.id].map((equipementId) => ({ equipementId })),
      },
    },
  });

  await prisma.image.createMany({
    data: [
      {
        colivingId: coliving1.id,
        url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop',
        isPrincipale: true,
        ordre: 0,
      },
      {
        colivingId: coliving1.id,
        url: 'https://images.unsplash.com/photo-1521107313947-6ceb5b60b892?q=80&w=2070&auto=format&fit=crop',
        isPrincipale: false,
        ordre: 1,
      },
      {
        colivingId: coliving2.id,
        url: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=2071&auto=format&fit=crop',
        isPrincipale: true,
        ordre: 0,
      },
      {
        colivingId: coliving2.id,
        url: 'https://images.unsplash.com/photo-1455165814004-1126cb7a3368?q=80&w=2070&auto=format&fit=crop',
        isPrincipale: false,
        ordre: 1,
      },
      {
        colivingId: coliving3.id,
        url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070&auto=format&fit=crop',
        isPrincipale: true,
        ordre: 0,
      },
      {
        colivingId: coliving3.id,
        url: 'https://images.unsplash.com/photo-1537512180841-6a224de71d5f?q=80&w=2070&auto=format&fit=crop',
        isPrincipale: false,
        ordre: 1,
      },
      {
        colivingId: colivingPending1.id,
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop',
        isPrincipale: true,
        ordre: 0,
      },
      {
        colivingId: colivingPending2.id,
        url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop',
        isPrincipale: true,
        ordre: 0,
      },
    ],
  });

  await prisma.chambre.createMany({
    data: [
      {
        colivingId: coliving1.id,
        nom: 'Chambre Privée Vue Mer',
        description: "Chambre spacieuse avec salle de bain privée et balcon avec vue sur l'océan",
        capacitePersonnes: 1,
        litsDisponibles: 1,
        prixParMois: 5000,
        typeChambre: 'PRIVEE',
      },
      {
        colivingId: coliving1.id,
        nom: 'Chambre Partagée Dortoir',
        description: 'Dortoir confortable avec 4 lits, salle de bain commune',
        capacitePersonnes: 4,
        litsDisponibles: 4,
        prixParMois: 2500,
        typeChambre: 'PARTAGEE_DORTOIR',
      },
      {
        colivingId: coliving2.id,
        nom: 'Bureau Privé',
        description: 'Espace de travail privé avec lit intégré et salle de bain',
        capacitePersonnes: 1,
        litsDisponibles: 1,
        prixParMois: 4500,
        typeChambre: 'PRIVEE',
      },
      {
        colivingId: coliving2.id,
        nom: 'Espace Coworking',
        description: "Bureau partagé pour travailler avec d'autres nomades",
        capacitePersonnes: 1,
        litsDisponibles: 0,
        prixParMois: 1500,
        typeChambre: 'PARTAGEE_DORTOIR',
      },
      {
        colivingId: coliving3.id,
        nom: 'Suite Créative',
        description: 'Suite avec chambre, salle de bain et espace de créativité',
        capacitePersonnes: 2,
        litsDisponibles: 2,
        prixParMois: 4000,
        typeChambre: 'PRIVEE',
      },
      {
        colivingId: coliving3.id,
        nom: 'Chambre Studio',
        description: 'Studio confortable avec kitchenette et terrasse',
        capacitePersonnes: 1,
        litsDisponibles: 1,
        prixParMois: 3500,
        typeChambre: 'PRIVEE',
      },
      {
        colivingId: colivingPending1.id,
        nom: 'Chambre double Atlas',
        description: 'Vue montagne',
        capacitePersonnes: 2,
        litsDisponibles: 2,
        prixParMois: 3200,
        typeChambre: 'PRIVEE',
      },
      {
        colivingId: colivingPending2.id,
        nom: 'Lit en dortoir',
        description: '8 lits',
        capacitePersonnes: 1,
        litsDisponibles: 8,
        prixParMois: 1800,
        typeChambre: 'PARTAGEE_DORTOIR',
      },
    ],
  });

  const clientUser = await prisma.user.create({
    data: {
      nom: 'Jean Dupont',
      email: 'jean@example.com',
      motDePasse: passwordHash,
      telephone: '+212612345690',
      photoProfil: 'https://ui-avatars.com/api/?background=DD7246&color=fff&bold=true&name=Jean',
      role: 'CLIENT',
    },
  });

  const client = await prisma.client.create({
    data: {
      userId: clientUser.id,
      profession: 'Digital Nomad',
      biographie: 'Voyageur passionné par les cultures et les rencontres',
    },
  });

  await prisma.avis.createMany({
    data: [
      {
        clientId: client.userId,
        colivingId: coliving1.id,
        note: 5,
        commentaire: 'Expérience incroyable! Lieu magnifique avec une communauté formidable.',
      },
      {
        clientId: client.userId,
        colivingId: coliving2.id,
        note: 4,
        commentaire: 'Très bon pour travailler, ambiance professionnelle et conviviale.',
      },
    ],
  });

  await prisma.activite.createMany({
    data: [
      {
        colivingId: coliving1.id,
        titre: 'Cours de Yoga Matinal',
        description: "Yoga gratuit tous les matins à 6h avec vue sur l'océan",
        datePrevue: new Date('2026-05-20T06:00:00'),
        prixOptionnel: 0,
        typeActivite: 'BIEN_ETRE_YOGA',
      },
      {
        colivingId: coliving1.id,
        titre: 'Sortie Surf',
        description: 'Cours de surf avec instructeur professionnel',
        datePrevue: new Date('2026-05-21T08:00:00'),
        prixOptionnel: 150,
        typeActivite: 'SPORT_SURF',
      },
      {
        colivingId: coliving2.id,
        titre: 'Soirée Networking',
        description: 'Rencontre des entrepreneurs et digital nomads au coeur de la médina',
        datePrevue: new Date('2026-05-22T18:00:00'),
        prixOptionnel: 0,
        typeActivite: 'SOIREE_SOCIALE',
      },
      {
        colivingId: coliving3.id,
        titre: 'Excursion à Essaouira',
        description: "Visite guidée de la médina et plage d'Essaouira",
        datePrevue: new Date('2026-05-23T09:00:00'),
        prixOptionnel: 200,
        typeActivite: 'EXCURSION',
      },
    ],
  });

  const chambreColiving1 = await prisma.chambre.findFirst({
    where: { colivingId: coliving1.id, nom: 'Chambre Privée Vue Mer' },
  });

  if (chambreColiving1) {
    await prisma.reservation.create({
      data: {
        clientId: client.userId,
        chambreId: chambreColiving1.id,
        dateDebut: new Date('2026-07-01'),
        dateFin: new Date('2026-07-20'),
        nombrePersonnes: 1,
        prixTotal: 3333.33,
        statut: 'EN_ATTENTE',
      },
    });
  }

  console.log('✅ Base de données seedée avec succès.');
  console.log(`\nMot de passe démo pour tous les comptes : ${DEMO_PASSWORD}\n`);
  console.log('Comptes :');
  console.log(`  Admin     ${adminUser.email}`);
  console.log(`  Hôte      ${hote1User.email} | ${hote2User.email} | ${hote3User.email}`);
  console.log(`  Client    ${clientUser.email}`);
  console.log('\nColivings VALIDÉS (visibles catalogue) :', coliving1.titre, '|', coliving2.titre, '|', coliving3.titre);
  console.log('Colivings EN_ATTENTE (modération admin) :', colivingPending1.titre, '|', colivingPending2.titre);
  console.log('\nUne réservation EN_ATTENTE a été créée sur Villa Surf (Marie peut la confirmer / refuser).');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
