import React, { useState } from 'react';
import { MapPin, Star, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getImageUrl } from '../../config/api';

interface ColivingProps {
  id: number;
  titre: string;
  adresse: string;
  prixParMois: number;
  note: number;
  image: string;
  capacite: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any } }
};

const ColivingCard: React.FC<ColivingProps> = ({ id, titre, adresse, prixParMois, note, image, capacite }) => {
  const navigate = useNavigate();
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    setRotate({
      x: ((yc - y) / yc) * 10,
      y: ((x - xc) / xc) * 10
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
      onClick={() => navigate(`/property/${id}`)}
      style={{
        backgroundColor: 'white',
        borderRadius: '24px',
        border: '1.5px solid #F0EDE8',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {/* Image Section */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '68%', overflow: 'hidden', transform: 'translateZ(20px)' }}>
        <img 
          src={getImageUrl(image)} 
          alt={titre} 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          className="coliving-img"
        />
        
        {/* Rating Badge */}
        <div style={{
          position: 'absolute', top: '16px', right: '16px',
          backgroundColor: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.3)', borderRadius: '100px',
          padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px',
          fontWeight: 700, fontSize: '0.85rem', color: '#1A1A2E',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <Star size={14} fill="#DD7246" color="#DD7246" />
          <span>{note.toFixed(1)}</span>
        </div>
      </div>

      {/* Content Section */}
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1, transform: 'translateZ(30px)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1A1A2E', marginBottom: '8px', lineHeight: 1.3 }}>
          {titre}
        </h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6B7280', marginBottom: '12px', fontSize: '0.9rem', fontWeight: 500 }}>
          <MapPin size={16} color="#DD7246" />
          <span>{adresse}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6B7280', marginBottom: '24px', fontSize: '0.9rem', fontWeight: 500 }}>
          <Users size={16} color="#DD7246" />
          <span>Communauté de {capacite} personnes</span>
        </div>

        {/* Prix et Action */}
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F0EDE8', paddingTop: '20px' }}>
          <div>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#DD7246', letterSpacing: '-0.5px' }}>{prixParMois} MAD</span>
            <span style={{ fontSize: '0.85rem', color: '#9CA3AF', fontWeight: 500 }}> / mois</span>
          </div>
          <button 
            style={{ 
              padding: '10px 20px', fontSize: '0.9rem', borderRadius: '12px',
              backgroundColor: '#1A1A2E', color: 'white', border: 'none',
              fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseOver={e => { e.currentTarget.style.backgroundColor = '#DD7246'; }}
            onMouseOut={e => { e.currentTarget.style.backgroundColor = '#1A1A2E'; }}
          >
            Découvrir
          </button>
        </div>
      </div>

      <style>{`
        .coliving-card:hover .coliving-img {
          transform: scale(1.05);
        }
      `}</style>
    </motion.div>
  );
};

export default ColivingCard;
