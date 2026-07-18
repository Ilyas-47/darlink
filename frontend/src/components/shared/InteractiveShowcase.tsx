import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Compass, Coffee, Laptop } from 'lucide-react';

const SHOWCASE_TABS = [
  {
    id: 'workspace',
    label: 'Coworking Hub',
    icon: <Laptop size={18} />,
    title: 'Des espaces de travail pensés pour la performance',
    desc: 'WiFi fibre très haut débit, chaises ergonomiques, écrans externes de courtoisie et thé/café à volonté pour rester productif toute la journée.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
    specs: ['Fibre 200 Mbps', 'Appels confidentiels', 'Café de spécialité']
  },
  {
    id: 'garden',
    label: 'Riad & Détente',
    icon: <Compass size={18} />,
    title: 'Le calme des riads traditionnels revisités',
    desc: 'Patio baigné de lumière, terrasses panoramiques sur le toit pour le yoga ou les couchers de soleil, et piscine pour vous détendre après le travail.',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200&auto=format&fit=crop',
    specs: ['Piscine / Patio', 'Espaces extérieurs', 'Sunset Yoga']
  },
  {
    id: 'rooms',
    label: 'Suites Privées',
    icon: <Coffee size={18} />,
    title: 'Votre espace intime et reposant',
    desc: 'Chambres spacieuses avec literie haut de gamme, salle de bain privée, espaces de rangement intelligents et bureau de travail individuel.',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop',
    specs: ['Salle de bain privée', 'Climatisation', 'Bureau privé']
  }
];

const InteractiveShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState('workspace');
  const current = SHOWCASE_TABS.find(t => t.id === activeTab) || SHOWCASE_TABS[0];

  return (
    <section style={{ padding: '96px 24px', backgroundColor: '#FAF9F7' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#DD7246', marginBottom: '12px' }}>
            Expérience immersive
          </p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1A1A2E', letterSpacing: '-1.5px', marginBottom: '20px' }}>
            Vivez l'harmonie parfaite
          </h2>
          <p style={{ color: '#6B7280', fontSize: '1.1rem', maxWidth: '580px', margin: '0 auto', lineHeight: 1.65 }}>
            Explorez les différentes facettes de nos espaces hybrides conçus pour la vie moderne.
          </p>
        </div>

        {/* Interactive UI */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
          
          {/* Left panel: selection & content */}
          <div>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
              {SHOWCASE_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '12px 20px', borderRadius: '14px', border: 'none',
                    fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                    backgroundColor: activeTab === tab.id ? '#1A1A2E' : 'rgba(26,26,46,0.04)',
                    color: activeTab === tab.id ? 'white' : '#1A1A2E',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content with animations */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
              >
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1A1A2E', marginBottom: '16px', lineHeight: 1.25, letterSpacing: '-0.5px' }}>
                  {current.title}
                </h3>
                <p style={{ color: '#6B7280', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '32px' }}>
                  {current.desc}
                </p>

                {/* Specs list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {current.specs.map(spec => (
                    <div key={spec} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', fontWeight: 600, color: '#1A1A2E' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(221,114,70,0.1)', color: '#DD7246' }}>
                        <Wifi size={14} />
                      </div>
                      {spec}
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right panel: animated image with glow frame */}
          <div style={{ position: 'relative' }}>
            <div className="blob" style={{ background: '#DD7246', top: '10%', right: '10%', width: '300px', height: '300px', opacity: 0.15, filter: 'blur(60px)' }} />
            
            <div style={{
              borderRadius: '24px', overflow: 'hidden', 
              boxShadow: '0 30px 60px rgba(15,10,6,0.12)',
              border: '1.5px solid #F0EDE8',
              backgroundColor: 'white',
              position: 'relative', zIndex: 1
            }}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={current.id}
                  src={current.image}
                  alt={current.label}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{ width: '100%', height: '420px', objectFit: 'cover' }}
                />
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default InteractiveShowcase;
