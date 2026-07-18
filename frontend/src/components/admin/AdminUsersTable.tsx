import React from 'react';

type AdminUser = {
  id: number;
  nom: string;
  email: string;
  role: string;
  dateCreation: string;
  telephone: string | null;
};

interface AdminUsersTableProps {
  users: AdminUser[];
}

const ROLE_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  CLIENT: { bg: '#EFF6FF', color: '#1D4ED8', label: 'Client' },
  HOTE:   { bg: '#FFF7ED', color: '#C2410C', label: 'Hôte' },
  ADMIN:  { bg: '#F0FDF4', color: '#15803D', label: 'Admin' },
};

const AdminUsersTable: React.FC<AdminUsersTableProps> = ({ users }) => (
  <div style={{
    backgroundColor: 'white', borderRadius: '16px',
    border: '1.5px solid #F0EDE8', overflow: 'hidden',
  }}>
    {/* Header */}
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '18px 20px', borderBottom: '1px solid #F0EDE8',
    }}>
      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1A1A2E', margin: 0 }}>
        Utilisateurs ({(users || []).length})
      </h3>
    </div>

    {/* Column headers */}
    <div style={{
      display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1.2fr 1fr',
      padding: '10px 20px', backgroundColor: '#FAFAF9', borderBottom: '1px solid #F0EDE8',
    }}>
      {['Nom', 'Email', 'Rôle', 'Date inscription', 'Téléphone'].map(col => (
        <span key={col} style={{ fontSize: '0.68rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          {col}
        </span>
      ))}
    </div>

    {(users || []).length === 0 ? (
      <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF', fontSize: '0.88rem' }}>
        Aucun utilisateur chargé
      </div>
    ) : (
      (users || []).map((user, i) => {
        const roleCfg = ROLE_STYLES[user.role] || { bg: '#F5F3F0', color: '#6B7280', label: user.role };
        return (
          <div key={user.id} style={{
            display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1.2fr 1fr',
            alignItems: 'center', padding: '13px 20px',
            borderBottom: i < (users || []).length - 1 ? '1px solid #F5F3F0' : 'none',
            transition: 'background 0.15s',
          }}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = '#FAFAF9')}
            onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1A1A2E' }}>{user.nom}</span>
            <span style={{ fontSize: '0.82rem', color: '#6B7280' }}>{user.email}</span>
            <span style={{
              display: 'inline-flex', alignItems: 'center',
              backgroundColor: roleCfg.bg, color: roleCfg.color,
              borderRadius: '100px', padding: '3px 10px',
              fontSize: '0.72rem', fontWeight: 700,
            }}>
              {roleCfg.label}
            </span>
            <span style={{ fontSize: '0.82rem', color: '#9CA3AF' }}>
              {user.dateCreation ? new Date(user.dateCreation).toLocaleDateString('fr-FR') : '—'}
            </span>
            <span style={{ fontSize: '0.82rem', color: '#9CA3AF' }}>{user.telephone || '—'}</span>
          </div>
        );
      })
    )}
  </div>
);

export default AdminUsersTable;