import React from 'react';
import { MapPin, Plus } from 'lucide-react';

interface MyColiving {
  id: number;
  titre: string;
  adresse: string;
  statut: string;
  image: string | null;
  nbChambres: number;
  prixMin: number | null;
}

interface ActiveListingsProps {
  properties: MyColiving[];
  onAddClick?: () => void;
  onEditClick?: (id: number) => void;
}

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  VALIDE:     { label: 'Actif',      color: '#059669', bg: '#D1FAE5' },
  EN_ATTENTE: { label: 'En attente', color: '#D97706', bg: '#FFFBEB' },
  REFUSE:     { label: 'Refusé',     color: '#DC2626', bg: '#FEE2E2' },
};

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=800',
  'https://images.unsplash.com/photo-1631049307038-da0ec9d70304?q=80&w=800',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800',
];

const ActiveListings: React.FC<ActiveListingsProps> = ({ properties, onAddClick, onEditClick }) => {
  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1A1A2E', margin: 0 }}>
          Mes Espaces de coliving
        </h3>
      </div>

      {/* Cards row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
        {properties.map((p, i) => (
          <ListingCard key={p.id} property={p} fallbackImg={FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]} onClick={() => onEditClick?.(p.id)} />
        ))}

        {/* Add new card */}
        <div
          onClick={onAddClick}
          style={{
            borderRadius: '16px', border: '2px dashed #E5E7EB',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '8px', padding: '32px 16px', cursor: 'pointer',
            minHeight: '200px', transition: 'border-color 0.2s, background 0.2s',
          }}
          onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = '#DD7246'; (e.currentTarget as HTMLElement).style.backgroundColor = '#FFFAF7'; }}
          onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB'; (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
        >
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            backgroundColor: 'rgba(221,114,70,0.1)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: '#DD7246',
          }}>
            <Plus size={20} />
          </div>
          <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#9CA3AF', margin: 0, textAlign: 'center' }}>
            Créer un espace
          </p>
        </div>
      </div>
    </div>
  );
};

const ListingCard: React.FC<{ property: MyColiving; fallbackImg: string; onClick: () => void }> = ({ property: p, fallbackImg, onClick }) => {
  const [hov, setHov] = React.useState(false);
  const cfg = STATUS_CFG[p.statut] || { label: p.statut, color: '#9CA3AF', bg: '#F5F3F0' };
  const city = p.adresse?.split(',')[0]?.trim() || p.adresse;

  return (
    <div
      onClick={onClick}
      onMouseOver={() => setHov(true)}
      onMouseOut={() => setHov(false)}
      style={{
        borderRadius: '16px', overflow: 'hidden', cursor: 'pointer',
        border: `1.5px solid ${hov ? '#DD724433' : '#F0EDE8'}`,
        backgroundColor: 'white',
        transition: 'all 0.25s ease',
        transform: hov ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hov ? '0 10px 32px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '140px', overflow: 'hidden' }}>
        <img
          src={p.image || fallbackImg}
          alt={p.titre}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s', transform: hov ? 'scale(1.05)' : 'scale(1)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 55%)' }} />
        {/* Status pill */}
        <div style={{
          position: 'absolute', top: '10px', left: '10px',
          backgroundColor: cfg.bg, color: cfg.color,
          borderRadius: '100px', padding: '3px 9px',
          fontSize: '0.68rem', fontWeight: 700,
        }}>
          {cfg.label}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '14px 16px' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1A1A2E', margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {p.titre}
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#9CA3AF', fontSize: '0.75rem', marginBottom: '12px' }}>
          <MapPin size={11} color="#DD7246" /> {city}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #F5F3F0' }}>
          <div>
            <p style={{ fontSize: '0.65rem', color: '#9CA3AF', margin: '0 0 1px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Occupancy</p>
            <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#059669', margin: 0 }}>92%</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.65rem', color: '#9CA3AF', margin: '0 0 1px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>MAD / mois</p>
            <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#DD7246', margin: 0 }}>
              {p.prixMin?.toLocaleString() || '—'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveListings;