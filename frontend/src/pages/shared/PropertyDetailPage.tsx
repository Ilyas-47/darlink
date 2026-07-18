import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { colivingAPI, type ColivingData } from '../../services/colivingAPI';
import { getImageUrl } from '../../config/api';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

import PropertyGallery from '../../components/property/PropertyGallery';
import PropertyHeader from '../../components/property/PropertyHeader';
import PropertyAbout from '../../components/property/PropertyAbout';
import PropertyAmenities from '../../components/property/PropertyAmenities';
import PropertyLocation from '../../components/property/PropertyLocation';
import PropertyReviews from '../../components/property/PropertyReviews';
import BookingSidebar from '../../components/shared/BookingSidebar';

/* ── Types ───────────────────────────────── */
interface RoomType {
  id: number;
  name: string;
  description: string;
  price: number;
  availability: number;
  images: string[];
  amenities: string[];
  capacity: number;
  bedType: string;
  couplesFriendly: boolean;
}

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  text: string;
  avatar: string;
}

/* ── Fallback static rooms ───────────────── */
const FALLBACK_ROOMS: RoomType[] = [
  {
    id: 1, name: 'Chambre Privée Deluxe',
    description: 'Chambre privée spacieuse avec balcon vue mer.',
    price: 4500, availability: 3,
    images: ['https://images.unsplash.com/photo-1540932239986-310128078ceb?q=80&w=2070'],
    amenities: ['Lit Queen', 'Salle de bain privée', 'Balcon', 'Climatisation'],
    capacity: 1, bedType: 'Queen', couplesFriendly: true,
  },
  {
    id: 2, name: 'Chambre Partagée Standard',
    description: 'Idéale pour les nomades numériques, 2 lits simples.',
    price: 2500, availability: 5,
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070'],
    amenities: ['2 Lits simples', 'Salle de bain partagée', 'Ventilation'],
    capacity: 2, bedType: 'Simple', couplesFriendly: false,
  },
  {
    id: 3, name: 'Suite Privée Premium',
    description: 'Suite luxueuse avec salon intégré et terrasse privée.',
    price: 6500, availability: 1,
    images: ['https://images.unsplash.com/photo-1631049307038-da0ec9d70304?q=80&w=2070'],
    amenities: ['Lit King', 'Salon privé', 'Terrasse', 'Salle de bain spa'],
    capacity: 2, bedType: 'King', couplesFriendly: true,
  },
];

/* ── Page ────────────────────────────────── */
const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [property, setProperty] = useState<ColivingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    colivingAPI.getColivingById(parseInt(id || '1'))
      .then(data => { setProperty(data); if (!data) setError('Coliving non trouvé'); })
      .catch(() => setError('Impossible de charger les détails du coliving'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #F0EDE8', borderTopColor: '#DD7246', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>Chargement du coliving…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  if (error || !property) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏚️</div>
        <h2 style={{ color: '#1A1A2E', marginBottom: '8px' }}>Coliving introuvable</h2>
        <p style={{ color: '#9CA3AF', marginBottom: '24px' }}>{error}</p>
        <button
          onClick={() => navigate('/properties')}
          style={{ backgroundColor: '#DD7246', color: 'white', border: 'none', borderRadius: '10px', padding: '12px 24px', fontWeight: 700, cursor: 'pointer' }}
        >
          Voir tous les colivings
        </button>
      </div>
    </div>
  );

  /* ── Derived data ── */
  const rooms: RoomType[] = property.chambres?.length > 0
    ? property.chambres.map(c => ({
        id: c.id,
        name: c.nom,
        description: c.description || '',
        price: Number(c.prixParMois),
        availability: c.litsDisponibles,
        images: property.images?.map(img => getImageUrl(img.url)) || [],
        amenities: property.equipements || [],
        capacity: c.capacitePersonnes,
        bedType: c.typeChambre,
        couplesFriendly: c.capacitePersonnes >= 2,
      }))
    : FALLBACK_ROOMS;

  const reviews: Review[] = property.avis?.map(a => ({
    id: a.id,
    author: a.client?.nom || 'Anonyme',
    rating: a.note,
    date: new Date(a.dateCreation).toLocaleDateString('fr-FR'),
    text: a.commentaire,
    avatar: a.client?.photoProfil || `https://ui-avatars.com/api/?background=DD7246&color=fff&bold=true&name=${a.client?.nom || 'A'}`,
  })) || [];

  const images = property.images?.length > 0
    ? property.images.map(img => ({ ...img, url: getImageUrl(img.url) }))
    : [{ url: getImageUrl(property.image) || 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=2071' }];

  return (
    <div style={{ backgroundColor: '#FAF9F7', minHeight: '100vh', paddingTop: '88px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Gallery — full width */}
        <PropertyGallery images={images} title={property.titre} />

        {/* 2-col layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '40px', alignItems: 'flex-start' }}>

          {/* ── LEFT: main content ── */}
          <div>
            <PropertyHeader
              title={property.titre}
              rating={property.note}
              reviews={property.reviews || reviews.length}
              address={property.adresse}
              hostName={property.hote?.nom || 'Hôte Darlink'}
              hostPhoto={property.hote?.photoProfil}
              capacity={property.capacite}
            />

            {/* Separator */}
            <hr style={{ border: 'none', borderTop: '1px solid #F0EDE8', margin: '0 0 28px' }} />

            <PropertyAbout
              description={property.description || 'Un espace de coliving exceptionnel au cœur du Maroc, conçu pour les professionnels nomades cherchant une communauté inspirante.'}
              rooms={rooms}
              onBook={(roomId) => navigate(`/booking/${property.id}${roomId ? `?room=${roomId}` : ''}`)}
            />

            <hr style={{ border: 'none', borderTop: '1px solid #F0EDE8', margin: '0 0 28px' }} />

            <PropertyAmenities amenities={property.equipements} />

            <hr style={{ border: 'none', borderTop: '1px solid #F0EDE8', margin: '0 0 28px' }} />

            <PropertyLocation
              address={property.adresse}
              about={`${property.adresse?.split(',')[0] || 'Cette destination'} est l'une des plus belles villes du Maroc, alliant modernité et patrimoine culturel. Un cadre idéal pour les nomades numériques et créatifs du monde entier.`}
              latitude={property.latitude}
              longitude={property.longitude}
            />

            <hr style={{ border: 'none', borderTop: '1px solid #F0EDE8', margin: '0 0 28px' }} />

            <PropertyReviews
              reviews={reviews}
              overallRating={property.note}
            />

            <hr style={{ border: 'none', borderTop: '1px solid #F0EDE8', margin: '28px 0' }} />

            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1A1A2E', margin: '0 0 20px' }}>
                À savoir
              </h2>
              <Accordion.Root type="single" collapsible style={{ borderRadius: '12px', border: '1px solid #F0EDE8', overflow: 'hidden' }}>
                <Accordion.Item value="item-1" style={{ borderBottom: '1px solid #F0EDE8' }}>
                  <Accordion.Header style={{ margin: 0 }}>
                    <Accordion.Trigger style={{ width: '100%', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', border: 'none', fontSize: '0.95rem', fontWeight: 700, color: '#1A1A2E', cursor: 'pointer' }}>
                      Règlement intérieur
                      <ChevronDown size={18} style={{ color: '#9CA3AF' }} />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content style={{ backgroundColor: '#FAFAF9', padding: '16px', fontSize: '0.9rem', color: '#6B7280', lineHeight: 1.6, borderTop: '1px solid #F0EDE8' }}>
                    • Arrivée à partir de 14:00<br/>
                    • Départ avant 11:00<br/>
                    • Les animaux de compagnie ne sont pas admis<br/>
                    • Fêtes et événements strictement interdits
                  </Accordion.Content>
                </Accordion.Item>

                <Accordion.Item value="item-2">
                  <Accordion.Header style={{ margin: 0 }}>
                    <Accordion.Trigger style={{ width: '100%', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', border: 'none', fontSize: '0.95rem', fontWeight: 700, color: '#1A1A2E', cursor: 'pointer' }}>
                      Politique d'annulation
                      <ChevronDown size={18} style={{ color: '#9CA3AF' }} />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content style={{ backgroundColor: '#FAFAF9', padding: '16px', fontSize: '0.9rem', color: '#6B7280', lineHeight: 1.6, borderTop: '1px solid #F0EDE8' }}>
                    Annulation gratuite pendant 48 heures après la réservation. Ensuite, annulez jusqu'à 7 jours avant l'arrivée pour obtenir un remboursement à hauteur de 50%, moins les frais de service.
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion.Root>
            </div>
          </div>

          {/* ── RIGHT: sticky booking sidebar ── */}
          <div style={{ position: 'sticky', top: '108px' }}>
            <BookingSidebar
              price={property.prixParMois}
              rating={property.note}
              reviews={property.reviews || reviews.length}
              hostName={property.hote?.nom || 'Hôte Darlink'}
              hostPhoto={property.hote?.photoProfil}
              hostId={property.hote?.id?.toString()}
              propertyId={property.id}
              onBook={() => navigate(`/booking/${property.id}`)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;