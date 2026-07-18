import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Home, Users, ArrowRight } from 'lucide-react';

const listVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const stepVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any } }
};

const HowItWorks: React.FC = () => {
  const navigate = useNavigate();
  const [ctaLocation, setCtaLocation] = useState('');

  const handleCtaSearch = () => {
    navigate(`/destinations?location=${encodeURIComponent(ctaLocation.trim())}`);
  };

  const steps = [
    {
      icon: <Search size={26} />,
      title: 'Trouvez l\'espace parfait',
      description: 'Filtrez par destination, budget et équipements pour trouver le coliving qui correspond à votre style de vie.',
    },
    {
      icon: <Home size={26} />,
      title: 'Réservez en ligne',
      description: 'Sélectionnez vos dates, confirmez avec l\'hôte et sécurisez votre chambre en quelques clics seulement.',
    },
    {
      icon: <Users size={26} />,
      title: 'Rejoignez la communauté',
      description: 'Arrivez sur place, rencontrez des personnes partageant vos intérêts et profitez pleinement de l\'expérience.',
    },
  ];

  return (
    <>
      {/* How It Works */}
      <section style={{ padding: '96px 24px', backgroundColor: 'white', overflow: 'hidden' }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '72px' }}
          >
            <p style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#DD7246', marginBottom: '12px' }}>
              Simple & rapide
            </p>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1A1A2E', letterSpacing: '-0.5px', marginBottom: '20px' }}>
              Comment ça marche ?
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#6B7280', maxWidth: '540px', margin: '0 auto', lineHeight: 1.65 }}>
              Trouver votre prochain lieu de vie et de travail n'a jamais été aussi simple.
            </p>
          </motion.div>

          {/* Steps Grid */}
          <motion.div 
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', position: 'relative' }}
          >
            {steps.map((step, i) => (
              <motion.div 
                key={i} 
                variants={stepVariants}
                style={{ textAlign: 'center', padding: '0 16px', position: 'relative', zIndex: 1 }}
              >
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  backgroundColor: 'white', border: '2px solid #DD7246',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 28px', color: '#DD7246', position: 'relative',
                  boxShadow: '0 8px 24px rgba(221,114,70,0.1)',
                }}>
                  {step.icon}
                  <div style={{
                    position: 'absolute', top: '-6px', right: '-6px',
                    width: '26px', height: '26px', borderRadius: '50%',
                    backgroundColor: '#DD7246', color: 'white',
                    fontSize: '0.8rem', fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(221,114,70,0.3)',
                  }}>
                    {i + 1}
                  </div>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1A1A2E', marginBottom: '14px' }}>{step.title}</h3>
                <p style={{ fontSize: '0.95rem', color: '#6B7280', lineHeight: 1.7 }}>{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Dark CTA Section with high-end glassmorphism and blobs */}
      <section style={{ backgroundColor: '#0F0A06', padding: '100px 24px', position: 'relative', overflow: 'hidden' }}>
        
        {/* Glow effects */}
        <div className="blob" style={{ background: '#DD7246', top: '10%', left: '10%', width: '400px', height: '400px', opacity: 0.15 }} />
        <div className="blob" style={{ background: '#4F46E5', bottom: '10%', right: '10%', width: '350px', height: '350px', opacity: 0.1 }} />

        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: 'white', letterSpacing: '-1.5px', lineHeight: 1.15, marginBottom: '24px' }}
          >
            Prêt à trouver votre base<br /><span style={{ color: '#DD7246', textShadow: '0 0 30px rgba(221,114,70,0.3)' }}>au Maroc ?</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 48px' }}
          >
            Rejoignez des milliers de nomades qui ont trouvé leur communauté idéale dans les plus belles villes du Maroc.
          </motion.p>

          {/* Search bar Glassmorphism */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring", delay: 0.3 }}
            style={{
              display: 'flex', maxWidth: '520px', margin: '0 auto 40px',
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '20px', overflow: 'hidden', backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            }}
          >
            <input
              type="text"
              placeholder="Quelle destination ?"
              value={ctaLocation}
              onChange={e => setCtaLocation(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCtaSearch()}
              style={{ flex: 1, backgroundColor: 'transparent', border: 'none', outline: 'none', padding: '20px 24px', fontSize: '1rem', color: 'white', fontFamily: 'Inter, sans-serif' }}
            />
            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: '#C4622F' }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCtaSearch}
              style={{ backgroundColor: '#DD7246', color: 'white', border: 'none', padding: '20px 32px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', transition: 'background 0.2s' }}
            >
              Trouver <ArrowRight size={16} />
            </motion.button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ display: 'flex', gap: '28px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            {['✓ Hôtes vérifiés', '✓ Paiement sécurisé', '✓ Annulation flexible'].map(badge => (
              <span key={badge} style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{badge}</span>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HowItWorks;