import React from 'react';
import { MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

interface NearbyItem {
  label: string;
  distance: string;
}

interface BuildingDetail {
  label: string;
  value: string;
}

interface PropertyLocationProps {
  address: string;
  latitude?: number;
  longitude?: number;
  nearby?: NearbyItem[];
  buildingDetails?: BuildingDetail[];
  about?: string;
}

const DEFAULT_NEARBY: NearbyItem[] = [
  { label: 'Plage', distance: '150m' },
  { label: 'Cafés & restaurants', distance: '200m' },
  { label: 'Supermarché', distance: '300m' },
  { label: 'École de surf', distance: '100m' },
];

const DEFAULT_BUILDING: BuildingDetail[] = [
  { label: 'Étage', value: '3' },
  { label: 'Ascenseur', value: 'Oui' },
  { label: 'Parking', value: 'Gratuit' },
  { label: 'Buanderie', value: 'Partagée' },
];

const PropertyLocation: React.FC<PropertyLocationProps> = ({
  address,
  latitude,
  longitude,
  nearby = DEFAULT_NEARBY,
  buildingDetails = DEFAULT_BUILDING,
  about,
}) => {
  return (
    <section style={{ marginBottom: '32px' }}>
      <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1A1A2E', marginBottom: '16px' }}>
        Localisation
      </h2>

      {/* Map */}
      <div
        style={{
          aspectRatio: '16/7',
          borderRadius: '16px',
          overflow: 'hidden',
          marginBottom: '20px',
          backgroundColor: '#E8E4DF',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 0,
        }}
      >
        {latitude && longitude ? (
          <MapContainer center={[latitude, longitude]} zoom={14} scrollWheelZoom={false} style={{ height: '100%', width: '100%', zIndex: 0 }}>
            <TileLayer
              attribution='&copy; Google Maps'
              url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            />
            <Marker position={[latitude, longitude]}></Marker>
          </MapContainer>
        ) : (
          <iframe
            title="Carte de localisation"
            width="100%"
            height="100%"
            style={{ border: 0, position: 'absolute', inset: 0, zIndex: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
          ></iframe>
        )}
      </div>

      {/* Address line */}
      <p style={{ fontSize: '0.9rem', color: '#6B7280', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <MapPin size={14} color="#DD7246" /> {address}, Maroc
      </p>

      {/* Nearby + Building grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '12px' }}>À Proximité</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {nearby.map((item, i) => (
              <li key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#374151' }}>
                  <MapPin size={12} color="#DD7246" /> {item.label}
                </span>
                <span style={{ color: '#9CA3AF', fontWeight: 500 }}>{item.distance}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '12px' }}>Bâtiment</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {buildingDetails.map((d, i) => (
              <div
                key={i}
                style={{
                  padding: '10px 12px',
                  backgroundColor: '#FAF9F7',
                  borderRadius: '10px',
                  border: '1px solid #F0EDE8',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontSize: '0.73rem', color: '#9CA3AF', margin: '0 0 2px' }}>{d.label}</p>
                <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1A1A2E', margin: 0 }}>{d.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About city */}
      {about && (
        <p style={{ fontSize: '0.88rem', color: '#6B7280', lineHeight: 1.75, padding: '14px', backgroundColor: '#FAF9F7', borderRadius: '12px', border: '1px solid #F0EDE8' }}>
          {about}
        </p>
      )}
    </section>
  );
};

export default PropertyLocation;