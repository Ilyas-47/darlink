import React, { useState } from 'react';
import { ArrowRight, Globe, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const CommunityHero: React.FC = () => {
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
    <section style={{ backgroundColor: '#0C0805', paddingTop: '140px', paddingBottom: '96px', overflow: 'hidden', position: 'relative' }}>
      
      {/* Mesh Glow Background */}
      <div className="blob" style={{ background: 'radial-gradient(circle, rgba(221,114,70,0.15) 0%, transparent 70%)', top: '10%', left: '10%', width: '400px', height: '400px' }} />
      <div className="blob" style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)', bottom: '10%', right: '10%', width: '350px', height: '350px', animationDelay: '2s' }} />

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 32px 80px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '64px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* ── Left Content ── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p style={{
            fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: '#DD7246', marginBottom: '24px',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <Globe size={16} /> Communauté Globale
          </p>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
            fontWeight: 800, color: 'white',
            letterSpacing: '-2px', lineHeight: 1.1,
            marginBottom: '24px',
            fontFamily: 'Outfit, Inter, sans-serif'
          }}>
            Là où l'ambition globale<br />
            rencontre <span style={{ color: '#DD7246', textShadow: '0 0 30px rgba(221,114,70,0.3)' }}>l'âme marocaine</span>
          </h1>

          <p style={{
            fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.7, maxWidth: '480px', marginBottom: '36px',
          }}>
            Rejoignez une communauté vibrante de nomades numériques, entrepreneurs et créatifs qui ont trouvé leur foyer au Maroc. Événements, coworking, connexions — tout y est.
          </p>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="btn-glow magnetic"
            style={{
              padding: '16px 32px', borderRadius: '16px',
              fontSize: '1rem', fontWeight: 800,
              boxShadow: '0 8px 24px rgba(221,114,70,0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              Rejoindre la communauté <ArrowRight size={18} />
            </div>
          </motion.button>
        </motion.div>

        {/* ── Right Content: 3D Floating Collage ── */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ 
            position: 'relative', 
            height: '440px',
            transformStyle: 'preserve-3d',
            perspective: '1000px'
          }}
        >
          <motion.div
            animate={{ rotateX: rotate.x, rotateY: rotate.y }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d' }}
          >
            {/* Main Image */}
            <div style={{
              position: 'absolute', top: 0, right: 0,
              width: '82%', height: '70%',
              borderRadius: '24px', overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.08)',
              transform: 'translateZ(10px)'
            }}>
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
                alt="Community workspace"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Bottom Left Image */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0,
              width: '54%', height: '46%',
              borderRadius: '24px', overflow: 'hidden',
              border: '4px solid #0C0805',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              transform: 'translateZ(30px)'
            }}>
              <img
                src="src/assets/images/Dîner_Communautaire.jpg"
                alt="Community dinner"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Floating Satisfaction Badge (Glassmorphism) */}
            <div style={{
              position: 'absolute', bottom: '35%', right: '-8px',
              backgroundColor: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px',
              padding: '14px 20px', boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
              display: 'flex', alignItems: 'center', gap: '12px',
              transform: 'translateZ(45px)', color: 'white'
            }}>
              <Star size={24} color="#FBBF24" fill="#FBBF24" />
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 800, lineHeight: 1 }}>4.9 / 5</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px', fontWeight: 500 }}>Satisfaction</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default CommunityHero;