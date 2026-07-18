import React, { useState } from 'react';
import { motion } from 'framer-motion';

type AuthMode = 'login' | 'signup';

interface AuthLeftPanelProps {
  mode: AuthMode;
}

const AuthLeftPanel: React.FC<AuthLeftPanelProps> = ({ mode }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    setRotate({
      x: ((yc - y) / yc) * 4,
      y: ((x - xc) / xc) * 4
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      data-panel="left"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        flex: '0 0 45%',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
        backgroundImage: 'url("src/assets/images/rabat.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px',
        backgroundColor: '#0C0805',
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {/* Aurora glow blobs */}
      <div className="blob" style={{ background: 'radial-gradient(circle, rgba(221,114,70,0.15) 0%, transparent 70%)', top: '10%', left: '10%', width: '350px', height: '350px' }} />
      <div className="blob" style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.1) 0%, transparent 70%)', bottom: '10%', right: '10%', width: '300px', height: '300px', animationDelay: '2s' }} />

      {/* Dark overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(12,8,5,0.7) 0%, rgba(12,8,5,0.4) 40%, rgba(12,8,5,0.85) 100%)',
          zIndex: 0
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }} />

      {/* Bottom content with 3D depth */}
      <motion.div 
        animate={{ rotateX: rotate.x, rotateY: rotate.y }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        style={{ position: 'relative', zIndex: 1, transformStyle: 'preserve-3d' }}
      >
        <motion.h2
          key={mode}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: 'clamp(2rem, 3.5vw, 2.5rem)',
            fontWeight: 800,
            color: 'white',
            letterSpacing: '-1.5px',
            lineHeight: 1.15,
            marginBottom: '20px',
            fontFamily: 'Outfit, sans-serif',
            transform: 'translateZ(20px)'
          }}
        >
          {mode === 'login' ? (
            <>Découvrez<br />un Héritage Moderne</>
          ) : (
            <>Rejoignez la communauté<br />de nomades digitaux<br />au Maroc</>
          )}
        </motion.h2>

        <motion.p
          key={mode + '-desc'}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          style={{
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.75)',
            lineHeight: 1.7,
            maxWidth: '360px',
            marginBottom: '40px',
            transform: 'translateZ(30px)'
          }}
        >
          {mode === 'login'
            ? 'Rejoignez une communauté mondiale de professionnels trouvant leur foyer au cœur de l\'hospitalité marocaine.'
            : 'Accédez en exclusivité à des riads d\'exception, des espaces de travail inspirants et un réseau mondial de professionnels créatifs.'}
        </motion.p>

        {/* Avatars + stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', transform: 'translateZ(40px)' }}>
          <div style={{ display: 'flex' }}>
            {[
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=80',
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=80',
              'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=80',
            ].map((src, i) => (
              <img
                key={i}
                src={src}
                alt="resident"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid rgba(255,255,255,0.8)',
                  marginLeft: i === 0 ? 0 : '-10px',
                }}
              />
            ))}
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>2 500+</div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#DD7246',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginTop: '4px'
              }}
            >
              Résidents Actifs
            </div>
          </div>
        </div>

        <p style={{ marginTop: '48px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', transform: 'translateZ(10px)' }}>
          © {new Date().getFullYear()} Darlink. Hospitalité Marocaine Moderne.
        </p>
      </motion.div>
    </div>
  );
};

export default AuthLeftPanel;