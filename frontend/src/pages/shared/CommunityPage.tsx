import React from 'react';
import { Coffee, Lightbulb, Sun } from 'lucide-react';
import CommunityHero from '../../components/shared/CommunityHero';
import CommunityWhyUs from '../../components/shared/CommunityWhyUs';
import UpcomingColivings from '../../components/shared/UpcomingColivings';
import CommunityDesignSection from '../../components/shared/CommunityDesignSection';
import CommunityEvents from '../../components/shared/CommunityEvents';
import CommunityTestimonials from '../../components/shared/CommunityTestimonials';
import CommunityCTA from '../../components/shared/CommunityCTA';

/* ── Events data (remplacer par fetch /api/activites) ── */
const EVENTS = [
  {
    id: 1,
    title: 'Séance de Yoga Matinale',
    description: "Débutez votre journée avec une séance de yoga relaxante sur la terrasse avec vue sur l'océan.",
    date: '15 Déc 2024', time: '07:00 - 08:30', location: 'Terrasse Principale', attendees: 12,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070&auto=format&fit=crop',
    icon: <Sun size={24} />,
  },
  {
    id: 2,
    title: 'Dîner Communautaire',
    description: 'Partagez un repas délicieux préparé par nos chefs et échangez avec les autres résidents.',
    date: '15 Déc 2024', time: '19:00 - 21:00', location: 'Salle à Manger', attendees: 35,
    image: 'src/assets/images/Dîner_Communautaire.jpg',
    icon: <Coffee size={24} />,
  },
  {
    id: 3,
    title: 'Atelier de Productivité',
    description: "Apprenez des techniques de productivité auprès d'entrepreneurs expérimentés.",
    date: '16 Déc 2024', time: '14:00 - 15:30', location: 'Salle de Coworking', attendees: 18,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
    icon: <Lightbulb size={24} />,
  },
  {
    id: 4,
    title: 'Excursion à la Plage',
    description: "Profitez d'une journée en plage avec les autres résidents. Possibilité de surf !",
    date: '17 Déc 2024', time: '09:00 - 17:00', location: 'Plage de Taghazout', attendees: 28,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2070&auto=format&fit=crop',
    icon: <Sun size={24} />,
  },
];

const SCHEDULE = [
  { time: '09:00', activity: 'Heure de Coworking' },
  { time: '12:00', activity: 'Déjeuner Commun' },
  { time: '16:00', activity: 'Atelier de Networking' },
  { time: '19:00', activity: 'Dîner Social' },
  { time: '21:00', activity: 'Soirée Jeux de Société' },
];

const TESTIMONIALS = [
  {
    id: 1, name: 'Camille Leroy',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400',
    role: 'UX Researcher & Nomade', location: 'Taghazout', rating: 5,
    text: "Travailler face à l'océan avec une connexion fibre irréprochable a changé ma façon de concevoir le télétravail. L'ambiance bienveillante du coliving m'a permis de nouer des partenariats professionnels inattendus.",
  },
  {
    id: 2, name: 'Youssef Bennani',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400',
    role: 'Freelance Full-Stack', location: 'Marrakech', rating: 5,
    text: "En tant qu'indépendant, la solitude pèse parfois. Rejoindre Darlink m'a redonné un cadre de travail structuré et inspirant. Les soirées networking sur le rooftop sont un véritable tremplin pour mon activité !",
  },
  {
    id: 3, name: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400',
    role: 'Consultante SEO', location: 'Essaouira', rating: 4.8,
    text: "Je cherchais un équilibre entre ma charge de travail intense et mon besoin de déconnexion. Les cours de surf matinaux et la qualité de l'espace coworking font de Darlink le compromis parfait.",
  },
  {
    id: 4, name: 'David Chen',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400',
    role: 'Co-fondateur SaaS', location: 'Casablanca', rating: 5,
    text: "Délocaliser une partie de mon équipe chez Darlink a été notre meilleure décision de l'année. Les infrastructures sont premium, et l'immersion culturelle booste littéralement notre créativité au quotidien.",
  },
];

const CommunityPage: React.FC = () => (
  <div style={{ backgroundColor: '#FAF9F7', minHeight: '100vh' }}>
    {/* 1. Hero split */}
    <CommunityHero />

    {/* 2. Why choose — 3 colonnes */}
    <CommunityWhyUs />

    {/* 3. Upcoming Colivings — dynamique API */}
    <UpcomingColivings />

    {/* 4. Dark section "Design that inspires Focus" */}
    <CommunityDesignSection />

    {/* 5. Événements + Programme */}
    <CommunityEvents events={EVENTS} upcomingActivities={SCHEDULE} />

    {/* 6. Témoignages */}
    <CommunityTestimonials testimonials={TESTIMONIALS} />

    {/* 7. CTA orange */}
    <CommunityCTA />
  </div>
);

export default CommunityPage;