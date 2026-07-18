import React from 'react';
import { Users, Home, TrendingUp, Calendar } from 'lucide-react';

interface AdminStatsCardsProps {
  totalUsers: number;
  totalListings: number;
  netRevenue: string;
  pendingColivings: number;
  totalReservations: number;
}

const AdminStatsCards: React.FC<AdminStatsCardsProps> = ({
  totalUsers, totalListings, netRevenue, pendingColivings, totalReservations,
}) => {
  const cards = [
    {
      icon: <Users size={22} />,
      iconBg: 'rgba(221,114,70,0.12)', iconColor: '#DD7246',
      label: 'Utilisateurs', value: (totalUsers || 0).toLocaleString(),
      sub: `${(totalUsers || 0)} membres inscrits`,
    },
    {
      icon: <Home size={22} />,
      iconBg: 'rgba(79,70,229,0.12)', iconColor: '#4F46E5',
      label: 'Espaces Coliving', value: (totalListings || 0).toLocaleString(),
      sub: `${(pendingColivings || 0)} en attente de validation`,
    },
    {
      icon: <TrendingUp size={22} />,
      iconBg: 'rgba(5,150,105,0.12)', iconColor: '#059669',
      label: 'Revenus confirmés', value: netRevenue,
      sub: 'Volume total confirmé',
      highlight: true,
    },
    {
      icon: <Calendar size={22} />,
      iconBg: 'rgba(217,119,6,0.12)', iconColor: '#D97706',
      label: 'Réservations', value: (totalReservations || 0).toLocaleString(),
      sub: `${(totalReservations || 0)} réservations enregistrées`,
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      marginBottom: '28px',
    }}>
      {cards.map((card, i) => (
        <div key={i} style={{
          backgroundColor: card.highlight ? '#1A1A2E' : 'white',
          borderRadius: '16px',
          padding: '20px',
          border: `1.5px solid ${card.highlight ? 'transparent' : '#F0EDE8'}`,
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Icon */}
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            backgroundColor: card.highlight ? 'rgba(255,255,255,0.12)' : card.iconBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: card.highlight ? 'white' : card.iconColor,
            marginBottom: '16px',
          }}>
            {card.icon}
          </div>

          <p style={{ fontSize: '0.72rem', fontWeight: 700, color: card.highlight ? 'rgba(255,255,255,0.5)' : '#9CA3AF', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            {card.label}
          </p>

          <p style={{ fontSize: card.highlight ? '1.6rem' : '1.5rem', fontWeight: 800, color: card.highlight ? 'white' : '#1A1A2E', margin: '0 0 4px', letterSpacing: '-0.5px' }}>
            {card.value}
          </p>

          <p style={{ fontSize: '0.72rem', fontWeight: 600, color: card.highlight ? 'rgba(255,255,255,0.5)' : '#9CA3AF', margin: 0 }}>
            {card.sub}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AdminStatsCards;