import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { colivingAPI } from '../../services/colivingAPI';

interface RegionProperty {
  id: number;
  titre: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  residents: number;
  rating: number;
  reviews: number;
  price: number;
  images: string[];
  amenities: string[];
}

const RegionDetailPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const [selectedRegion] = useState(name || 'Maroc');
  const [properties, setProperties] = useState<RegionProperty[]>([]);
  const [_loading, setLoading] = useState(true);

  useEffect(() => {
    colivingAPI.getAllColivings().then(data => {
      const mapped = data.map(c => ({
        id: c.id,
        titre: c.titre,
        location: c.adresse,
        bedrooms: c.chambres.length,
        bathrooms: Math.ceil(c.chambres.length / 2),
        residents: c.capacite,
        rating: c.note,
        reviews: c.reviews,
        price: c.prixParMois,
        images: c.images.map(img => img.url),
        amenities: c.equipements
      }));
      // Si la région est 'Maroc', on montre tout, sinon on filtre par le nom de la région
      const filtered = selectedRegion === 'Maroc' ? mapped : mapped.filter(p => p.location.toLowerCase().includes(selectedRegion.toLowerCase()));
      setProperties(filtered);
      setLoading(false);
    });
  }, [selectedRegion]);
  


  const cities = ['Taghazout', 'Marrakech', 'Essaouira', 'Casablanca', 'Fès'];

  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
      {/* Header Section */}
      <div style={{
        backgroundImage: 'linear-gradient(rgba(44, 44, 44, 0.6), rgba(44, 44, 44, 0.6)), url("https://images.unsplash.com/photo-1597212618440-806262de4f6b?q=80&w=2073&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '80px 24px',
        color: 'white',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '16px' }}>
          Coliving au {selectedRegion}
        </h1>
        <p style={{ fontSize: '1.3rem', maxWidth: '700px', margin: '0 auto', opacity: 0.95 }}>
          Découvrez les meilleures espaces de coliving au Maroc. Connectez-vous avec une communauté mondiale de nomades numériques et d'entrepreneurs.
        </p>
      </div>

      <div className="container" style={{ padding: '60px 24px' }}>
        {/* Filter Section */}
        <div style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '40px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h2 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>Filtrer par Ville</h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {cities.map(city => (
              <button
                key={city}
                style={{
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  fontSize: '0.95rem',
                  fontWeight: 500
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = 'inherit';
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                }}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
          marginBottom: '60px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '8px' }}>
              {properties.length}
            </div>
            <div style={{ color: 'var(--color-text-light)', fontSize: '1rem' }}>
              Espaces disponibles
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '8px' }}>
              4.9★
            </div>
            <div style={{ color: 'var(--color-text-light)', fontSize: '1rem' }}>
              Note moyenne
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '8px' }}>
              200+
            </div>
            <div style={{ color: 'var(--color-text-light)', fontSize: '1rem' }}>
              Résidents heureux
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <h2 style={{ marginBottom: '40px', fontSize: '2rem' }}>Nos Espaces</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '32px'
        }}>
          {properties.map(property => (
            <div
              key={property.id}
              style={{
                backgroundColor: 'white',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                transition: 'all var(--transition-smooth)',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
            >
              {/* Image */}
              <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                <img
                  src={property.images[0]}
                  alt={property.titre}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.95rem',
                  fontWeight: 600
                }}>
                  <Star size={16} fill='white' color='white' />
                  {property.rating} ({property.reviews})
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--color-secondary)' }}>
                  {property.titre}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-light)', marginBottom: '16px', fontSize: '0.9rem' }}>
                  <MapPin size={16} />
                  {property.location}
                </div>

                {/* Property Details */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px', padding: '16px 0', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                      {property.bedrooms}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>
                      Chambres
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                      {property.bathrooms}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>
                      Salles de bains
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                      {property.residents}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>
                      Résidents
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {property.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      style={{
                        backgroundColor: 'var(--color-background)',
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        color: 'var(--color-text-light)'
                      }}
                    >
                      {amenity}
                    </span>
                  ))}
                </div>

                {/* Price and Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                      {property.price} MAD
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>
                      / mois
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/property/${property.id}`)}
                    className="btn btn-primary"
                    style={{ padding: '10px 20px', fontSize: '0.95rem' }}
                  >
                    Découvrir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegionDetailPage;
