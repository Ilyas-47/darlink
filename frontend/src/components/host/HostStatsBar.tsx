import React from 'react';
import { motion } from 'framer-motion';

interface HostStatsBarProps {
  totalProperties: number;
  pendingCount: number;
  confirmedCount: number;
  pendingReservations: number;
}

const HostStatsBar: React.FC<HostStatsBarProps> = ({
  totalProperties, pendingCount, confirmedCount, pendingReservations,
}) => {
  const stats = [
    {
      label: 'Mes Espaces',
      value: totalProperties,
      sub: `${pendingCount} en attente`,
      color: '#DD7246',
      bg: 'rgba(221,114,70,0.10)',
    },
    {
      label: 'Réservations',
      value: pendingReservations,
      sub: `${confirmedCount} confirmées`,
      color: '#4F46E5',
      bg: 'rgba(79,70,229,0.10)',
    },
    {
      label: 'Taux occup.',
      value: '96%',
      sub: 'Ce mois',
      color: '#059669',
      bg: 'rgba(5,150,105,0.10)',
    },
    {
      label: 'MAD / mois',
      value: '—',
      sub: 'Revenus estimés',
      color: '#D97706',
      bg: 'rgba(217,119,6,0.10)',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}
    >
      {stats.map((s, i) => (
        <motion.div key={i} variants={itemVariants} style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #F0EDE8',
          display: 'flex', flexDirection: 'column', gap: '4px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 8px' }}>
            {s.label}
          </p>
          <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1A1A2E', margin: '0 0 4px', letterSpacing: '-0.5px' }}>
            {s.value}
          </p>
          <p style={{ fontSize: '0.8rem', color: s.color, fontWeight: 600, margin: 0 }}>{s.sub}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default HostStatsBar;