import React, { useState } from 'react';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  text: string;
  avatar: string;
}

interface Faq {
  q: string;
  a: string;
}

interface PropertyReviewsProps {
  reviews: Review[];
  overallRating: number;
  faqs?: Faq[];
}

const DEFAULT_FAQS: Faq[] = [
  { q: 'Quels équipements de travail sont disponibles?', a: "Chaque espace dispose d'une connexion WiFi 300Mbps, d'un espace de travail dédié, de bureaux ergonomiques et d'un espace de co-working entièrement équipé." },
  { q: 'Quelle est la durée minimale du séjour?', a: 'La durée minimale est de 30 jours. Pour les séjours plus courts, veuillez nous contacter directement.' },
  { q: "Les animaux de compagnie sont-ils autorisés?", a: 'Les petits animaux de compagnie domestiques sont autorisés moyennant une caution supplémentaire de 500 MAD.' },
  { q: "Quelle est la politique d'annulation?", a: "Annulation gratuite jusqu'à 14 jours avant l'arrivée. Après cette date, le montant total sera facturisé." },
  { q: 'Y a-t-il un service de nettoyage?', a: 'Oui, le nettoyage hebdomadaire est inclus. Services supplémentaires disponibles sur demande.' },
];

const PropertyReviews: React.FC<PropertyReviewsProps> = ({ reviews, overallRating, faqs = DEFAULT_FAQS }) => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const ratingBars = [5, 4, 3, 2, 1];

  return (
    <>
      {/* Reviews */}
      <section style={{ marginBottom: '32px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Star size={18} fill="#DD7246" color="#DD7246" />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1A1A2E', margin: 0 }}>
            {overallRating} · {reviews.length} avis
          </h2>
        </div>

        {/* Rating bars */}
        {reviews.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 36px', gap: '8px 10px', alignItems: 'center', marginBottom: '24px' }}>
            {ratingBars.map(stars => {
              const count = reviews.filter(r => Math.round(r.rating) === stars).length;
              const pct = reviews.length > 0 ? (count / reviews.length) * 100 : (20 + stars * 8);
              return (
                <React.Fragment key={stars}>
                  <span style={{ fontSize: '0.82rem', color: '#6B7280', textAlign: 'right' }}>{stars} étoile{stars > 1 ? 's' : ''}</span>
                  <div style={{ height: '6px', backgroundColor: '#F0EDE8', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, backgroundColor: '#DD7246', borderRadius: '3px', transition: 'width 0.5s' }} />
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>{Math.round(pct)}%</span>
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Review cards */}
        {reviews.length === 0 ? (
          <div style={{ padding: '24px', backgroundColor: '#FAF9F7', borderRadius: '12px', textAlign: 'center', color: '#9CA3AF', fontSize: '0.9rem' }}>
            Aucun avis pour le moment. Soyez le premier à laisser un commentaire !
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {reviews.map(review => (
              <div
                key={review.id}
                style={{
                  padding: '18px 20px',
                  backgroundColor: 'white',
                  borderRadius: '14px',
                  border: '1.5px solid #F0EDE8',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <img
                    src={review.avatar}
                    alt={review.author}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #F0EDE8' }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1A1A2E', margin: 0 }}>{review.author}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <div style={{ display: 'flex', gap: '1px' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={11} fill={i < Math.round(review.rating) ? '#DD7246' : '#E5E7EB'} color={i < Math.round(review.rating) ? '#DD7246' : '#E5E7EB'} />
                        ))}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{review.date}</span>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '0.87rem', color: '#6B7280', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
                  "{review.text}"
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FAQ */}
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1A1A2E', marginBottom: '14px' }}>
          Questions Fréquentes
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} style={{ border: '1.5px solid #F0EDE8', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'white' }}>
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                  textAlign: 'left',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#1A1A2E',
                }}
              >
                {faq.q}
                {expandedFaq === idx ? <ChevronUp size={16} color="#9CA3AF" /> : <ChevronDown size={16} color="#9CA3AF" />}
              </button>
              {expandedFaq === idx && (
                <div style={{ padding: '0 18px 14px', fontSize: '0.87rem', color: '#6B7280', lineHeight: 1.7 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default PropertyReviews;