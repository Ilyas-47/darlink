import React from 'react';
import PropertyCard, { type PropertyCardData } from './PropertyCard';
import { SearchX } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

interface PropertyGridProps {
  properties: PropertyCardData[];
  loading: boolean;
}

const PropertyGrid: React.FC<PropertyGridProps> = ({ properties, loading }) => {
  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1.5px solid #F0EDE8',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          >
            <div style={{ backgroundColor: '#F0EDE8', aspectRatio: '4/3' }} />
            <div style={{ padding: '18px 20px' }}>
              <div style={{ height: '16px', backgroundColor: '#F0EDE8', borderRadius: '6px', marginBottom: '8px', width: '70%' }} />
              <div style={{ height: '12px', backgroundColor: '#F0EDE8', borderRadius: '6px', marginBottom: '16px', width: '40%' }} />
              <div style={{ height: '12px', backgroundColor: '#F0EDE8', borderRadius: '6px', marginBottom: '6px' }} />
              <div style={{ height: '12px', backgroundColor: '#F0EDE8', borderRadius: '6px', width: '80%' }} />
            </div>
          </div>
        ))}
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 24px',
          textAlign: 'center',
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1.5px solid #F0EDE8',
        }}
      >
        <SearchX size={48} color="#D1D5DB" style={{ marginBottom: '16px' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '8px' }}>
          Aucun résultat
        </h3>
        <p style={{ fontSize: '0.9rem', color: '#9CA3AF', maxWidth: '320px', lineHeight: 1.6 }}>
          Aucun espace ne correspond à vos filtres. Essayez de modifier la fourchette de prix ou les équipements.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px',
      }}
    >
      {properties.map((p, i) => (
        <PropertyCard key={p.id} property={p} featured={i === 0} />
      ))}
    </motion.div>
  );
};

export default PropertyGrid;