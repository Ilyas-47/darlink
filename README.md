# Darlink 🇲🇦

Darlink est une plateforme innovante dédiée à la réservation et à la gestion d'espaces de coliving et de coworking au Maroc. Elle met en relation des hôtes marocains avec des nomades digitaux, télétravailleurs et passionnés du monde entier.

## 🚀 Prérequis

Avant de lancer le projet, assurez-vous d'avoir installé les éléments suivants sur votre machine :
- **Node.js** (version 18 ou supérieure recommandée)
- **PostgreSQL** (installé et en cours d'exécution)
- **Git**

---

## 🛠️ Installation et Démarrage rapide

Le projet est divisé en deux parties : le `backend` (serveur et base de données) et le `frontend` (interface utilisateur).

### 1. Configuration de la Base de données & du Backend

Ouvrez un terminal et suivez ces étapes :

```bash
# 1. Allez dans le dossier backend
cd backend

# 2. Installez les dépendances
npm install

# 3. Configuration de l'environnement
# Créez un fichier .env à la racine du dossier backend et ajoutez-y :
# DATABASE_URL="postgresql://VOTRE_UTILISATEUR:VOTRE_MOTDEPASSE@localhost:5432/darlink_db?schema=public"
# JWT_SECRET="un_secret_tres_securise_pour_darlink"
# PORT=5000

# 4. Initialisez la base de données PostgreSQL avec Prisma
npx prisma db push

# 5. Remplissez la base de données avec les vraies données marocaines (et les images !)
npm run seed:real

# 6. Lancez le serveur backend
npm run dev
```

Le backend devrait maintenant tourner sur `http://localhost:5000`. Laissez ce terminal ouvert.

---

### 2. Configuration du Frontend

Ouvrez un **nouveau terminal** (tout en gardant le backend actif) :

```bash
# 1. Allez dans le dossier frontend
cd frontend

# 2. Installez les dépendances
npm install

# 3. Lancez l'application web
npm run dev
```

L'application frontend va démarrer et sera accessible dans votre navigateur à l'adresse : **`http://localhost:5173`**

---

## 🧑‍💻 Comptes de Test disponibles

Le script de "seed" a automatiquement généré 3 comptes Hôtes complets avec de vrais espaces de coliving, prêts à être utilisés :

**Tous les comptes utilisent le mot de passe : `darlink`**

1. **Mehdi Alaoui** - `mehdi@darlink.com` (Gère: Outsite Marrakech, Surf House Taghazout, Dar Digital Nomad, Riad Innov Fès)
2. **Youssef Benjelloun** - `youssef@darlink.com` (Gère: SunDesk Taghazout, Dar Zouina Rabat, Aourir Surf, Kite & Code Essaouira)
3. **Salma El Fassi** - `salma@darlink.com` (Gère: The Spot Essaouira, Nomad House Chefchaouen, Kasbah Hub Tanger, Gueliz Digital Oasis)

## 📁 Architecture du projet

- `/backend/` : Serveur Express.js, TypeScript, Prisma ORM, PostgreSQL.
- `/frontend/` : Application React 19, TypeScript, Vite, Tailwind CSS, Framer Motion pour les animations.
- `/backend/uploads/` : Contient toutes les images réelles téléchargées lors du seed.

## 🤝 Contribution

Si vous ajoutez de nouveaux composants, veuillez respecter l'esthétique du projet (couleurs chaudes, animations subtiles avec Framer Motion, design moderne inspiré des meilleures pratiques UI/UX).
