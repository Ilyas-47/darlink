import React from 'react';
import { Check, X, CheckCircle } from 'lucide-react';

type PendingColiving = {
  id: number;
  titre: string;
  adresse: string;
  statut: string;
  dateCreation: string;
  hote: { nom: string; email: string };
  prixMin: number | null;
  nbChambres: number;
  image: string | null;
  equipements: string[];
};

interface PendingVerificationsProps {
  pending: PendingColiving[];
  actionId: number | null;
  onModerate: (id: number, statut: 'VALIDE' | 'REFUSE') => void;
}

const INITIALS = (name: string) => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  return parts.map(w => w[0] || '').join('').toUpperCase().slice(0, 2) || '??';
};

const AVATAR_COLORS = ['#DD7246', '#4F46E5', '#059669', '#D97706', '#E11D74', '#0891B2'];

const PendingVerifications: React.FC<PendingVerificationsProps> = ({ pending, actionId, onModerate }) => (
  <div style={{
    backgroundColor: 'white', borderRadius: '16px',
    border: '1.5px solid #F0EDE8', overflow: 'hidden',
    flex: 1, minWidth: 0,
  }}>
    {/* Header */}
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '18px 20px', borderBottom: '1px solid #F0EDE8',
    }}>
      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1A1A2E', margin: 0 }}>
        Vérifications en attente
      </h3>
      <button style={{
        background: 'none', border: 'none', color: '#DD7246',
        fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.04em',
      }}>
        VOIR TOUT
      </button>
    </div>

    {/* Table head */}
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1.8fr 1.2fr 1.2fr auto',
      padding: '10px 20px',
      backgroundColor: '#FAFAF9',
      borderBottom: '1px solid #F0EDE8',
    }}>
      {['Hôte', 'Nom du coliving', 'Adresse', 'Action'].map(col => (
        <span key={col} style={{ fontSize: '0.68rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          {col}
        </span>
      ))}
    </div>

    {/* Rows */}
    <div>
      {(pending || []).length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#9CA3AF', fontSize: '0.88rem' }}>
          <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center' }}><CheckCircle size={32} color="#059669" /></div>
          Aucun coliving en attente de validation
        </div>
      ) : (
        (pending || []).map((item, i) => (
          <PendingRow key={item.id} item={item} index={i} actionId={actionId} onModerate={onModerate} />
        ))
      )}
    </div>
  </div>
);

const PendingRow: React.FC<{
  item: PendingColiving;
  index: number;
  actionId: number | null;
  onModerate: (id: number, statut: 'VALIDE' | 'REFUSE') => void;
}> = ({ item, index, actionId, onModerate }) => {
  const [hovered, setHovered] = React.useState(false);
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const city = item.adresse?.split(',').slice(-1)[0]?.trim() || item.adresse || '';
  const region = item.adresse?.split(',').slice(-2, -1)[0]?.trim() || '';
  const isProcessing = actionId === item.id;

  return (
    <div
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '1.8fr 1.2fr 1.2fr auto',
        alignItems: 'center',
        padding: '14px 20px',
        borderBottom: '1px solid #F5F3F0',
        backgroundColor: hovered ? '#FAFAF9' : 'white',
        transition: 'background 0.15s',
      }}
    >
      {/* Host */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '34px', height: '34px', borderRadius: '50%',
          backgroundColor: color + '22', border: `1.5px solid ${color}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color, fontWeight: 700, fontSize: '0.72rem', flexShrink: 0,
        }}>
          {INITIALS(item.hote?.nom || 'Inconnu')}
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1A1A2E', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {item.hote?.nom || 'Inconnu'}
          </p>
          <p style={{ fontSize: '0.73rem', color: '#9CA3AF', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {item.hote?.email || '—'}
          </p>
        </div>
      </div>

      {/* Riad name */}
      <div>
        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1A1A2E', margin: 0 }}>
          {item.titre}
        </p>
        {item.prixMin && (
          <p style={{ fontSize: '0.73rem', color: '#DD7246', fontWeight: 600, margin: 0 }}>
            {item.prixMin.toLocaleString()} MAD/mois
          </p>
        )}
      </div>

      {/* Location */}
      <div>
        <p style={{ fontSize: '0.85rem', color: '#374151', margin: 0, fontWeight: 500 }}>{city}</p>
        {region && <p style={{ fontSize: '0.73rem', color: '#9CA3AF', margin: 0 }}>{region}</p>}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
        <button
          onClick={() => onModerate(item.id, 'VALIDE')}
          disabled={isProcessing}
          title="Valider"
          style={{
            width: '30px', height: '30px', borderRadius: '50%',
            border: '1.5px solid #BBF7D0', backgroundColor: '#F0FDF4',
            color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            opacity: isProcessing ? 0.5 : 1, transition: 'all 0.15s',
          }}
          onMouseOver={e => { if (!isProcessing) { e.currentTarget.style.backgroundColor = '#059669'; e.currentTarget.style.color = 'white'; } }}
          onMouseOut={e => { e.currentTarget.style.backgroundColor = '#F0FDF4'; e.currentTarget.style.color = '#059669'; }}
        >
          <Check size={13} />
        </button>
        <button
          onClick={() => onModerate(item.id, 'REFUSE')}
          disabled={isProcessing}
          title="Refuser"
          style={{
            width: '30px', height: '30px', borderRadius: '50%',
            border: '1.5px solid #FECACA', backgroundColor: '#FEF2F2',
            color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            opacity: isProcessing ? 0.5 : 1, transition: 'all 0.15s',
          }}
          onMouseOver={e => { if (!isProcessing) { e.currentTarget.style.backgroundColor = '#DC2626'; e.currentTarget.style.color = 'white'; } }}
          onMouseOut={e => { e.currentTarget.style.backgroundColor = '#FEF2F2'; e.currentTarget.style.color = '#DC2626'; }}
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
};

export default PendingVerifications;