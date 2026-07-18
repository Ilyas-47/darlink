import React from 'react';
import { TrendingUp, Users, Home, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const Stats: React.FC = () => {
  const stats = [
    { icon: Home, value: '150+', label: 'Propriétés', sub: 'Espaces disponibles' },
    { icon: Users, value: '2 500+', label: 'Résidents', sub: 'Ont trouvé leur home' },
    { icon: Star, value: '4.8/5', label: 'Note moyenne', sub: 'Avis vérifiés' },
    { icon: TrendingUp, value: '15+', label: 'Villes', sub: 'À travers le Maroc' },
  ];

  return (
    <section style={{ padding: '96px 24px', backgroundColor: 'white' }}>
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <p style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#DD7246', marginBottom: '12px' }}>
            La communauté Darlink
          </p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1A1A2E', letterSpacing: '-0.5px', marginBottom: '20px' }}>
            En chiffres qui parlent
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#6B7280', maxWidth: '580px', margin: '0 auto', lineHeight: 1.65 }}>
            Une communauté en pleine croissance de nomades numériques, créatifs et entrepreneurs au Maroc.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
          }}
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(221,114,70,0.08)', borderColor: 'rgba(221,114,70,0.3)' }}
                style={{
                  backgroundColor: 'white',
                  padding: '48px 32px',
                  borderRadius: '24px',
                  border: '1.5px solid #F0EDE8',
                  textAlign: 'center',
                  cursor: 'default',
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(221, 114, 70, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    color: '#DD7246',
                  }}
                >
                  <Icon size={26} />
                </div>
                <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#DD7246', letterSpacing: '-1.5px', lineHeight: 1, marginBottom: '8px' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '6px' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#9CA3AF' }}>
                  {stat.sub}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;