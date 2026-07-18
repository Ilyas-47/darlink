import React from 'react';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  role: string;
  location: string;
  text: string;
  rating: number;
}

interface CommunityTestimonialsProps {
  testimonials: Testimonial[];
}

const CommunityTestimonials: React.FC<CommunityTestimonialsProps> = ({ testimonials }) => (
  <section style={{ padding: '80px 32px', backgroundColor: '#FAF9F7' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '52px' }}>
        <p style={{
          fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: '#DD7246', marginBottom: '10px',
        }}>
          The Darlink Experience
        </p>
        <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#1A1A2E', letterSpacing: '-0.5px', marginBottom: '10px' }}>
          Ce qu'ils en disent
        </h2>
        <p style={{ fontSize: '0.93rem', color: '#6B7280', maxWidth: '460px', margin: '0 auto', lineHeight: 1.65 }}>
          Des professionnels du monde entier ont choisi Darlink pour leur aventure marocaine.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
        {testimonials.map(t => <TestimonialCard key={t.id} testimonial={t} />)}
      </div>
    </div>
  </section>
);

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial: t }) => {
  const [hov, setHov] = React.useState(false);
  return (
    <div
      onMouseOver={() => setHov(true)} onMouseOut={() => setHov(false)}
      style={{
        backgroundColor: 'white', borderRadius: '18px', padding: '26px',
        border: `1.5px solid ${hov ? '#DD724633' : '#F0EDE8'}`,
        transition: 'all 0.25s ease',
        transform: hov ? 'translateY(-3px)' : 'translateY(0)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: '18px', right: '18px', color: '#F0EDE8' }}>
        <Quote size={32} fill="#F0EDE8" />
      </div>
      <div style={{ display: 'flex', gap: '2px', marginBottom: '14px' }}>
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={13} fill={i < Math.round(t.rating) ? '#DD7246' : '#E5E7EB'} color={i < Math.round(t.rating) ? '#DD7246' : '#E5E7EB'} />
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#374151', lineHeight: 1.75, marginBottom: '18px', fontStyle: 'italic', position: 'relative', zIndex: 1 }}>
        "{t.text}"
      </p>
    </div>
  );
};

export default CommunityTestimonials;