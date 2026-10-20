import React, { useState } from 'react';
import { MapPin, Star, Heart, Share2, ShieldCheck } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';

interface PropertyHeaderProps {
  title: string;
  rating: number;
  reviews: number;
  address: string;
  hostName: string;
  hostPhoto?: string;
  capacity: number;
}

const PropertyHeader: React.FC<PropertyHeaderProps> = ({
  title, rating, reviews, address, hostName, hostPhoto, capacity,
}) => {
  const [liked, setLiked] = useState(false);

  return (
    <div style={{ marginBottom: '28px' }}>
      {/* Top row: title + actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '12px' }}>
        <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 800, color: '#1A1A2E', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
          {title}
        </h1>
        <Tooltip.Provider delayDuration={200}>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  onClick={() => setLiked(v => !v)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 16px',
                    borderRadius: '100px',
                    border: '1.5px solid #E5E7EB',
                    backgroundColor: liked ? '#FFF5F0' : 'white',
                    color: liked ? '#DD7246' : '#374151',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <Heart size={16} fill={liked ? '#DD7246' : 'none'} color={liked ? '#DD7246' : 'currentColor'} />
                  {liked ? 'Sauvegardé' : 'Sauvegarder'}
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content sideOffset={5} style={{ backgroundColor: '#1A1A2E', color: 'white', padding: '6px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, zIndex: 100 }}>
                  Ajouter aux favoris
                  <Tooltip.Arrow fill="#1A1A2E" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>

            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 16px',
                    borderRadius: '100px',
                    border: '1.5px solid #E5E7EB',
                    backgroundColor: 'white',
                    color: '#374151',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <Share2 size={16} />
                  Partager
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content sideOffset={5} style={{ backgroundColor: '#1A1A2E', color: 'white', padding: '6px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, zIndex: 100 }}>
                  Partager ce coliving
                  <Tooltip.Arrow fill="#1A1A2E" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>
        </Tooltip.Provider>
      </div>

      {/* Rating + location row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Star size={15} fill="#DD7246" color="#DD7246" />
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1A1A2E' }}>{rating}</span>
          <span style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>({reviews} avis)</span>
        </div>
        <span style={{ color: '#E5E7EB', fontSize: '1.2rem' }}>·</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6B7280', fontSize: '0.88rem' }}>
          <MapPin size={14} color="#DD7246" />
          {address}
        </div>
        <span style={{ color: '#E5E7EB', fontSize: '1.2rem' }}>·</span>
        <span style={{ fontSize: '0.88rem', color: '#6B7280' }}>{capacity} résidents max</span>
      </div>

      {/* Host row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 18px',
          backgroundColor: '#F9F8F6',
          borderRadius: '14px',
          border: '1px solid #F0EDE8',
        }}
      >
        <img
          src={hostPhoto || `https://ui-avatars.com/api/?background=DD7246&color=fff&bold=true&name=${hostName}`}
          alt={hostName}
          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #F0EDE8' }}
        />
        <div>
          <p style={{ fontSize: '0.8rem', color: '#9CA3AF', margin: 0 }}>Hébergé par</p>
          <p style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1A1A2E', margin: 0 }}>{hostName}</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>
          <ShieldCheck size={14} />
          Vérifié Darlink
        </div>
      </div>
    </div>
  );
};

export default PropertyHeader;