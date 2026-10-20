import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Heart, Wifi, Users, BedDouble } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { getImageUrl } from '../../config/api';

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

export interface PropertyCardData {
  id: number;
  nom: string;
  region: string;
  image: string;
  rating: number;
  reviews: number;
  residents: number;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  minStay: number;
  tags?: string[];
  latitude?: number;
  longitude?: number;
}

interface PropertyCardProps {
  property: PropertyCardData;
  featured?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, featured = false }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={itemVariants}
      onClick={() => navigate(`/property/${property.id}`)}
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(0,0,0,0.10)' }}
      style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        border: `1.5px solid ${hovered ? '#DD724633' : '#F0EDE8'}`,
        cursor: 'pointer',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        gridColumn: featured ? 'span 1' : 'auto',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
        <img
          src={getImageUrl(property.image)}
          alt={property.nom}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />

        {/* Gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(10,6,4,0.45) 0%, transparent 50%)',
          }}
        />

        {/* Top badges */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
          {property.rating >= 4.9 && (
            <span
              style={{
                backgroundColor: '#DD7246',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '3px 9px',
                borderRadius: '100px',
                letterSpacing: '0.04em',
              }}
            >
              ⭐ Mieux noté
            </span>
          )}
        </div>

        {/* Heart */}
        <button
          onClick={e => { e.stopPropagation(); setLiked(!liked); }}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.92)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.15s',
            transform: liked ? 'scale(1.15)' : 'scale(1)',
          }}
        >
          <Heart
            size={16}
            fill={liked ? '#DD7246' : 'none'}
            color={liked ? '#DD7246' : '#9CA3AF'}
          />
        </button>

        {/* Price bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            backgroundColor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(8px)',
            borderRadius: '10px',
            padding: '6px 12px',
          }}
        >
          <span style={{ fontSize: '1rem', fontWeight: 800, color: '#DD7246' }}>
            MAD {property.price.toLocaleString()}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#9CA3AF', marginLeft: '3px' }}>/mois</span>
        </div>

        {/* Rating bottom-right */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            backgroundColor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(8px)',
            borderRadius: '10px',
            padding: '5px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Star size={13} fill="#DD7246" color="#DD7246" />
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1A1A2E' }}>{property.rating}</span>
          <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>({property.reviews})</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '18px 20px 20px' }}>
        {/* Title + location */}
        <h3
          style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            color: '#1A1A2E',
            marginBottom: '4px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {property.nom}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#9CA3AF', marginBottom: '12px', fontSize: '0.83rem' }}>
          <MapPin size={13} />
          {property.region}
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: '0.85rem',
            color: '#6B7280',
            lineHeight: 1.55,
            marginBottom: '14px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {property.description}
        </p>

        {/* Quick stats */}
        <div
          style={{
            display: 'flex',
            gap: '14px',
            paddingTop: '12px',
            borderTop: '1px solid #F5F3F0',
            marginBottom: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: '#6B7280' }}>
            <BedDouble size={13} color="#DD7246" />
            <span><b style={{ color: '#1A1A2E' }}>{property.bedrooms}</b> chambres</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: '#6B7280' }}>
            <Users size={13} color="#DD7246" />
            <span><b style={{ color: '#1A1A2E' }}>{property.residents}</b> résidents</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: '#6B7280' }}>
            <Wifi size={13} color="#DD7246" />
            <span>WiFi</span>
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['Coworking', `Min ${property.minStay}j`, 'Communauté'].map(tag => (
            <span
              key={tag}
              style={{
                backgroundColor: '#FAF9F7',
                border: '1px solid #F0EDE8',
                borderRadius: '100px',
                padding: '3px 10px',
                fontSize: '0.73rem',
                color: '#6B7280',
                fontWeight: 500,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;