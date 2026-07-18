import React, { useState } from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

interface Filters {
  priceMin: number;
  priceMax: number;
  quartiers: string[];
  amenities: string[];
  sortBy: string;
}

interface SearchFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  availableQuartiers: string[];
  totalResults: number;
}

const ALL_AMENITIES = [
  { id: 'wifi', label: 'WiFi Haut Débit' },
  { id: 'cowork', label: 'Espace Coworking' },
  { id: 'pool', label: 'Piscine' },
  { id: 'gym', label: 'Salle de sport' },
  { id: 'cuisine', label: 'Cuisine commune' },
  { id: 'parking', label: 'Parking' },
];

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onChange,
  availableQuartiers,
  totalResults,
}) => {
  const [localMin, setLocalMin] = useState(filters.priceMin);
  const [localMax, setLocalMax] = useState(filters.priceMax);

  const handleReset = () => {
    const reset: Filters = {
      priceMin: 0,
      priceMax: 15000,
      quartiers: [],
      amenities: [],
      sortBy: 'popular',
    };
    setLocalMin(0);
    setLocalMax(15000);
    onChange(reset);
  };

  const toggleQuartier = (q: string) => {
    const next = filters.quartiers.includes(q)
      ? filters.quartiers.filter(x => x !== q)
      : [...filters.quartiers, q];
    onChange({ ...filters, quartiers: next });
  };

  const toggleAmenity = (id: string) => {
    const next = filters.amenities.includes(id)
      ? filters.amenities.filter(x => x !== id)
      : [...filters.amenities, id];
    onChange({ ...filters, amenities: next });
  };

  return (
    <aside
      style={{
        width: '280px',
        minWidth: '260px',
        backgroundColor: 'white',
        borderRadius: '16px',
        border: '1.5px solid #F0EDE8',
        padding: '24px',
        alignSelf: 'flex-start',
        position: 'sticky',
        top: '100px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SlidersHorizontal size={18} color="#DD7246" />
          <span style={{ fontWeight: 700, fontSize: '1rem', color: '#1A1A2E' }}>Filtres</span>
        </div>
        <button
          onClick={handleReset}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#9CA3AF',
            fontSize: '0.8rem',
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          <RotateCcw size={12} />
          Réinitialiser
        </button>
      </div>

      {/* Results count */}
      <div
        style={{
          backgroundColor: 'rgba(221,114,70,0.08)',
          borderRadius: '10px',
          padding: '10px 14px',
          marginBottom: '24px',
          fontSize: '0.85rem',
          color: '#DD7246',
          fontWeight: 600,
          textAlign: 'center',
        }}
      >
        {totalResults} espace{totalResults > 1 ? 's' : ''} trouvé{totalResults > 1 ? 's' : ''}
      </div>

      {/* Divider */}
      <hr style={{ border: 'none', borderTop: '1px solid #F0EDE8', marginBottom: '20px' }} />

      {/* Prix */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', marginBottom: '14px' }}>
          Fourchette de prix
        </p>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.75rem', color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>Min (MAD)</label>
            <input
              type="number"
              value={localMin}
              min={0}
              max={localMax - 100}
              step={100}
              onChange={e => {
                const v = Number(e.target.value);
                setLocalMin(v);
                onChange({ ...filters, priceMin: v });
              }}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '8px',
                border: '1.5px solid #F0EDE8',
                fontSize: '0.85rem',
                outline: 'none',
                color: '#1A1A2E',
                fontWeight: 600,
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.75rem', color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>Max (MAD)</label>
            <input
              type="number"
              value={localMax}
              min={localMin + 100}
              max={20000}
              step={100}
              onChange={e => {
                const v = Number(e.target.value);
                setLocalMax(v);
                onChange({ ...filters, priceMax: v });
              }}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '8px',
                border: '1.5px solid #F0EDE8',
                fontSize: '0.85rem',
                outline: 'none',
                color: '#1A1A2E',
                fontWeight: 600,
              }}
            />
          </div>
        </div>
        {/* Price range display */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#9CA3AF' }}>
          <span>{localMin.toLocaleString()} MAD</span>
          <span>{localMax.toLocaleString()} MAD</span>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #F0EDE8', marginBottom: '20px' }} />

      {/* Quartier */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', marginBottom: '14px' }}>
          Quartier / Ville
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {availableQuartiers.map(q => (
            <label
              key={q}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                color: filters.quartiers.includes(q) ? '#DD7246' : '#374151',
                fontWeight: filters.quartiers.includes(q) ? 600 : 400,
              }}
            >
              <div
                onClick={() => toggleQuartier(q)}
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '5px',
                  border: `2px solid ${filters.quartiers.includes(q) ? '#DD7246' : '#D1D5DB'}`,
                  backgroundColor: filters.quartiers.includes(q) ? '#DD7246' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s',
                  flexShrink: 0,
                }}
              >
                {filters.quartiers.includes(q) && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span onClick={() => toggleQuartier(q)}>{q}</span>
            </label>
          ))}
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #F0EDE8', marginBottom: '20px' }} />

      {/* Amenities */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', marginBottom: '14px' }}>
          Équipements
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {ALL_AMENITIES.map(a => (
            <label
              key={a.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                color: filters.amenities.includes(a.id) ? '#DD7246' : '#374151',
                fontWeight: filters.amenities.includes(a.id) ? 600 : 400,
              }}
            >
              <div
                onClick={() => toggleAmenity(a.id)}
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '5px',
                  border: `2px solid ${filters.amenities.includes(a.id) ? '#DD7246' : '#D1D5DB'}`,
                  backgroundColor: filters.amenities.includes(a.id) ? '#DD7246' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s',
                  flexShrink: 0,
                }}
              >
                {filters.amenities.includes(a.id) && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span onClick={() => toggleAmenity(a.id)}>{a.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Apply button */}
      <button
        style={{
          width: '100%',
          backgroundColor: '#DD7246',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          padding: '13px',
          fontWeight: 700,
          fontSize: '0.9rem',
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
        onMouseOver={e => (e.currentTarget.style.backgroundColor = '#C4622F')}
        onMouseOut={e => (e.currentTarget.style.backgroundColor = '#DD7246')}
      >
        Appliquer les filtres
      </button>
    </aside>
  );
};

export default SearchFilters;