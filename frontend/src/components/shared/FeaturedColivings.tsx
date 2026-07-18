import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ColivingCard from '../property/ColivingCard';
import { colivingAPI, type ColivingData } from '../../services/colivingAPI';

const INITIAL_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const FeaturedColivings: React.FC = () => {
  const [colivings, setColivings] = useState<ColivingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchColivings = async () => {
      try {
        setLoading(true);
        const data = await colivingAPI.getAllColivings();
        setColivings(data);
      } catch (err) {
        console.error('Erreur lors du chargement des colivings:', err);
        setError('Impossible de charger les colivings');
      } finally {
        setLoading(false);
      }
    };

    fetchColivings();
  }, []);

  return (
    <section className="container" style={{ padding: '96px 24px' }}>
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: '56px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}
      >
        <div>
          <p style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#DD7246', marginBottom: '12px' }}>
            Espaces d'exception
          </p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1A1A2E', letterSpacing: '-0.5px', margin: 0 }}>
            Colivings Populaires
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', marginTop: '8px' }}>
            Rejoignez les meilleures communautés de nomades au Maroc.
          </p>
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
          Voir tout <ArrowRight size={16} />
        </Link>
      </motion.div>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton" style={{ width: '100%', height: '360px', maxWidth: '360px' }} />
          ))}
        </div>
      )}
      
      {error && <p style={{ textAlign: 'center', color: '#DC2626', fontWeight: 600 }}>{error}</p>}

      {!loading && !error && colivings.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--color-text-light)' }}>Aucun coliving disponible</p>
      )}

      {!loading && !error && colivings.length > 0 && (
        <motion.div 
          variants={INITIAL_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '32px'
          }}
        >
          {colivings.slice(0, 3).map(coliving => (
            <ColivingCard 
              key={coliving.id} 
              id={coliving.id}
              titre={coliving.titre}
              adresse={coliving.adresse}
              prixParMois={coliving.prixParMois}
              note={coliving.note}
              image={coliving.image}
              capacite={coliving.capacite}
            />
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default FeaturedColivings;
