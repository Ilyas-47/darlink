import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check, BedDouble, Users, Heart } from 'lucide-react';

interface RoomType {
  id: number;
  name: string;
  description: string;
  price: number;
  availability: number;
  images: string[];
  amenities: string[];
  capacity: number;
  bedType: string;
  couplesFriendly: boolean;
}

interface PropertyAboutProps {
  description: string;
  rooms: RoomType[];
  onBook: (roomId?: number) => void;
  goodForTags?: string[];
}

const GOOD_FOR_TAGS = ['Digital Nomads', 'Remote Workers', 'Entrepreneurs', 'Freelancers', 'Groups', 'Solo Travelers'];

const PropertyAbout: React.FC<PropertyAboutProps> = ({ description, rooms, onBook, goodForTags = GOOD_FOR_TAGS }) => {
  const [expandedRoom, setExpandedRoom] = useState<number | null>(null);
  const [showFullDesc, setShowFullDesc] = useState(false);

  const shortDesc = description.slice(0, 220);
  const isLong = description.length > 220;

  return (
    <>
      {/* About */}
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1A1A2E', marginBottom: '12px' }}>
          About this sanctuary
        </h2>
        <p style={{ fontSize: '0.93rem', color: '#6B7280', lineHeight: 1.8, marginBottom: isLong ? '8px' : 0 }}>
          {showFullDesc || !isLong ? description : `${shortDesc}…`}
        </p>
        {isLong && (
          <button
            onClick={() => setShowFullDesc(v => !v)}
            style={{ background: 'none', border: 'none', color: '#DD7246', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', padding: 0 }}
          >
            {showFullDesc ? 'Voir moins' : 'Lire la suite'}
          </button>
        )}
      </section>

      {/* Good for tags */}
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1A1A2E', marginBottom: '14px' }}>
          Parfait pour
        </h2>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {goodForTags.map(tag => (
            <span
              key={tag}
              style={{
                backgroundColor: '#FAF9F7',
                border: '1.5px solid #F0EDE8',
                borderRadius: '100px',
                padding: '6px 14px',
                fontSize: '0.82rem',
                color: '#374151',
                fontWeight: 500,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Room types */}
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1A1A2E', marginBottom: '16px' }}>
          Types de Chambres
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {rooms.map((room, idx) => (
            <div
              key={room.id}
              style={{
                border: `1.5px solid ${expandedRoom === idx ? '#DD724633' : '#F0EDE8'}`,
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: 'white',
                transition: 'border-color 0.2s',
              }}
            >
              {/* Header row */}
              <button
                onClick={() => setExpandedRoom(expandedRoom === idx ? null : idx)}
                style={{
                  width: '100%',
                  padding: '18px 20px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px',
                  textAlign: 'left',
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '4px' }}>
                    {room.name}
                  </h3>
                  <div style={{ display: 'flex', gap: '14px', fontSize: '0.82rem', color: '#9CA3AF' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={12} /> {room.capacity} pers.
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <BedDouble size={12} /> {room.bedType}
                    </span>
                    {room.couplesFriendly && (
                      <span style={{ color: '#DD7246', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><Heart size={12} /> Couples</span>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#DD7246' }}>
                    {room.price.toLocaleString()} MAD
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>/mois</div>
                  <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, marginTop: '2px' }}>
                    ✓ {room.availability} dispo
                  </div>
                </div>
                <div style={{ color: '#9CA3AF', marginLeft: '8px' }}>
                  {expandedRoom === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              {/* Expanded content */}
              {expandedRoom === idx && (
                <div style={{ borderTop: '1px solid #F0EDE8', padding: '20px' }}>
                  {room.images[0] && (
                    <img
                      src={room.images[0]}
                      alt={room.name}
                      style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', marginBottom: '16px', display: 'block' }}
                    />
                  )}
                  <p style={{ fontSize: '0.88rem', color: '#6B7280', marginBottom: '16px', lineHeight: 1.65 }}>
                    {room.description}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                        Équipements
                      </h4>
                      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {room.amenities.map((a, i) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#374151' }}>
                            <Check size={13} color="#059669" /> {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button
                        onClick={() => onBook(room.id)}
                        style={{
                          backgroundColor: '#DD7246',
                          color: 'white',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '12px',
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                          transition: 'background 0.2s',
                        }}
                        onMouseOver={e => (e.currentTarget.style.backgroundColor = '#C4622F')}
                        onMouseOut={e => (e.currentTarget.style.backgroundColor = '#DD7246')}
                      >
                        Réserver cette chambre
                      </button>
                      <button
                        style={{
                          backgroundColor: 'white',
                          border: '1.5px solid #E5E7EB',
                          borderRadius: '10px',
                          padding: '11px',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          color: '#374151',
                        }}
                      >
                        Plus d'infos
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default PropertyAbout;