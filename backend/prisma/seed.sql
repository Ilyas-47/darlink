-- ==========================================
-- SCRIPT DE SEED DARLINK - DONNÉES DE TEST
-- ==========================================

-- 1. Insérer les utilisateurs (hôtes)
INSERT INTO users (nom, email, mot_de_passe, telephone, photo_profil, role) VALUES
('Marie Laurent', 'marie@darlink.com', 'hashed_password', '+212612345678', 'https://ui-avatars.com/api/?background=DD7246&color=fff&bold=true&name=Marie', 'HOTE'),
('Ahmed Bennani', 'ahmed@darlink.com', 'hashed_password', '+212612345679', 'https://ui-avatars.com/api/?background=DD7246&color=fff&bold=true&name=Ahmed', 'HOTE'),
('Fatima Bouazza', 'fatima@darlink.com', 'hashed_password', '+212612345680', 'https://ui-avatars.com/api/?background=DD7246&color=fff&bold=true&name=Fatima', 'HOTE');

-- 2. Insérer les hôtes (liés aux utilisateurs)
INSERT INTO hotes (user_id, rib_banque) VALUES
(1, 'FR123456789'),
(2, 'FR987654321'),
(3, 'FR456789123');

-- 3. Créer un client pour les avis
INSERT INTO users (nom, email, mot_de_passe, telephone, photo_profil, role) VALUES
('Jean Dupont', 'jean@example.com', 'hashed_password', '+212612345690', 'https://ui-avatars.com/api/?background=DD7246&color=fff&bold=true&name=Jean', 'CLIENT');

INSERT INTO clients (user_id, profession, biographie) VALUES
(4, 'Digital Nomad', 'Voyageur passionné par les cultures et les rencontres');

-- 4. Insérer les équipements
INSERT INTO equipements (nom, icone) VALUES
('WiFi Haut Débit', '📶'),
('Cuisine Équipée', '🍳'),
('Salle de Sport', '💪'),
('Piscine', '🏊'),
('Vue Mer', '🌊'),
('Espace Commun', '👥');

-- 5. Insérer les colivings (propriétés)
INSERT INTO colivings (hote_id, titre, description, adresse, lien_google_map, regles, statut) VALUES
(1, 'Villa Surf & Yoga', 'Une magnifique villa avec vue sur l''océan, parfaite pour les surfeurs et les passionnés de yoga. Ambiance communautaire chaleureuse.', 'Tamraght, Agadir', 'https://maps.google.com/?q=Tamraght+Agadir', 'Pas de bruit après 22h, partage des tâches communes, respect des espaces partagés', 'VALIDE'),
(2, 'Médina Digital Hub', 'Un hub numérique situé au cœur de la médina de Marrakech. Parfait pour les digital nomads et entrepreneurs.', 'Marrakech, Maroc', 'https://maps.google.com/?q=Marrakech', 'Horaires flexibles, environnement de travail partagé, événements mensuels', 'VALIDE'),
(3, 'Océan Coworking House', 'Une maison de coworking accueillante avec vue sur l''océan Atlantique. Idéale pour les créatifs et les startups.', 'Essaouira, Maroc', 'https://maps.google.com/?q=Essaouira', 'Respect du calme, partage équitable, communauté engagée', 'VALIDE');

-- 6. Insérer les images
INSERT INTO images (coliving_id, url, is_principale, ordre) VALUES
(1, 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop', true, 0),
(1, 'https://images.unsplash.com/photo-1521107313947-6ceb5b60b892?q=80&w=2070&auto=format&fit=crop', false, 1),
(2, 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=2071&auto=format&fit=crop', true, 0),
(2, 'https://images.unsplash.com/photo-1455165814004-1126cb7a3368?q=80&w=2070&auto=format&fit=crop', false, 1),
(3, 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070&auto=format&fit=crop', true, 0),
(3, 'https://images.unsplash.com/photo-1537512180841-6a224de71d5f?q=80&w=2070&auto=format&fit=crop', false, 1);

-- 7. Lier les équipements aux colivings
INSERT INTO coliving_equipements (coliving_id, equipement_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),
(2, 1), (2, 2), (2, 6),
(3, 1), (3, 2), (3, 6), (3, 5);

-- 8. Insérer les chambres
INSERT INTO chambres (coliving_id, nom, description, capacite_personnes, lits_disponibles, prix_par_mois, type_chambre) VALUES
(1, 'Chambre Privée Vue Mer', 'Chambre spacieuse avec salle de bain privée et balcon avec vue sur l''océan', 1, 1, 5000, 'PRIVEE'),
(1, 'Chambre Partagée Dortoir', 'Dortoir confortable avec 4 lits, salle de bain commune', 4, 4, 2500, 'PARTAGEE_DORTOIR'),
(2, 'Bureau Privé', 'Espace de travail privé avec lit intégré et salle de bain', 1, 1, 4500, 'PRIVEE'),
(2, 'Espace Coworking', 'Bureau partagé pour travailler avec d''autres nomades', 1, 0, 1500, 'PARTAGEE_DORTOIR'),
(3, 'Suite Créative', 'Suite avec chambre, salle de bain et espace de créativité', 2, 2, 4000, 'PRIVEE'),
(3, 'Chambre Studio', 'Studio confortable avec kitchenette et terrasse', 1, 1, 3500, 'PRIVEE');

-- 9. Insérer les avis
INSERT INTO avis (client_id, coliving_id, note, commentaire) VALUES
(4, 1, 5, 'Expérience incroyable! Lieu magnifique avec une communauté formidable.'),
(4, 2, 4, 'Très bon pour travailler, ambiance professionnelle et conviviale.');

-- 10. Insérer les activités
INSERT INTO activites (coliving_id, titre, description, date_prevue, prix_optionnel, type_activite) VALUES
(1, 'Cours de Yoga Matinal', 'Yoga gratuit tous les matins à 6h avec vue sur l''océan', '2026-05-20 06:00:00', 0, 'BIEN_ETRE_YOGA'),
(1, 'Sortie Surf', 'Cours de surf avec instructeur professionnel', '2026-05-21 08:00:00', 150, 'SPORT_SURF'),
(2, 'Soirée Networking', 'Rencontre des entrepreneurs et digital nomads au coeur de la médina', '2026-05-22 18:00:00', 0, 'SOIREE_SOCIALE'),
(3, 'Excursion à Essaouira', 'Visite guidée de la médina et plage d''Essaouira', '2026-05-23 09:00:00', 200, 'EXCURSION');

-- ✅ Seed terminé!
