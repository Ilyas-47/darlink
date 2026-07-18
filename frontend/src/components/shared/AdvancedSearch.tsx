import { useState } from 'react';
import { Search, Sliders, Calendar } from 'lucide-react';

interface FilterOptions {
  city: string;
  minPrice: number;
  maxPrice: number;
  minCapacity: number;
  communityType: string;
  checkIn?: string;
  checkOut?: string;
}

interface AdvancedSearchProps {
  onSearch?: (filters: FilterOptions) => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onSearch }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    city: '',
    minPrice: 0,
    maxPrice: 10000,
    minCapacity: 1,
    communityType: 'all',
    checkIn: '',
    checkOut: ''
  });

  const cities = ['Taghazout', 'Marrakech', 'Essaouira', 'Casablanca', 'Fès', 'Tanger'];
  const communities = [
    { value: 'all', label: 'Tous les types' },
    { value: 'digital-nomads', label: 'Nomades Numériques' },
    { value: 'students', label: 'Étudiants' },
    { value: 'entrepreneurs', label: 'Entrepreneurs' },
    { value: 'creatives', label: 'Créatifs' }
  ];

  const handleSearch = () => {
    onSearch?.(filters);
  };

  const handleReset = () => {
    setFilters({
      city: '',
      minPrice: 0,
      maxPrice: 10000,
      minCapacity: 1,
      communityType: 'all',
      checkIn: '',
      checkOut: ''
    });
  };

  return (
    <section style={{ padding: '32px 24px', backgroundColor: 'var(--color-background)' }}>
      <div className="container">
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '24px'
        }}>
          {/* Search Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '16px', marginBottom: showFilters ? '24px' : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-md)', padding: '12px 16px' }}>
              <Search size={20} color="var(--color-text-light)" />
              <input 
                type="text"
                placeholder="Cherchez une ville ou un lieu..."
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                style={{
                  flex: 1,
                  marginLeft: '12px',
                  border: 'none',
                  outline: 'none',
                  fontSize: '1rem',
                  backgroundColor: 'transparent'
                }}
              />
            </div>

            <button 
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontWeight: 500,
                color: 'var(--color-secondary)',
                transition: 'all var(--transition-fast)'
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
            >
              <Sliders size={20} />
              <span>Filtres</span>
            </button>

            <button 
              onClick={handleSearch}
              className="btn btn-primary"
              style={{ padding: '12px 32px' }}
            >
              Rechercher
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              paddingTop: '24px',
              borderTop: '1px solid var(--color-border)'
            }}>
              {/* City Filter */}
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem' }}>
                  Ville
                </label>
                <select 
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Toutes les villes</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem' }}>
                  Prix par mois
                </label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input 
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: parseInt(e.target.value) })}
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                      fontSize: '0.9rem'
                    }}
                  />
                  <span>-</span>
                  <input 
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                      fontSize: '0.9rem'
                    }}
                  />
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>MAD</span>
                </div>
              </div>

              {/* Community Type */}
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem' }}>
                  Type de Communauté
                </label>
                <select 
                  value={filters.communityType}
                  onChange={(e) => setFilters({ ...filters, communityType: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  {communities.map(community => (
                    <option key={community.value} value={community.value}>
                      {community.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Min Capacity */}
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem' }}>
                  Capacité minimale
                </label>
                <input 
                  type="number"
                  placeholder="Nombre minimum de résidents"
                  value={filters.minCapacity}
                  onChange={(e) => setFilters({ ...filters, minCapacity: parseInt(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              {/* Check-in Date */}
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem' }}>
                  <Calendar size={16} style={{ display: 'inline', marginRight: '4px' }} />
                  Date d'arrivée
                </label>
                <input 
                  type="date"
                  value={filters.checkIn || ''}
                  onChange={(e) => setFilters({ ...filters, checkIn: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              {/* Check-out Date */}
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem' }}>
                  <Calendar size={16} style={{ display: 'inline', marginRight: '4px' }} />
                  Date de départ
                </label>
                <input 
                  type="date"
                  value={filters.checkOut || ''}
                  onChange={(e) => setFilters({ ...filters, checkOut: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              {/* Reset Button */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={handleReset}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontWeight: 500,
                    color: 'var(--color-secondary)',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-background)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdvancedSearch;
