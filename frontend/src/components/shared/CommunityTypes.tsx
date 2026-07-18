import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Code, Briefcase, Palette, BookOpen, Zap, ArrowRight } from 'lucide-react';

interface CommunityType {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  count: number;
  color: string;
  bgColor: string;
}

const listVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any } }
};

const CommunityTypes: React.FC = () => {
  const navigate = useNavigate();
  const communities: CommunityType[] = [
    {
      id: 1,
      icon: <Code size={22} />,
      title: 'Développeurs',
      description: 'Parfait pour les programmeurs et développeurs full-stack cherchant une communauté tech.',
      count: 320,
      color: '#4F46E5',
      bgColor: 'rgba(79, 70, 229, 0.08)',
    },
    {
      id: 2,
      icon: <Briefcase size={22} />,
      title: 'Nomades Numériques',
      description: 'Travaillez de n\'importe où avec une connexion fiable et une communauté bienveillante.',
      count: 540,
      color: '#DD7246',
      bgColor: 'rgba(221, 114, 70, 0.08)',
    },
    {
      id: 3,
      icon: <Palette size={22} />,
      title: 'Créatifs & Artistes',
      description: 'Espaces inspirants pour designers, photographes, écrivains et autres créatifs.',
      count: 180,
      color: '#E11D74',
      bgColor: 'rgba(225, 29, 116, 0.08)',
    },
    {
      id: 4,
      icon: <BookOpen size={22} />,
      title: 'Étudiants',
      description: 'Communautés étudiantes avec prix avantageux et ambiance jeune et dynamique.',
      count: 250,
      color: '#059669',
      bgColor: 'rgba(5, 150, 105, 0.08)',
    },
    {
      id: 5,
      icon: <Zap size={22} />,
      title: 'Entrepreneurs',
      description: 'Pour ceux qui lancent leur startup. Réseautage, collaboration et inspiration.',
      count: 160,
      color: '#D97706',
      bgColor: 'rgba(217, 119, 6, 0.08)',
    },
    {
      id: 6,
      icon: <Users size={22} />,
      title: 'Jeunes Professionnels',
      description: 'Communautés mixtes pour jeunes pros en développement personnel et carrière.',
      count: 450,
      color: '#0891B2',
      bgColor: 'rgba(8, 145, 178, 0.08)',
    },
  ];

  return (
    <section style={{ padding: '96px 24px', backgroundColor: 'white', overflow: 'hidden' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'start' }}>
          
          {/* Left Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ position: 'sticky', top: '100px' }}
          >
            <p style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#DD7246', marginBottom: '16px' }}>
              Nos Communautés
            </p>
            <h2 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#1A1A2E', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '24px' }}>
              Une communauté<br />qui vous ressemble<br />
              <span style={{ color: '#DD7246', textShadow: '0 0 30px rgba(221,114,70,0.1)' }}>au Maroc</span>
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '36px' }}>
              Chaque Darling attire une communauté unique. Trouvez le vôtre parmi nos profils de résidents.
            </p>
            <Link
              to="/community"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                backgroundColor: '#DD7246', color: 'white', padding: '16px 32px',
                borderRadius: '16px', fontWeight: 700, fontSize: '1rem',
                textDecoration: 'none', transition: 'all 0.2s',
                boxShadow: '0 8px 24px rgba(221,114,70,0.25)',
              }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#C4622F'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = '#DD7246'}
            >
              Explorer les communautés <ArrowRight size={18} />
            </Link>

            {/* Stats */}
            <div style={{ marginTop: '56px', display: 'flex', gap: '40px' }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1A1A2E' }}>1 900+</div>
                <div style={{ fontSize: '0.9rem', color: '#9CA3AF', marginTop: '2px', fontWeight: 500 }}>Résidents actifs</div>
              </div>
              <div style={{ width: '1px', backgroundColor: '#E5EDE8' }} />
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1A1A2E' }}>6</div>
                <div style={{ fontSize: '0.9rem', color: '#9CA3AF', marginTop: '2px', fontWeight: 500 }}>Profils de résidents</div>
              </div>
            </div>
          </motion.div>

          {/* Right Cards Grid */}
          <motion.div
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}
          >
            {communities.map(c => (
              <motion.div
                key={c.id}
                variants={cardVariants}
                whileHover={{ y: -6, boxShadow: `0 12px 32px ${c.color}15`, borderColor: `${c.color}55` }}
                onClick={() => navigate('/community')}
                style={{
                  backgroundColor: '#FAFAF9',
                  border: `1.5px solid #F0EDE8`,
                  borderRadius: '24px',
                  padding: '28px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  backgroundColor: c.bgColor, border: `1px solid ${c.color}22`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: c.color, marginBottom: '20px',
                }}>
                  {c.icon}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1A1A2E', marginBottom: '10px' }}>
                  {c.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#6B7280', lineHeight: 1.6, marginBottom: '20px' }}>
                  {c.description}
                </p>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  backgroundColor: c.bgColor, borderRadius: '100px',
                  padding: '6px 14px', fontSize: '0.8rem', fontWeight: 700, color: c.color,
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: c.color, display: 'inline-block' }} />
                  {c.count}+ résidents
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default CommunityTypes;