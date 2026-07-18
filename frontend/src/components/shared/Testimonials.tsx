import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  role: string;
  rating: number;
  text: string;
  avatar: string;
}

const listVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any } }
};

const Testimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Sofia Garcia',
      location: 'Taghazout',
      role: 'Designer Graphique',
      rating: 5,
      text: "J'ai trouvé bien plus qu'un logement, j'ai trouvé une communauté. Les gens ici sont incroyables et le cadre est parfait pour ma créativité.",
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
    },
    {
      id: 2,
      name: 'Ahmed Hassan',
      location: 'Marrakech',
      role: 'Développeur Full-Stack',
      rating: 5,
      text: "Darlink m'a permis de découvrir le Maroc tout en travaillant. L'espace coworking et les événements communautaires sont géniaux !",
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    },
    {
      id: 3,
      name: 'Emma Watson',
      location: 'Essaouira',
      role: 'Copywriter & Digital Marketer',
      rating: 4.8,
      text: "L'expérience Darlink a dépassé toutes mes attentes. Les hôtes sont accueillants, les installations excellentes, le WiFi fiable.",
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop',
    },
    {
      id: 4,
      name: 'Karim Salah',
      location: 'Casablanca',
      role: 'Entrepreneur Tech',
      rating: 5,
      text: "C'est incroyable de vivre avec des personnes partageant les mêmes passions. J'ai lancé ma startup depuis mon bureau à Darlink !",
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    },
  ];

  return (
    <section style={{ padding: '96px 24px', backgroundColor: '#FAF9F7' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <p style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#DD7246', marginBottom: '12px' }}>
            Témoignages
          </p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1A1A2E', letterSpacing: '-0.5px', marginBottom: '20px' }}>
            Histoires de nos Résidents
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#6B7280', maxWidth: '580px', margin: '0 auto', lineHeight: 1.65 }}>
            Découvrez ce que pensent ceux qui ont choisi Darlink pour leur aventure marocaine.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {testimonials.map(t => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </motion.div>

        {/* Overall Rating (Premium Glassmorphism styling) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            marginTop: '64px',
            backgroundColor: 'white',
            borderRadius: '24px',
            padding: '40px 48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '64px',
            flexWrap: 'wrap',
            border: '1.5px solid #F0EDE8',
            boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: '#1A1A2E', lineHeight: 1 }}>4.9</div>
            <div style={{ display: 'flex', gap: '3px', justifyContent: 'center', margin: '12px 0 6px' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="#DD7246" color="#DD7246" />
              ))}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#9CA3AF', fontWeight: 500 }}>Note globale</div>
          </div>
          <div style={{ width: '1px', height: '60px', backgroundColor: '#E5EDE8' }} className="stats-divider" />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: '#1A1A2E', lineHeight: 1 }}>500+</div>
            <div style={{ fontSize: '0.9rem', color: '#9CA3AF', marginTop: '16px', fontWeight: 500 }}>Avis vérifiés</div>
          </div>
          <div style={{ width: '1px', height: '60px', backgroundColor: '#E5EDE8' }} className="stats-divider" />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: '#1A1A2E', lineHeight: 1 }}>97%</div>
            <div style={{ fontSize: '0.9rem', color: '#9CA3AF', marginTop: '16px', fontWeight: 500 }}>Recommandent Darlink</div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .stats-divider { display: none !important; }
        }
      `}</style>
    </section>
  );
};

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial: t }) => {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(15,10,6,0.06)', borderColor: 'rgba(221,114,70,0.2)' }}
      style={{
        backgroundColor: 'white',
        borderRadius: '24px',
        padding: '36px',
        border: '1.5px solid #F0EDE8',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', top: '32px', right: '32px', color: '#F3F2EE' }}>
        <Quote size={40} fill="#F3F2EE" />
      </div>

      <div style={{ display: 'flex', gap: '3px', marginBottom: '24px' }}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            fill={i < Math.round(t.rating) ? '#DD7246' : '#E5EDE8'}
            color={i < Math.round(t.rating) ? '#DD7246' : '#E5EDE8'}
          />
        ))}
      </div>

      <p style={{ fontSize: '1rem', color: '#374151', lineHeight: 1.8, flex: 1, marginBottom: '28px', fontStyle: 'italic', position: 'relative', zIndex: 1 }}>
        "{t.text}"
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderTop: '1px solid #F0EDE8', paddingTop: '24px' }}>
        <img
          src={t.avatar}
          alt={t.name}
          style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #F0EDE8' }}
        />
        <div>
          <div style={{ fontWeight: 800, color: '#1A1A2E', fontSize: '0.95rem' }}>{t.name}</div>
          <div style={{ fontSize: '0.85rem', color: '#9CA3AF', marginTop: '2px', fontWeight: 500 }}>
            {t.role} · {t.location}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Testimonials;