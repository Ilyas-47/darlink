import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { colivingAPI } from '../../services/colivingAPI';

const INITIAL_DESTINATIONS = [
  {
    nom: 'Marrakech',
    tag: 'La ville rouge',
    image: 'src/assets/images/kech.jpg',
    colivings: 0,
    large: true,
  },
  {
    nom: 'Taghazout',
    tag: 'Surf & télétravail',
    image: 'src/assets/images/taghazout.jpg',
    colivings: 0,
    large: false,
  },
  {
    nom: 'Essaouira',
    tag: 'Cité des vents',
    image: 'src/assets/images/essaouira.jpg',
    colivings: 0,
    large: false,
  },
  {
    nom: 'Chefchaouen',
    tag: 'La ville bleue',
    image: 'src/assets/images/chefchaouen.jpg',
    colivings: 0,
    large: false,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any } }
};

const Destinations: React.FC = () => {
  const [destinations, setDestinations] = useState(INITIAL_DESTINATIONS);

  useEffect(() => {
    colivingAPI.getAllColivings().then(colivings => {
      const counts: Record<string, number> = {};
      colivings.forEach(c => {
        const city = INITIAL_DESTINATIONS.find(d =>
          c.adresse.toLowerCase().includes(d.nom.toLowerCase())
        );
        if (city) counts[city.nom] = (counts[city.nom] || 0) + 1;
      });
      setDestinations(INITIAL_DESTINATIONS.map(d => ({ ...d, colivings: counts[d.nom] || 0 })));
    }).catch(console.error);
  }, []);

  const [marrakech, ...rest] = destinations;

  return (
    <section style={{ padding: '96px 24px', backgroundColor: '#FAF9F7' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}
        >
          <div>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#DD7246', marginBottom: '10px' }}>
              Explorez le Maroc
            </p>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1A1A2E', letterSpacing: '-0.5px', margin: 0 }}>
              Destinations Populaires
            </h2>
          </div>
          <Link
            to="/destinations"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              color: '#DD7246', fontWeight: 600, fontSize: '0.95rem',
              textDecoration: 'none', padding: '10px 20px', borderRadius: '100px',
              backgroundColor: 'rgba(221,114,70,0.1)', transition: 'all 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(221,114,70,0.2)'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(221,114,70,0.1)'}
          >
            Voir toutes les destinations <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="bento-grid"
          style={{
            gridTemplateColumns: '1.8fr 1fr 1fr',
            gridTemplateRows: '300px 300px',
            gap: '20px',
          }}
        >
          {/* Large card - Marrakech */}
          <DestinationCard dest={marrakech} style={{ gridRow: '1 / 3' }} />

          {/* Small cards */}
          {rest.map(dest => (
            <DestinationCard key={dest.nom} dest={dest} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

interface CardProps {
  dest: typeof INITIAL_DESTINATIONS[number];
  style?: React.CSSProperties;
}

const DestinationCard: React.FC<CardProps> = ({ dest, style }) => {
  const navigate = useNavigate();
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    setRotate({
      x: ((yc - y) / yc) * 8, // Max tilt angle 8 degrees
      y: ((x - xc) / xc) * 8
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
      className="bento-item"
      onClick={() => navigate(`/destinations?location=${encodeURIComponent(dest.nom)}`)}
      style={{ 
        cursor: 'pointer', 
        ...style,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        boxShadow: '0 4px 30px rgba(0,0,0,0.03)'
      }}
    >
      <img src={dest.image} alt={dest.nom} style={{ transform: 'translateZ(10px)' }} />
      {/* Dark Gradient Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,10,6,0.85) 0%, rgba(15,10,6,0.1) 60%, transparent 100%)', transform: 'translateZ(15px)' }} />
      
      {/* Badge (Glassmorphism) */}
      <div style={{
        position: 'absolute', top: '20px', left: '20px',
        backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.3)', borderRadius: '100px',
        padding: '6px 14px', fontSize: '0.75rem', color: 'white', fontWeight: 600,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transform: 'translateZ(25px)'
      }}>
        {dest.tag}
      </div>

      {/* Content */}
      <div className="bento-content" style={{ padding: '24px', background: 'transparent', transform: 'translateZ(30px)' }}>
        <h3 style={{ color: 'white', fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.5px' }}>
          {dest.nom}
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', margin: 0, fontWeight: 500 }}>
          {dest.colivings > 0 ? `${dest.colivings} colivings disponibles` : 'Bientôt disponible'}
        </p>
      </div>

      {/* Hover Arrow Effect */}
      <div className="hover-arrow" style={{
        position: 'absolute', bottom: '24px', right: '24px',
        width: '40px', height: '40px', borderRadius: '50%',
        backgroundColor: '#DD7246', display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: 0, transform: 'translateX(-20px) translateZ(35px)', transition: 'all 0.3s ease'
      }}>
        <ArrowRight size={18} color="white" />
      </div>

      <style>{`
        .bento-item:hover .hover-arrow {
          opacity: 1;
          transform: translateX(0) translateZ(35px);
        }
      `}</style>
    </motion.div>
  );
};

export default Destinations;