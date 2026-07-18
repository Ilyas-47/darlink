import React, { useState } from 'react';
import { Check, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const FEATURES = [
  'Espaces coworking lumineux avec vue sur la médina',
  'Connexion fibre optique 300Mbps dans chaque chambre',
  'Salles de réunion privées réservables à la demande',
  'Ambiance calme et inspirante 24h/24',
  'Café et thé à la menthe inclus toute la journée',
];

const CommunityDesignSection: React.FC = () => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    setRotate({
      x: ((yc - y) / yc) * 6,
      y: ((x - xc) / xc) * 6
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <section
      style={{
        backgroundColor: '#0C0805',
        padding: '120px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow effect blobs */}
      <div className="blob" style={{ background: 'radial-gradient(circle, rgba(221,114,70,0.12) 0%, transparent 60%)', top: '10%', right: '10%', width: '450px', height: '450px' }} />
      <div className="blob" style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 60%)', bottom: '10%', left: '10%', width: '400px', height: '400px', animationDelay: '2.5s' }} />

      <div
        style={{
          maxWidth: '1200px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '80px', alignItems: 'center',
          position: 'relative', zIndex: 1,
        }}
      >
        {/* Left: 3D Collage */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ 
            position: 'relative', 
            height: '480px',
            transformStyle: 'preserve-3d',
            perspective: '1000px'
          }}
        >
          <motion.div
            animate={{ rotateX: rotate.x, rotateY: rotate.y }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d' }}
          >
            {/* Top Left Image */}
            <div style={{
              position: 'absolute', top: 0, left: 0,
              width: '72%', height: '68%',
              borderRadius: '24px', overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              transform: 'translateZ(10px)'
            }}>
              <img
                src="src/assets/images/riad_maroc.jpg"
                alt="Riad interior"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Bottom Right Image */}
            <div style={{
              position: 'absolute', bottom: 0, right: 0,
              width: '62%', height: '54%',
              borderRadius: '24px', overflow: 'hidden',
              border: '4px solid #0C0805',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              transform: 'translateZ(30px)'
            }}>
              <img
                src="src/assets/images/riad_maroc.jpg"
                alt="Workspace"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Floating Satisfaction Badge (Glassmorphism) */}
            <div style={{
              position: 'absolute', top: '38%', right: '-8px',
              backgroundColor: '#DD7246', color: 'white',
              borderRadius: '16px', padding: '12px 20px',
              fontSize: '0.85rem', fontWeight: 800,
              boxShadow: '0 12px 32px rgba(221,114,70,0.35)',
              display: 'flex', alignItems: 'center', gap: '8px',
              transform: 'translateZ(45px)'
            }}>
              <Trophy size={18} /> Top Coliving 2024
            </div>
          </motion.div>
        </motion.div>

        {/* Right: text */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#DD7246', marginBottom: '16px' }}>
            Espaces de travail
          </p>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              fontWeight: 800, color: 'white',
              letterSpacing: '-1.5px', lineHeight: 1.15,
              marginBottom: '24px',
              fontFamily: 'Outfit, sans-serif'
            }}
          >
            Un Design conçu pour <br />
            <span style={{ color: '#DD7246', textShadow: '0 0 30px rgba(221,114,70,0.2)' }}>le Focus.</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, marginBottom: '36px' }}>
            Chaque espace Darlink est conçu avec soin pour maximiser votre productivité tout en vous plongeant dans l'esthétique marocaine contemporaine.
          </p>

          {/* Feature list */}
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '36px' }}>
            {FEATURES.map((f, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)' }}>
                <div
                  style={{
                    width: '22px', height: '22px', borderRadius: '50%',
                    backgroundColor: 'rgba(221,114,70,0.15)', border: '1px solid rgba(221,114,70,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: '2px',
                  }}
                >
                  <Check size={12} color="#DD7246" strokeWidth={3} />
                </div>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunityDesignSection;