import React, { useState } from 'react';
import { Zap, Globe, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const REASONS = [
  {
    icon: <Zap size={22} />, color: '#DD7246', bg: 'rgba(221,114,70,0.1)',
    title: 'Productivité Amplifiée',
    description: 'Des espaces pensés pour le deep work, avec WiFi 300Mbps, bureaux ergonomiques et silence préservé.',
  },
  {
    icon: <Globe size={22} />, color: '#4F46E5', bg: 'rgba(79,70,229,0.1)',
    title: 'Réseau International',
    description: 'Connectez-vous avec des professionnels de 15+ pays. Chaque rencontre est une opportunité.',
  },
  {
    icon: <Heart size={22} />, color: '#E11D74', bg: 'rgba(225,29,116,0.1)',
    title: 'Culture Marocaine',
    description: 'Vivez une immersion authentique dans la culture locale tout en restant connecté à votre travail.',
  },
];

const listVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any } }
};

const CommunityWhyUs: React.FC = () => (
  <section style={{ padding: '96px 32px', backgroundColor: 'white' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: '64px' }}
      >
        <p style={{
          fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: '#DD7246', marginBottom: '12px',
        }}>
          Pourquoi nous rejoindre
        </p>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1A1A2E', letterSpacing: '-0.5px' }}>
          Un Aperçu Unique de Darlink
        </h2>
      </motion.div>

      {/* Grid */}
      <motion.div 
        variants={listVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}
      >
        {REASONS.map((r, i) => <ReasonCard key={i} {...r} />)}
      </motion.div>
    </div>
  </section>
);

const ReasonCard: React.FC<typeof REASONS[0]> = ({ icon, color, bg, title, description }) => {
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
    <motion.div
      variants={cardVariants}
      animate={{ rotateX: rotate.x, rotateY: rotate.y }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      style={{
        padding: '36px', borderRadius: '24px',
        border: '1.5px solid #F0EDE8',
        backgroundColor: '#FAF9F7',
        cursor: 'default',
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.02)'
      }}
    >
      <div style={{
        width: '52px', height: '52px', borderRadius: '16px',
        backgroundColor: bg, display: 'flex', alignItems: 'center',
        justifyContent: 'center', color, marginBottom: '24px',
        border: `1px solid ${color}15`,
        transform: 'translateZ(10px)'
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1A1A2E', marginBottom: '10px', transform: 'translateZ(20px)' }}>{title}</h3>
      <p style={{ fontSize: '0.92rem', color: '#6B7280', lineHeight: 1.7, margin: 0, transform: 'translateZ(30px)' }}>{description}</p>
    </motion.div>
  );
};

export default CommunityWhyUs;