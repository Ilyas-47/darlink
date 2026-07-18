import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, ArrowRight, Heart, BedDouble, Users } from 'lucide-react';
import { colivingAPI, type ColivingData } from '../../services/colivingAPI';

const listVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any } }
};

const UpcomingColivings: React.FC = () => {
  const navigate = useNavigate();
  const [colivings, setColivings] = useState<ColivingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    colivingAPI.getAllColivings()
      .then(data => setColivings(data.slice(0, 4)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section style={{ padding: '96px 24px', backgroundColor: '#FAF9F7' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}
        >
          <div>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#DD7246', marginBottom: '10px' }}>
              Espaces disponibles
            </p>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1A1A2E', letterSpacing: '-0.5px', margin: 0 }}>
              Destinations à Venir
            </h2>
          </div>
          <a
            onClick={() => navigate('/destinations')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '6px', 
              color: '#DD7246', fontWeight: 600, fontSize: '0.95rem', 
              textDecoration: 'none', cursor: 'pointer',
              padding: '10px 20px', borderRadius: '100px',
              backgroundColor: 'rgba(221,114,70,0.1)', transition: 'all 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(221,114,70,0.2)'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(221,114,70,0.1)'}
          >
            Voir tous les colivings <ArrowRight size={16} />
          </a>
        </motion.div>

        {/* Loading skeletons */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ backgroundColor: 'white', borderRadius: '24px', overflow: 'hidden', border: '1.5px solid #F0EDE8', animation: 'pulse 1.5s ease-in-out infinite' }}>
                <div style={{ height: '220px', backgroundColor: '#F0EDE8' }} />
                <div style={{ padding: '24px' }}>
                  <div style={{ height: '16px', backgroundColor: '#F0EDE8', borderRadius: '6px', marginBottom: '10px', width: '70%' }} />
                  <div style={{ height: '14px', backgroundColor: '#F0EDE8', borderRadius: '6px', width: '45%' }} />
                </div>
              </div>
            ))}
            <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
          </div>
        )}

        {/* Colivings bento grid */}
        {!loading && colivings.length > 0 && (
          <motion.div 
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gridTemplateRows: 'auto auto', gap: '20px' }}
          >
            {colivings.map((c, i) => (
              <ColivingCard
                key={c.id}
                coliving={c}
                large={i === 0}
                style={i === 0 ? { gridRow: '1 / 3' } : {}}
                onClick={() => navigate(`/property/${c.id}`)}
              />
            ))}
          </motion.div>
        )}

        {/* Empty state */}
        {!loading && colivings.length === 0 && (
          <div style={{ textAlign: 'center', padding: '72px', color: '#9CA3AF', fontSize: '0.95rem', backgroundColor: 'white', borderRadius: '24px', border: '1.5px solid #F0EDE8' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏡</div>
            Aucun coliving disponible pour le moment.
          </div>
        )}
      </div>
    </section>
  );
};

/* ── Individual card ── */
interface ColivingCardProps {
  coliving: ColivingData;
  large?: boolean;
  style?: React.CSSProperties;
  onClick: () => void;
}

const ColivingCard: React.FC<ColivingCardProps> = ({ coliving, large = false, style = {}, onClick }) => {
  const [liked, setLiked] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const city = coliving.adresse?.split(',')[0]?.trim() || coliving.adresse;

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
      onClick={onClick}
      style={{
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        cursor: 'pointer',
        backgroundColor: 'white',
        border: '1.5px solid #F0EDE8',
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
        ...style,
      }}
      className="coliving-card-item"
    >
      {/* Image */}
      <div style={{ position: 'relative', height: large ? '100%' : '200px', minHeight: large ? '420px' : '200px', overflow: 'hidden', transform: 'translateZ(10px)' }}>
        <img
          src={coliving.image || 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=2071'}
          alt={coliving.titre}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'block',
          }}
          className="card-img"
        />

        {/* Gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: large
            ? 'linear-gradient(to top, rgba(15,10,6,0.85) 0%, rgba(15,10,6,0.15) 50%, transparent 100%)'
            : 'linear-gradient(to top, rgba(15,10,6,0.7) 0%, transparent 55%)',
          transform: 'translateZ(15px)'
        }} />

        {/* Like button */}
        <button
          onClick={e => { e.stopPropagation(); setLiked(v => !v); }}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            width: '36px', height: '36px', borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.90)',
            border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'transform 0.15s',
            transform: liked ? 'scale(1.2) translateZ(25px)' : 'scale(1) translateZ(25px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            zIndex: 10
          }}
        >
          <Heart size={15} fill={liked ? '#DD7246' : 'none'} color={liked ? '#DD7246' : '#9CA3AF'} />
        </button>

        {/* Rating badge */}
        <div style={{
          position: 'absolute', top: '16px', left: '16px',
          backgroundColor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
          borderRadius: '100px', padding: '6px 12px',
          display: 'flex', alignItems: 'center', gap: '4px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          transform: 'translateZ(25px)',
          zIndex: 10
        }}>
          <Star size={12} fill="#DD7246" color="#DD7246" />
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1A1A2E' }}>{coliving.note}</span>
          <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>({coliving.reviews ?? 0})</span>
        </div>

        {/* Price badge */}
        <div style={{
          position: 'absolute', bottom: large ? '90px' : '48px', left: '16px',
          backgroundColor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
          borderRadius: '100px', padding: '6px 14px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          transform: 'translateZ(25px)',
          zIndex: 10
        }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#DD7246' }}>
            MAD {coliving.prixParMois?.toLocaleString()}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#9CA3AF', marginLeft: '3px' }}>/mois</span>
        </div>

        {/* Bottom info (on image for large card) */}
        {large && (
          <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px', transform: 'translateZ(30px)' }}>
            <h3 style={{ color: 'white', fontSize: '1.4rem', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.5px' }}>
              {coliving.titre}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', fontWeight: 500 }}>
              <MapPin size={14} color="#DD7246" />
              {coliving.adresse}
            </div>
          </div>
        )}
      </div>

      {/* Content (below image for small cards) */}
      {!large && (
        <div style={{ padding: '20px 24px 24px', transform: 'translateZ(20px)' }}>
          <h3 style={{
            fontSize: '1.1rem', fontWeight: 800, color: '#1A1A2E',
            marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {coliving.titre}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#9CA3AF', fontSize: '0.85rem', marginBottom: '16px', fontWeight: 500 }}>
            <MapPin size={12} color="#DD7246" /> {city}
          </div>
          <div style={{ display: 'flex', gap: '16px', paddingTop: '16px', borderTop: '1px solid #F0EDE8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#6B7280', fontWeight: 500 }}>
              <BedDouble size={14} color="#DD7246" />
              <span>{coliving.chambres?.length ?? 0} ch.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#6B7280', fontWeight: 500 }}>
              <Users size={14} color="#DD7246" />
              <span>{coliving.capacite} résidents</span>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        .coliving-card-item:hover .card-img {
          transform: scale(1.05);
        }
      `}</style>
    </motion.div>
  );
};

export default UpcomingColivings;