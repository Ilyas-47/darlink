import React from 'react';
import { Check, HelpCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';

const COMPARE_DATA = [
  { feature: 'Entièrement meublé', coliving: 'Included', studio: 'Varies', shared: 'Varies' },
  { feature: 'Charges incluses', coliving: 'Included', studio: 'Usually extra', shared: 'Varies' },
  { feature: 'Wi-Fi haut débit', coliving: 'Included', studio: 'Varies', shared: 'Varies' },
  { feature: 'Ménage', coliving: 'Included', studio: 'Usually extra', shared: 'Usually extra' },
  { feature: 'Essentiels de cuisine', coliving: 'Included', studio: 'Varies', shared: 'Varies' },
  { feature: 'Espaces de travail', coliving: 'Included', studio: 'Varies', shared: 'Varies' },
  { feature: 'Buanderie', coliving: 'Included', studio: 'Varies', shared: 'Varies' },
  { feature: 'Conditions de bail flexibles', coliving: 'Included', studio: 'Usually extra', shared: 'Varies' },
  { feature: 'Événements communautaires', coliving: 'Included', studio: 'Usually extra', shared: 'Usually extra' },
  { feature: 'Emménagement facile', coliving: 'Included', studio: 'Usually extra', shared: 'Usually extra' },
];

const renderValue = (val: string) => {
  if (val === 'Included') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#DD7246', fontWeight: 700 }}>
        <Check size={18} strokeWidth={3} /> Inclus
      </div>
    );
  }
  if (val === 'Varies') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9CA3AF', fontWeight: 500 }}>
        <HelpCircle size={18} /> Variable
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9CA3AF', fontWeight: 500 }}>
      <X size={18} /> Souvent en extra
    </div>
  );
};

const CompareSection: React.FC = () => {
  return (
    <section className="container" style={{ padding: '96px 24px', backgroundColor: 'white' }}>
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: '64px' }}
      >
        <p style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#DD7246', marginBottom: '12px' }}>
          Pourquoi choisir le coliving ?
        </p>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1A1A2E', letterSpacing: '-0.5px', marginBottom: '20px' }}>
          Comparez ce qui est inclus
        </h2>
        <p style={{ color: '#6B7280', fontSize: '1.1rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.65 }}>
          Un seul prix mensuel inclut beaucoup plus — des meubles au Wi-Fi, en passant par le ménage et les avantages de la communauté.
        </p>
      </motion.div>

      {/* Modern Table Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{ 
          overflowX: 'auto', 
          borderRadius: '24px', 
          border: '1.5px solid #F0EDE8',
          boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
          backgroundColor: 'white'
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #F0EDE8' }}>
              <th style={{ textAlign: 'left', padding: '24px', width: '35%' }}></th>
              <th style={{ 
                textAlign: 'left', padding: '24px', 
                width: '25%', fontSize: '1.2rem', fontWeight: 800, 
                color: '#DD7246', backgroundColor: 'rgba(221, 114, 70, 0.03)' 
              }}>
                Darlink Coliving
              </th>
              <th style={{ textAlign: 'left', padding: '24px', width: '20%', fontSize: '1.15rem', fontWeight: 700, color: '#1A1A2E' }}>Studio</th>
              <th style={{ textAlign: 'left', padding: '24px', width: '20%', fontSize: '1.15rem', fontWeight: 700, color: '#1A1A2E' }}>Colocation</th>
            </tr>
          </thead>
          <tbody>
            {COMPARE_DATA.map((row, idx) => (
              <tr 
                key={idx} 
                style={{ 
                  borderBottom: '1px solid #F0EDE8', 
                  transition: 'background-color 0.2s',
                }}
                className="compare-row"
              >
                <td style={{ padding: '20px 24px', fontWeight: 700, fontSize: '1rem', color: '#1A1A2E' }}>{row.feature}</td>
                <td style={{ padding: '20px 24px', backgroundColor: 'rgba(221, 114, 70, 0.03)' }}>{renderValue(row.coliving)}</td>
                <td style={{ padding: '20px 24px' }}>{renderValue(row.studio)}</td>
                <td style={{ padding: '20px 24px' }}>{renderValue(row.shared)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <style>{`
        .compare-row:hover {
          background-color: #FAFAF9;
        }
      `}</style>
    </section>
  );
};

export default CompareSection;
