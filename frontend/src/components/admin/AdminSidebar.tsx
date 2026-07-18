import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Home, Calendar,
  DollarSign, BarChart3, Settings, LogOut, Users, FileText, Activity, FileCheck
} from 'lucide-react';
import { getStoredUser, clearAuthSession } from '../../config/api';
import * as Tabs from '@radix-ui/react-tabs';

export type TabType = 'dashboard' | 'listings' | 'bookings' | 'earnings' | 'users' | 'documents' | 'audit' | 'client-docs';

interface AdminSidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const NAV_ITEMS: { id: TabType; icon: React.ReactNode; label: string }[] = [
  { id: 'dashboard',  icon: <LayoutDashboard size={17} />, label: 'Tableau de bord' },
  { id: 'users',      icon: <Users size={17} />,           label: 'Utilisateurs' },
  { id: 'documents',  icon: <FileText size={17} />,        label: 'Validation Documents' },
  { id: 'client-docs',icon: <FileCheck size={17} />,       label: 'Docs Clients' },
  { id: 'audit',      icon: <Activity size={17} />,        label: 'Journal d\'Activité' },
  { id: 'listings',   icon: <Home size={17} />,            label: 'Espaces en attente' },
  { id: 'bookings',   icon: <Calendar size={17} />,        label: 'Réservations' },
  { id: 'earnings',   icon: <DollarSign size={17} />,      label: 'Revenus généraux' },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, onTabChange }) => {
  const me = getStoredUser();
  const navigate = useNavigate();
  const initial = me?.nom?.charAt(0)?.toUpperCase() || 'A';

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
            {initial}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#DD7246', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Console Admin
            </p>
            <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {me?.nom ? me.nom : 'Admin'}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <Tabs.List aria-label="Menu d'administration" style={{ flex: 1, padding: '0 10px', display: 'flex', flexDirection: 'column', gap: '2px', outline: 'none' }}>
        {NAV_ITEMS.map(item => {
          const active = activeTab === item.id;
          return (
            <Tabs.Trigger key={item.id} value={item.id} asChild>
              <button style={{
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
            </Tabs.Trigger>
          );
        })}
      </Tabs.List>

      {/* Bottom */}
      <div style={{ padding: '16px 10px 0', borderTop: '1px solid #F0EDE8', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <button onClick={() => onTabChange('dashboard')} style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '8px 12px', borderRadius: '8px', border: 'none',
          cursor: 'pointer', width: '100%', backgroundColor: 'transparent',
          color: '#9CA3AF', fontSize: '0.8rem', fontWeight: 500, textAlign: 'left',
          transition: 'all 0.15s',
        }}
          onMouseOver={e => { e.currentTarget.style.color = '#374151'; e.currentTarget.style.backgroundColor = '#F0EDE8'; }}
          onMouseOut={e => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <Settings size={14} /> Paramètres
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

export default AdminSidebar;