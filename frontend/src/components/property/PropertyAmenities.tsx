import React, { useState } from 'react';
import { Wifi, Coffee, Dumbbell, Users, Wind, Eye, Waves, Car, Utensils, Tv, Lock, Sun } from 'lucide-react';

interface AmenityItem {
  icon: React.ReactNode;
  label: string;
  sub: string;
}

interface PropertyAmenitiesProps {
  amenities?: string[];
}

const ALL_AMENITIES: AmenityItem[] = [
  { icon: <Wifi size={20} />, label: 'WiFi Haut Débit', sub: '300 Mbps garantis' },
  { icon: <Coffee size={20} />, label: 'Cuisine Équipée', sub: 'Tous ustensiles' },
  { icon: <Dumbbell size={20} />, label: 'Salle de Sport', sub: 'Accès gratuit' },
  { icon: <Users size={20} />, label: 'Espaces Communs', sub: 'Salon, terrasse' },
  { icon: <Wind size={20} />, label: 'Climatisation', sub: 'Chaque chambre' },
  { icon: <Eye size={20} />, label: 'Vue Panoramique', sub: 'Terrasse privée' },
  { icon: <Waves size={20} />, label: 'Piscine', sub: 'Accès libre' },
  { icon: <Car size={20} />, label: 'Parking', sub: 'Gratuit inclus' },
  { icon: <Utensils size={20} />, label: 'Restaurant', sub: 'Sur place' },
  { icon: <Tv size={20} />, label: 'Espace Coworking', sub: 'Bureau dédié' },
  { icon: <Lock size={20} />, label: 'Sécurité 24/7', sub: 'Gardien présent' },
  { icon: <Sun size={20} />, label: 'Terrasse Soleil', sub: 'Rooftop accès' },
];

const SHOW_LIMIT = 6;

const PropertyAmenities: React.FC<PropertyAmenitiesProps> = ({ amenities = [] }) => {
  const [showAll, setShowAll] = useState(false);

  // Map custom amenities from API or use defaults
  const items = amenities.length > 0
    ? amenities.map((label, i) => ({
        icon: ALL_AMENITIES[i % ALL_AMENITIES.length].icon,
        label,
        sub: 'Inclus',
      }))
    : ALL_AMENITIES;

  const displayed = showAll ? items : items.slice(0, SHOW_LIMIT);

  return (
    <section style={{ marginBottom: '32px' }}>
      <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1A1A2E', marginBottom: '16px' }}>
        Ce que propose ce logement
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        {displayed.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              backgroundColor: '#FAF9F7',
              borderRadius: '12px',
              border: '1px solid #F0EDE8',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(221,114,70,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#DD7246',
                flexShrink: 0,
              }}
            >
              {item.icon}
            </div>
            <div>
              <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1A1A2E', margin: 0 }}>{item.label}</p>
              <p style={{ fontSize: '0.77rem', color: '#9CA3AF', margin: 0 }}>{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {items.length > SHOW_LIMIT && (
        <button
          onClick={() => setShowAll(v => !v)}
          style={{
            backgroundColor: 'white',
            border: '1.5px solid #E5E7EB',
            borderRadius: '10px',
            padding: '10px 20px',
            fontSize: '0.88rem',
            fontWeight: 700,
            color: '#1A1A2E',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseOver={e => (e.currentTarget.style.borderColor = '#DD7246')}
          onMouseOut={e => (e.currentTarget.style.borderColor = '#E5E7EB')}
        >
          {showAll ? 'Voir moins' : `Voir les ${items.length} équipements`}
        </button>
      )}
    </section>
  );
};

export default PropertyAmenities;