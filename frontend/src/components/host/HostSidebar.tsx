import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Home, Calendar,
  DollarSign, Plus, LogOut, FileText, MessageSquare
} from 'lucide-react';
import { clearAuthSession } from '../../config/api';

export type HostTab = 'dashboard' | 'listings' | 'bookings' | 'messages' | 'earnings' | 'documents' | 'client-docs';

interface HostSidebarProps {
  activeTab: HostTab;
  onTabChange: (tab: HostTab) => void;
  hostName: string;
  onAddListingClick?: () => void;
}

const NAV: { id: HostTab; icon: React.ReactNode; label: string }[] = [
  { id: 'dashboard',  icon: <LayoutDashboard size={16} />, label: 'Tableau de bord' },
  { id: 'listings',   icon: <Home size={16} />,            label: 'Mes Espaces' },
  { id: 'bookings',   icon: <Calendar size={16} />,        label: 'Réservations' },
  { id: 'messages',   icon: <MessageSquare size={16} />,   label: 'Messages' },
  { id: 'earnings',   icon: <DollarSign size={16} />,      label: 'Revenus' },
  { id: 'documents',  icon: <FileText size={16} />,        label: 'Documents' },
  { id: 'client-docs',icon: <FileText size={16} />,        label: 'Validation Clients' },
];

const HostSidebar: React.FC<HostSidebarProps> = ({ activeTab, onTabChange, hostName, onAddListingClick }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthSession();
    navigate('/auth');
  };

  return (
    <aside style={{
      width: '200px', minWidth: '200px',
      backgroundColor: '#FAF9F7',
      borderRight: '1px solid #F0EDE8',
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      padding: '24px 0',
      position: 'fixed', top: 0, left: 0, zIndex: 100,
    }}>
      {/* Brand + user */}
      <div style={{ padding: '0 20px 20px', borderBottom: '1px solid #F0EDE8', marginBottom: '12px' }}>
        <img src="/logo.png" alt="Darlink" style={{ height: '58px', objectFit: 'contain', marginBottom: '16px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            backgroundColor: '#DD7246', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '0.82rem', flexShrink: 0,
          }}>
            {hostName.charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#DD7246', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Tableau de bord Hôte
            </p>
            <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {hostName}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {NAV.map(item => {
          const active = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => onTabChange(item.id)} style={{
              display: 'flex', alignItems: 'center', gap: '9px',
              padding: '9px 12px', borderRadius: '10px',
              border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
              backgroundColor: active ? '#DD7246' : 'transparent',
              color: active ? 'white' : '#6B7280',
              fontWeight: active ? 700 : 500, fontSize: '0.84rem',
              transition: 'all 0.15s ease',
            }}
              onMouseOver={e => { if (!active) { e.currentTarget.style.backgroundColor = '#F0EDE8'; e.currentTarget.style.color = '#374151'; } }}
              onMouseOut={e => { if (!active) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#6B7280'; } }}
            >
              {item.icon} {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '16px 10px 0', borderTop: '1px solid #F0EDE8' }}>
        <button onClick={onAddListingClick} style={{
          width: '100%', padding: '10px', borderRadius: '10px',
          backgroundColor: '#DD7246', color: 'white', border: 'none',
          fontWeight: 700, fontSize: '0.73rem', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          textTransform: 'uppercase', letterSpacing: '0.05em',
          marginBottom: '10px', transition: 'background 0.2s',
        }}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = '#C4622F')}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = '#DD7246')}
        >
          <Plus size={12} /> Ajouter un espace
        </button>


        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '8px 12px', borderRadius: '8px', border: 'none',
          cursor: 'pointer', width: '100%',
          backgroundColor: 'transparent', color: '#EF4444',
          fontSize: '0.8rem', fontWeight: 600, textAlign: 'left', transition: 'all 0.15s',
        }}
          onMouseOver={e => { e.currentTarget.style.backgroundColor = '#FEF2F2'; }}
          onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <LogOut size={14} /> Déconnexion
        </button>
      </div>
    </aside>
  );
};

export default HostSidebar;