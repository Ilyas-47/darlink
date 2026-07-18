import React from 'react';
import { Map, ArrowUpDown } from 'lucide-react';

interface SearchHeaderProps {
  total: number;
  sortBy: string;
  onSortChange: (v: string) => void;
  searchQuery?: string;
  showMap: boolean;
  onToggleMap: () => void;
}

const SORT_OPTIONS = [
  { value: 'popular', label: 'Plus populaires' },
  { value: 'rating', label: 'Meilleure note' },
  { value: 'price-low', label: 'Prix croissant' },
  { value: 'price-high', label: 'Prix décroissant' },
];

const SearchHeader: React.FC<SearchHeaderProps> = ({ total, sortBy, onSortChange, searchQuery, showMap, onToggleMap }) => {
  return (
    <div style={{ marginBottom: '32px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#9CA3AF', marginBottom: '14px' }}>
        <a href="/" style={{ color: '#DD7246', textDecoration: 'none', fontWeight: 500 }}>Accueil</a>
        <span>›</span>
        <span>Recherche</span>
        {searchQuery && (
          <>
            <span>›</span>
            <span style={{ color: '#1A1A2E', fontWeight: 500 }}>{searchQuery}</span>
          </>
        )}
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
          fontWeight: 800,
          color: '#1A1A2E',
          letterSpacing: '-0.5px',
          marginBottom: '8px',
        }}
      >
        Authentic Moroccan Experiences
      </h1>
      <p style={{ fontSize: '0.95rem', color: '#6B7280', marginBottom: '24px', lineHeight: 1.6 }}>
        Découvrez des espaces de coliving modernes et inspirants, conçus pour la communauté contemporaine au Maroc.
      </p>

      {/* Controls bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Result count */}
        <p style={{ fontSize: '0.88rem', color: '#6B7280', fontWeight: 500 }}>
          <span style={{ color: '#1A1A2E', fontWeight: 700 }}>{total}</span> espace{total > 1 ? 's' : ''} disponible{total > 1 ? 's' : ''}
        </p>

        {/* Right controls */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Sort select */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'white',
              border: '1.5px solid #F0EDE8',
              borderRadius: '10px',
              padding: '8px 12px',
            }}
          >
            <ArrowUpDown size={14} color="#9CA3AF" />
            <select
              value={sortBy}
              onChange={e => onSortChange(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                fontSize: '0.85rem',
                color: '#374151',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Show map toggle */}
          <button
            onClick={onToggleMap}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: showMap ? '#DD7246' : '#1A1A2E',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '9px 16px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = '#DD7246')}
            onMouseOut={e => (e.currentTarget.style.backgroundColor = showMap ? '#DD7246' : '#1A1A2E')}
          >
            <Map size={15} />
            {showMap ? 'Masquer la carte' : 'Voir la carte'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;