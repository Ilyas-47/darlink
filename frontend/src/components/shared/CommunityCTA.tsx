import React from 'react';
import { FaDiscord } from 'react-icons/fa';
 
const CommunityCTA: React.FC = () => (
  <section style={{ padding: '0 24px 80px', backgroundColor: '#FAF9F7' }}>
    <div
      style={{
        maxWidth: '1200px', margin: '0 auto',
        backgroundColor: '#DD7246',
        borderRadius: '24px',
        padding: '64px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '32px',
        flexWrap: 'wrap',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* BG decoration */}
      <div
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 60%), radial-gradient(circle at 10% 80%, rgba(0,0,0,0.06) 0%, transparent 50%)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h2
          style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            fontWeight: 800, color: 'white',
            letterSpacing: '-0.6px', lineHeight: 1.15,
            marginBottom: '10px',
          }}
        >
          Ready to find your tribe?
        </h2>
        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.6, maxWidth: '460px', margin: 0 }}>
          Rejoignez des milliers de nomades qui ont trouvé leur communauté au Maroc. Votre prochaine aventure commence ici.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexShrink: 0, position: 'relative', zIndex: 1 }}>
        <a
          href="https://discord.gg/Cuh4mGrkx"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: 'white', color: '#DD7246',
            border: 'none', borderRadius: '12px',
            padding: '14px 28px', fontWeight: 800,
            fontSize: '0.95rem', cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            textDecoration: 'none',
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
          }}
        >
          Rejoindre Discord <FaDiscord size={16} />
        </a>
      </div>
    </div>
  </section>
);

export default CommunityCTA;