import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { colivingAPI } from '../../services/colivingAPI';
import SearchFilters from '../../components/shared/SearchFilters';
import SearchHeader from '../../components/shared/SearchHeader';
import PropertyGrid from '../../components/property/PropertyGrid';
import type { PropertyCardData } from '../../components/property/PropertyCard';

// Fix leaflet icon
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

interface Filters {
  priceMin: number;
  priceMax: number;
  quartiers: string[];
  amenities: string[];
  sortBy: string;
}

const DEFAULT_FILTERS: Filters = {
  priceMin: 0,
  priceMax: 15000,
  quartiers: [],
  amenities: [],
  sortBy: 'popular',
};

const DestinationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [allProperties, setAllProperties] = useState<PropertyCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [showMap, setShowMap] = useState(false);
  const [searchParams] = useSearchParams();
  const locationQuery = searchParams.get('location') || '';

  /* ── Fetch data ── */
  useEffect(() => {
    colivingAPI.getAllColivings()
      .then(data => {
        setAllProperties(
          data.map(c => ({
            id: c.id,
            nom: c.titre,
            region: c.adresse.split(',')[0]?.trim() || c.adresse,
            image: c.image || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070',
            rating: c.note,
            reviews: c.reviews ?? 0,
            residents: c.capacite,
            description: c.description || '',
            price: c.prixParMois,
            bedrooms: c.chambres?.length ?? 0,
            bathrooms: Math.ceil((c.chambres?.length ?? 0) / 2),
            minStay: 30,
            tags: [],
            latitude: c.latitude,
            longitude: c.longitude,
          }))
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* ── Derived data ── */
  const availableQuartiers = useMemo(
    () => Array.from(new Set(allProperties.map(p => p.region))).sort(),
    [allProperties]
  );

  const filtered = useMemo(() => {
    let result = allProperties.filter(p =>
      p.price >= filters.priceMin &&
      p.price <= filters.priceMax &&
      (filters.quartiers.length === 0 || filters.quartiers.includes(p.region)) &&
      (locationQuery === '' || p.region.toLowerCase().includes(locationQuery.toLowerCase()) || p.nom.toLowerCase().includes(locationQuery.toLowerCase()))
    );

    switch (filters.sortBy) {
      case 'price-low':  result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'rating':     result.sort((a, b) => b.rating - a.rating); break;
      default:           result.sort((a, b) => b.reviews - a.reviews);
    }

    return result;
  }, [allProperties, filters, locationQuery]);

  return (
    <div style={{ backgroundColor: '#FAF9F7', minHeight: '100vh', paddingBottom: '96px' }}>
      
      {/* ── Page Hero Banner (Awwwards Style mesh hybrid) ── */}
      <div
        style={{
          position: 'relative',
          padding: '140px 24px 100px',
          overflow: 'hidden',
          backgroundColor: '#0C0805'
        }}
      >
        {/* Background Image with lower opacity */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url("src/assets/images/tanger.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          opacity: 0.35,
          zIndex: 0
        }} />

        {/* Ambient colored glow blobs */}
        <div className="blob" style={{ background: 'radial-gradient(circle, rgba(221,114,70,0.18) 0%, transparent 70%)', top: '-10%', left: '30%', width: '400px', height: '400px' }} />
        <div className="blob" style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)', bottom: '-10%', right: '30%', width: '350px', height: '350px', animationDelay: '2s' }} />

        {/* Overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(12,8,5,0.7) 0%, #0C0805 100%)', zIndex: 0 }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 3.8rem)',
                fontWeight: 800,
                color: 'white',
                letterSpacing: '-2px',
                marginBottom: '20px',
                fontFamily: 'Outfit, Inter, sans-serif',
                lineHeight: 1.1
              }}
            >
              Découvrez le Coliving <span style={{ color: '#DD7246' }}>au Maroc</span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.65, maxWidth: '600px', margin: '0 auto' }}
          >
            Rejoignez des communautés dynamiques de nomades numériques et d'entrepreneurs dans les plus belles destinations du pays.
          </motion.p>
        </div>
      </div>

      {/* ── Main layout ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        className="explore-layout"
        style={{
          maxWidth: '1340px',
          margin: '0 auto',
          padding: '56px 24px 0',
        }}
      >
        {/* Sidebar Filters (Elevated Style) */}
        <div className="explore-sidebar">
          <SearchFilters
            filters={filters}
            onChange={setFilters}
            availableQuartiers={availableQuartiers}
            totalResults={filtered.length}
          />
        </div>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <SearchHeader
            total={filtered.length}
            sortBy={filters.sortBy}
            onSortChange={v => setFilters(f => ({ ...f, sortBy: v }))}
            showMap={showMap}
            onToggleMap={() => setShowMap(!showMap)}
          />
          
          <div style={{ display: 'flex', gap: '24px', marginTop: '24px' }}>
            <div style={{ flex: showMap ? '0 0 55%' : '1', transition: 'all 0.3s' }}>
              <PropertyGrid properties={filtered} loading={loading} />
            </div>
            
            {showMap && (
              <div style={{ flex: '1', position: 'sticky', top: '90px', height: 'calc(100vh - 140px)', minHeight: '600px', zIndex: 5 }}>
                <div style={{ 
                  width: '100%', height: '100%', 
                  borderRadius: '24px', overflow: 'hidden', 
                  border: '1.5px solid #F0EDE8',
                  boxShadow: '0 20px 50px rgba(15,10,6,0.06)'
                }}>
                  <MapContainer center={[31.7917, -7.0926]} zoom={6} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                    <TileLayer
                      attribution='&copy; Google Maps'
                      url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                    />
                    {filtered.map(p => (p.latitude && p.longitude) ? (
                      <Marker key={p.id} position={[p.latitude, p.longitude]}>
                        <Popup>
                          <div style={{ cursor: 'pointer', fontFamily: 'Inter, sans-serif' }} onClick={() => navigate(`/property/${p.id}`)}>
                            <img src={p.image} alt={p.nom} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '12px', marginBottom: '8px' }} />
                            <strong style={{ display: 'block', marginBottom: '4px', color: '#1A1A2E' }}>{p.nom}</strong>
                            <span style={{ color: '#DD7246', fontWeight: 800 }}>{p.price} MAD</span>
                          </div>
                        </Popup>
                      </Marker>
                    ) : null)}
                  </MapContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

    </div>
  );
};

export default DestinationsPage;