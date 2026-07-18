import React, { useState } from 'react';
import { MessageCircle, Check, ShieldCheck, Star, Calendar } from 'lucide-react';
import ContactHostModal from '../host/ContactHostModal';

interface BookingSidebarProps {
  price: number;
  rating: number;
  reviews: number;
  hostName: string;
  hostPhoto?: string;
  hostId: string;
  propertyId: number;
  onBook: () => void;
}

const BookingSidebar: React.FC<BookingSidebarProps> = ({
  price, rating, reviews, hostName, hostPhoto, hostId, propertyId, onBook,
}) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Calculate months
  const months = checkIn && checkOut
    ? Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24 * 30)))
    : 1;

  const serviceFee = Math.round(price * 0.05);
  const total = price * months + serviceFee;

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        border: '1.5px solid #F0EDE8',
        overflow: 'hidden',
        boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
      }}
    >
      {/* Price header */}
      <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid #F0EDE8' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
          <span style={{ fontSize: '1.7rem', fontWeight: 800, color: '#DD7246', letterSpacing: '-0.5px' }}>
            MAD {price.toLocaleString()}
          </span>
          <span style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>/mois</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: '#6B7280' }}>
          <Star size={12} fill="#DD7246" color="#DD7246" />
          <span style={{ fontWeight: 700, color: '#1A1A2E' }}>{rating}</span>
          <span>· {reviews} avis</span>
        </div>
      </div>

      {/* Date picker */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #F0EDE8' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
          Disponibilités
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {[
            { label: 'Arrivée', value: checkIn, set: setCheckIn },
            { label: 'Départ', value: checkOut, set: setCheckOut },
          ].map(({ label, value, set }) => (
            <div
              key={label}
              style={{
                border: '1.5px solid #E5E7EB',
                borderRadius: '10px',
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {label}
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={12} color="#DD7246" />
                <input
                  type="date"
                  value={value}
                  onChange={e => set(e.target.value)}
                  style={{ border: 'none', outline: 'none', fontSize: '0.82rem', color: '#1A1A2E', fontWeight: 600, backgroundColor: 'transparent', width: '100%' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Price breakdown */}
      {(checkIn && checkOut) && (
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #F0EDE8', backgroundColor: '#FAF9F7' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280' }}>
              <span>MAD {price.toLocaleString()} × {months} mois</span>
              <span>{(price * months).toLocaleString()} MAD</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280' }}>
              <span>Frais de service</span>
              <span>{serviceFee.toLocaleString()} MAD</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#1A1A2E', paddingTop: '8px', borderTop: '1px solid #E5E7EB' }}>
              <span>Total</span>
              <span>{total.toLocaleString()} MAD</span>
            </div>
          </div>
        </div>
      )}

      {/* CTA buttons */}
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button
          onClick={onBook}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#DD7246',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = '#C4622F')}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = '#DD7246')}
        >
          Réserver maintenant →
        </button>
        <button
          onClick={() => setIsContactModalOpen(true)}
          style={{
            width: '100%',
            padding: '13px',
            backgroundColor: 'white',
            color: '#1A1A2E',
            border: '1.5px solid #E5E7EB',
            borderRadius: '12px',
            fontSize: '0.88rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'border-color 0.2s',
          }}
          onMouseOver={e => (e.currentTarget.style.borderColor = '#DD7246')}
          onMouseOut={e => (e.currentTarget.style.borderColor = '#E5E7EB')}
        >
          <MessageCircle size={15} />
          Contacter le propriétaire
        </button>
      </div>

      {/* Host info */}
      <div style={{ padding: '0 24px 20px', borderTop: '1px solid #F0EDE8' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px', marginTop: '16px' }}>
          Hébergé par
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={hostPhoto || `https://ui-avatars.com/api/?background=DD7246&color=fff&bold=true&name=${hostName}`}
            alt={hostName}
            style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #F0EDE8' }}
          />
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1A1A2E', margin: 0 }}>{hostName}</p>
            <p style={{ fontSize: '0.78rem', color: '#9CA3AF', margin: 0 }}>Hôte Darlink</p>
          </div>
          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'rgba(5,150,105,0.08)',
              borderRadius: '100px',
              padding: '4px 10px',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#059669',
            }}
          >
            <ShieldCheck size={12} /> Vérifié
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div
        style={{
          margin: '0 24px 24px',
          padding: '14px 16px',
          backgroundColor: '#FAF9F7',
          borderRadius: '12px',
          border: '1px solid #F0EDE8',
        }}
      >
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
          Protection de la Réservation
        </p>
        {[
          'Paiement sécurisé',
          "Garantie d'annulation",
          'Support 24/7',
        ].map(item => (
          <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.83rem', color: '#374151', marginBottom: '6px' }}>
            <Check size={13} color="#059669" />
            {item}
          </div>
        ))}
      </div>

      {hostId && (
        <ContactHostModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
          hostId={parseInt(hostId, 10)}
          hostName={hostName}
          colivingId={propertyId}
        />
      )}
    </div>
  );
};

export default BookingSidebar;