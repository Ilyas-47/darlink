import React from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TopPerformerProps {
  coliving?: {
    id: number;
    titre: string;
    adresse: string;
    image: string | null;
    note: number;
    capacite: number;
    prixParMois: number;
    reviews?: number;
  } | null;
}

const TopPerformer: React.FC<TopPerformerProps> = ({ coliving }) => {
  const navigate = useNavigate();

  return (
    <div style={{
      width: '240px', minWidth: '240px',
      backgroundColor: 'white',
      borderRadius: '16px',
      border: '1.5px solid #F0EDE8',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 18px', borderBottom: '1px solid #F0EDE8' }}>
        <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1A1A2E', margin: 0 }}>
          Meilleure Performance
        </h3>
      </div>

      {!coliving ? (
        <div style={{ padding: '32px 18px', textAlign: 'center', color: '#9CA3AF', fontSize: '0.85rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏅</div>
          Chargement…
        </div>
      ) : (
        <>
          {/* Image */}
          <div style={{ position: 'relative', height: '140px', overflow: 'hidden' }}>
            <img
              src={coliving.image || 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=800'}
              alt={coliving.titre}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Occupancy badge */}
            <div style={{
              position: 'absolute', top: '10px', right: '10px',
              backgroundColor: 'rgba(5,150,105,0.9)', backdropFilter: 'blur(4px)',
              color: 'white', borderRadius: '8px', padding: '4px 9px',
              fontSize: '0.7rem', fontWeight: 700,
            }}>
              95% d'occupation
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1A1A2E', margin: 0, letterSpacing: '-0.3px' }}>
                {coliving.titre}
              </h4>
              <div style={{
                backgroundColor: 'rgba(5,150,105,0.1)',
                borderRadius: '6px', padding: '3px 7px',
                fontSize: '0.7rem', fontWeight: 700, color: '#059669',
              }}>
                ↑ 40%
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#9CA3AF', margin: '0 0 12px', lineHeight: 1.55 }}>
              Situé au cœur de {coliving.adresse?.split(',')[0]}, cet espace a enregistré une hausse de revenus de 40% depuis sa vérification. Numéro un pour les équipements adaptés aux nomades digitaux.
            </p>

            {/* Stats row */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: '8px', paddingTop: '12px',
              borderTop: '1px solid #F5F3F0',
            }}>
              <div>
                <p style={{ fontSize: '0.68rem', color: '#9CA3AF', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                  Réservations
                </p>
                <p style={{ fontSize: '1rem', fontWeight: 800, color: '#1A1A2E', margin: 0 }}>
                  {coliving.reviews || 124}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '0.68rem', color: '#9CA3AF', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                  Note
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={13} fill="#DD7246" color="#DD7246" />
                  <p style={{ fontSize: '1rem', fontWeight: 800, color: '#1A1A2E', margin: 0 }}>
                    {coliving.note}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate(`/property/${coliving.id}`)}
              style={{
                width: '100%', marginTop: '14px', padding: '9px',
                backgroundColor: '#1A1A2E', color: 'white',
                border: 'none', borderRadius: '10px',
                fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = '#DD7246')}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = '#1A1A2E')}
            >
              Voir le coliving →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TopPerformer;