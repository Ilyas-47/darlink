import React from 'react';
import { Search, Bell } from 'lucide-react';

const AdminTopBar: React.FC = () => {
  const [focused, setFocused] = React.useState(false);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: '28px', gap: '16px',
    }}>
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1A1A2E', letterSpacing: '-0.5px', margin: 0, marginBottom: '4px' }}>
          Vue d'ensemble Admin
        </h1>
        <p style={{ fontSize: '0.82rem', color: '#9CA3AF', margin: 0 }}>
          Supervision de l'écosystème de coliving premium au Maroc
        </p>
      </div>

      {/* Right: search + bell */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          backgroundColor: 'white',
          border: `1.5px solid ${focused ? '#DD7246' : '#E5E7EB'}`,
          borderRadius: '10px', padding: '9px 14px',
          transition: 'border-color 0.2s', minWidth: '220px',
        }}>
          <Search size={14} color={focused ? '#DD7246' : '#9CA3AF'} />
          <input
            type="text"
            placeholder="Rechercher des espaces ou des hôtes..."
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              border: 'none', outline: 'none', fontSize: '0.82rem',
              color: '#1A1A2E', backgroundColor: 'transparent', width: '100%',
            }}
          />
        </div>

        {/* Bell */}
        <div style={{ position: 'relative' }}>
          <button style={{
            width: '38px', height: '38px', borderRadius: '10px',
            backgroundColor: 'white', border: '1.5px solid #E5E7EB',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'border-color 0.2s',
          }}
            onMouseOver={e => (e.currentTarget.style.borderColor = '#DD7246')}
            onMouseOut={e => (e.currentTarget.style.borderColor = '#E5E7EB')}
          >
            <Bell size={16} color="#6B7280" />
          </button>
          {/* Dot */}
          <div style={{
            position: 'absolute', top: '6px', right: '6px',
            width: '8px', height: '8px', borderRadius: '50%',
            backgroundColor: '#DD7246', border: '2px solid #FAF9F7',
          }} />
        </div>
      </div>
    </div>
  );
};

export default AdminTopBar;