import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Globe, Shield, Users, Zap, Target, MapPin, Briefcase, Code, PenTool, MessageCircle } from 'lucide-react';
import iliasImage from '../../assets/images/ilias.jpeg';
import amineImage from '../../assets/images/amine.jpeg';
import islamImage from '../../assets/images/islam.jpeg';
import redaImage from '../../assets/images/reda.jpeg';

const values = [
  { icon: <Heart size={22} />, title: 'Communauté', desc: 'Nous croyons que les meilleures expériences naissent du partage et de la connexion humaine.', color: '#E11D74', bg: 'rgba(225,29,116,0.08)' },
  { icon: <Globe size={22} />, title: 'Culture Marocaine', desc: 'Nous intégrons l\'authenticité et la richesse culturelle du Maroc dans chaque espace.', color: '#DD7246', bg: 'rgba(221,114,70,0.08)' },
  { icon: <Shield size={22} />, title: 'Confiance & Sécurité', desc: 'Chaque hôte est vérifié, chaque paiement sécurisé, chaque séjour garanti.', color: '#4F46E5', bg: 'rgba(79,70,229,0.08)' },
  { icon: <Users size={22} />, title: 'Inclusivité', desc: 'Nos espaces accueillent toutes les cultures, professions et modes de vie.', color: '#059669', bg: 'rgba(5,150,105,0.08)' },
  { icon: <Zap size={22} />, title: 'Innovation', desc: 'Nous utilisons l\'IA et la technologie pour créer les meilleures expériences de coliving.', color: '#D97706', bg: 'rgba(217,119,6,0.08)' },
  { icon: <Target size={22} />, title: 'Impact Local', desc: 'Nous soutenons les communautés locales et l\'économie marocaine.', color: '#0891B2', bg: 'rgba(8,145,178,0.08)' },
];

const stats = [
  { value: '2025', label: 'Fondé en' },
  { value: '6+', label: 'Villes couvertes' },
  { value: '1 900+', label: 'Résidents actifs' },
  { value: '15+', label: 'Nationalités' },
];

const team = [
  { name: 'Ilias', role: 'CEO & Développeur Full Stack', icon: <Briefcase size={20} />, image: iliasImage },
  { name: 'Mohammed Amine Essadi', role: 'Développeur Frontend', icon: <PenTool size={20} />, image: amineImage },
  { name: 'Islam Saidi', role: 'Développeur Backend', icon: <Code size={20} />, image: islamImage },
  { name: 'Reda Bakri', role: 'Base de données et Social Media', icon: <MessageCircle size={20} />, image: redaImage },
];

const listVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any } }
};

export default function AboutPage() {


  return (
    <div style={{ backgroundColor: '#FAF9F7', minHeight: '100vh', paddingBottom: '96px' }}>

      {/* Hero (Awwwards Style Mesh) */}
      <section style={{
        position: 'relative', padding: '140px 24px 120px',
        backgroundColor: '#0C0805', overflow: 'hidden', textAlign: 'center',
      }}>
        {/* Glow effect blobs */}
        <div className="blob" style={{ background: 'radial-gradient(circle, rgba(221,114,70,0.18) 0%, transparent 70%)', top: '10%', left: '20%', width: '450px', height: '450px' }} />
        <div className="blob" style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)', bottom: '10%', right: '20%', width: '400px', height: '400px', animationDelay: '2.5s' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 0.6 }}
            style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#DD7246', marginBottom: '20px' }}
          >
            À propos de Darlink
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            style={{ fontSize: 'clamp(2.5rem, 6vw, 3.8rem)', fontWeight: 800, color: 'white', letterSpacing: '-2px', lineHeight: 1.1, marginBottom: '24px', fontFamily: 'Outfit, sans-serif' }}
          >
            Réinventer le coliving<br />
            <span style={{ color: '#DD7246', textShadow: '0 0 30px rgba(221,114,70,0.2)' }}>au Maroc</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, maxWidth: '600px', margin: '0 auto' }}
          >
            Darlink est née d'une vision simple : créer des espaces où les nomades digitaux, les créatifs et les entrepreneurs peuvent vivre, travailler et grandir ensemble.
          </motion.p>
        </div>
      </section>

      {/* Stats Card Row */}
      <section style={{ padding: '0 24px', marginTop: '-48px', position: 'relative', zIndex: 2 }}>
        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="visible"
          style={{
            maxWidth: '960px', margin: '0 auto',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px',
          }}
        >
          {stats.map(s => (
            <motion.div
              key={s.label}
              variants={itemVariants}
              whileHover={{ y: -6, boxShadow: '0 15px 30px rgba(0,0,0,0.06)' }}
              style={{
                background: 'white', borderRadius: '24px', padding: '32px 24px', textAlign: 'center',
                border: '1.5px solid #F0EDE8', boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', cursor: 'default'
              }}
            >
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#DD7246', marginBottom: '6px', letterSpacing: '-1px' }}>{s.value}</div>
              <div style={{ fontSize: '0.9rem', color: '#9CA3AF', fontWeight: 600 }}>{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Mission */}
      <section id="mission" style={{ padding: '120px 24px' }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '64px', alignItems: 'center' }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#DD7246', marginBottom: '12px' }}>
                Notre mission
              </p>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1A1A2E', marginBottom: '24px', letterSpacing: '-1px', lineHeight: 1.15 }}>
                Connecter les talents du monde avec la beauté du Maroc
              </h2>
              <p style={{ color: '#6B7280', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '20px' }}>
                Avec la Coupe du Monde 2030, le Maroc s'ouvre au monde entier. Darlink prépare cette transformation en créant un réseau d'espaces de coliving qui combinent le confort moderne avec l'authenticité marocaine.
              </p>
              <p style={{ color: '#6B7280', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '32px' }}>
                Notre plateforme permet aux voyageurs et professionnels de trouver leur base au Maroc — que ce soit pour un mois de surf à Taghazout, un trimestre de créativité à Essaouira, ou une année entrepreneuriale à Marrakech.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {['Taghazout', 'Marrakech', 'Essaouira', 'Casablanca', 'Fès', 'Agadir'].map(city => (
                  <span key={city} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    background: 'rgba(221,114,70,0.08)', color: '#DD7246',
                    padding: '8px 16px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 700,
                  }}>
                    <MapPin size={13} /> {city}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Showcase Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{
                borderRadius: '28px', overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(15,10,6,0.08)',
                border: '1.5px solid #F0EDE8',
                height: '400px'
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200&auto=format&fit=crop"
                alt="Darlink Morocco"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values (Bento style grid with tilt cards) */}
      <section style={{ padding: '96px 24px', backgroundColor: '#FAFAF9', borderTop: '1px solid #F0EDE8', borderBottom: '1px solid #F0EDE8' }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#DD7246', marginBottom: '12px' }}>
              Nos valeurs
            </p>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1A1A2E', letterSpacing: '-0.5px' }}>
              Ce qui nous guide au quotidien
            </h2>
          </div>

          <motion.div
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            {values.map((v, i) => (
              <ValueCard key={i} {...v} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: '120px 24px' }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#DD7246', marginBottom: '12px' }}>
              L'équipe
            </p>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1A1A2E', letterSpacing: '-0.5px' }}>
              Par les passionnés, pour les passionnés
            </h2>
          </div>

          <motion.div
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '24px',
            }}
          >
            {team.map((member, i) => (
              <TeamCard key={i} {...member} />
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
}

// ── Value Card Component ──
const ValueCard: React.FC<typeof values[0]> = ({ icon, title, desc, color, bg }) => {
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
      variants={itemVariants}
      animate={{ rotateX: rotate.x, rotateY: rotate.y }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        background: 'white',
        borderRadius: '24px',
        padding: '36px',
        border: '1.5px solid #F0EDE8',
        boxShadow: '0 8px 30px rgba(0,0,0,0.02)',
        cursor: 'default',
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      <div style={{
        width: '52px', height: '52px', borderRadius: '16px',
        backgroundColor: bg, display: 'flex', alignItems: 'center',
        justifyContent: 'center', color, marginBottom: '24px',
        border: `1px solid ${color}15`,
        transform: 'translateZ(15px)'
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1A1A2E', marginBottom: '10px', transform: 'translateZ(25px)' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.92rem', color: '#6B7280', lineHeight: 1.7, margin: 0, transform: 'translateZ(35px)' }}>
        {desc}
      </p>
    </motion.div>
  );
};

// ── Team Card Component ──
const TeamCard: React.FC<typeof team[0]> = ({ name, role, icon, image }) => {
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
      variants={itemVariants}
      animate={{ rotateX: rotate.x, rotateY: rotate.y }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        background: 'white',
        borderRadius: '24px',
        border: '1.5px solid #F0EDE8',
        boxShadow: '0 8px 30px rgba(0,0,0,0.02)',
        cursor: 'default',
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'relative', width: '100%', paddingTop: '100%', overflow: 'hidden', transform: 'translateZ(10px)' }}>
        <img
          src={image}
          alt={name}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div style={{ padding: '24px', transform: 'translateZ(25px)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1A1A2E', marginBottom: '6px' }}>{name}</h3>
        <p style={{ fontSize: '0.85rem', color: '#9CA3AF', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#DD7246' }}>{icon}</span>
          {role}
        </p>
      </div>
    </motion.div>
  );
};
