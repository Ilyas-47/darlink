import React from 'react';
import { motion } from 'framer-motion';

const logos = [
  { name: 'Airbnb', svgPath: 'M16 1c-2 0-3.5 1.5-4.5 3-1-1.5-2.5-3-4.5-3C3.5 1 1 3.5 1 7c0 4.5 6 10 11 14 5-4 11-9.5 11-14 0-3.5-2.5-6-6-6z' }, // Simplified icon paths
  { name: 'Stripe', text: 'stripe' },
  { name: 'Y Combinator', text: 'Y Combinator' },
  { name: 'Vercel', text: '▲ Vercel' },
  { name: 'Techstars', text: 'techstars' }
];

const TrustedBy: React.FC = () => {
  return (
    <section style={{ padding: '48px 24px', backgroundColor: '#FAF9F7', borderBottom: '1px solid #F0EDE8', overflow: 'hidden' }}>
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.5 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1A1A2E', marginBottom: '28px' }}
        >
          Propulsé par les leaders de l'écosystème
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '64px', flexWrap: 'wrap', opacity: 0.6 }}
        >
          {logos.map((logo) => (
            <motion.div
              key={logo.name}
              whileHover={{ scale: 1.05, opacity: 1 }}
              style={{ 
                fontSize: '1.25rem', fontWeight: 800, color: '#9CA3AF', 
                cursor: 'pointer', transition: 'color 0.2s',
                fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.5px',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}
              onMouseOver={e => e.currentTarget.style.color = '#DD7246'}
              onMouseOut={e => e.currentTarget.style.color = '#9CA3AF'}
            >
              {logo.svgPath && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'inherit' }}>
                  <path d={logo.svgPath} />
                </svg>
              )}
              <span>{logo.name === 'Airbnb' ? 'Airbnb' : logo.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustedBy;
