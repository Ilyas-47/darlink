import React, { useState } from 'react';
import { Check, X, FileSearch } from 'lucide-react';
import { darlinkApi } from '../../services/darlinkApi';

interface HostReservation {
  id: number;
  statut: string;
  dateDebut: string;
  dateFin: string;
  nombrePersonnes: number;
  prixTotal: string | number;
  clientId: number;
  client: { nom: string; email: string };
  coliving: { titre: string };
  chambre: { nom: string };
}

interface RecentBookingsProps {
  reservations: HostReservation[];
  actionId: number | null;
  onDecision: (id: number, decision: 'confirm' | 'reject') => void;
  limit?: number;
}

const INITIALS = (name: string) =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

const COLORS = ['#DD7246', '#4F46E5', '#059669', '#D97706', '#E11D74'];

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  EN_ATTENTE: { label: 'En attente',   color: '#D97706', bg: '#FFFBEB' },
  CONFIRMEE:  { label: 'Confirmée', color: '#059669', bg: '#F0FDF4' },
  ANNULEE:    { label: 'Annulée', color: '#DC2626', bg: '#FEF2F2' },
};

const RecentBookings: React.FC<RecentBookingsProps> = ({ reservations, actionId, onDecision, limit }) => {
  const [requestingDoc, setRequestingDoc] = useState<number | null>(null);

  const handleRequestDoc = async (clientId: number) => {
    setRequestingDoc(clientId);
    try {
      await darlinkApi.requestClientDocument(clientId);
      alert('Demande de pièce d\'identité envoyée au client avec succès.');
    } catch (error) {
      alert('Erreur lors de la demande de document.');
    } finally {
      setRequestingDoc(null);
    }
  };

  // Sort reservations: Pending first, then by ID descending (newest first)
  const sortedReservations = [...reservations].sort((a, b) => {
    if (a.statut === 'EN_ATTENTE' && b.statut !== 'EN_ATTENTE') return -1;
    if (a.statut !== 'EN_ATTENTE' && b.statut === 'EN_ATTENTE') return 1;
    return b.id - a.id;
  });

  const displayedReservations = limit ? sortedReservations.slice(0, limit) : sortedReservations;

  return (
    <div style={{
      backgroundColor: 'white', borderRadius: '16px',
      border: '1.5px solid #F0EDE8', overflow: 'hidden', flex: 1,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 18px', borderBottom: '1px solid #F0EDE8' }}>
        <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1A1A2E', margin: 0 }}>
          {limit ? 'Réservations Récentes' : 'Toutes les Réservations'}
        </h3>
      </div>

      {/* List */}
      <div style={{ padding: '8px 0' }}>
        {displayedReservations.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF', fontSize: '0.85rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📋</div>
            Aucune réservation pour le moment
          </div>
        ) : (
          displayedReservations.map((r, i) => {
            const cfg = STATUS_CFG[r.statut] || { label: r.statut, color: '#9CA3AF', bg: '#F5F3F0' };
            const isPending = r.statut === 'EN_ATTENTE';
            const isProcessing = actionId === r.id;
            const color = COLORS[i % COLORS.length];

            return (
              <div key={r.id} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '11px 18px', borderBottom: '1px solid #F9F8F6',
                transition: 'background 0.15s',
              }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = '#FAFAF9')}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {/* Avatar */}
                <div style={{
                  width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                  backgroundColor: color + '20', border: `1.5px solid ${color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color, fontWeight: 700, fontSize: '0.72rem',
                }}>
                  {INITIALS(r.client.nom)}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1A1A2E', margin: 0 }}>
                    {r.client.nom}
                  </p>
                  <p style={{ fontSize: '0.72rem', color: '#9CA3AF', margin: 0 }}>
                    {r.coliving.titre} · {r.chambre.nom}
                  </p>
                </div>

                {/* Price */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#DD7246', margin: 0 }}>
                    MAD {Number(r.prixTotal).toFixed(0)}
                  </p>
                  {isPending && (
                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => onDecision(r.id, 'confirm')}
                        disabled={isProcessing}
                        style={{
                          width: '24px', height: '24px', borderRadius: '50%',
                          border: '1.5px solid #BBF7D0', backgroundColor: '#F0FDF4',
                          color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: isProcessing ? 'not-allowed' : 'pointer', opacity: isProcessing ? 0.5 : 1,
                          transition: 'all 0.15s',
                        }}
                        onMouseOver={e => { if (!isProcessing) { e.currentTarget.style.backgroundColor = '#059669'; e.currentTarget.style.color = 'white'; } }}
                        onMouseOut={e => { e.currentTarget.style.backgroundColor = '#F0FDF4'; e.currentTarget.style.color = '#059669'; }}
                      >
                        <Check size={11} />
                      </button>
                      <button
                        onClick={() => onDecision(r.id, 'reject')}
                        disabled={isProcessing}
                        style={{
                          width: '24px', height: '24px', borderRadius: '50%',
                          border: '1.5px solid #FECACA', backgroundColor: '#FEF2F2',
                          color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: isProcessing ? 'not-allowed' : 'pointer', opacity: isProcessing ? 0.5 : 1,
                          transition: 'all 0.15s',
                        }}
                        onMouseOver={e => { if (!isProcessing) { e.currentTarget.style.backgroundColor = '#DC2626'; e.currentTarget.style.color = 'white'; } }}
                        onMouseOut={e => { e.currentTarget.style.backgroundColor = '#FEF2F2'; e.currentTarget.style.color = '#DC2626'; }}
                      >
                        <X size={11} />
                      </button>
                    </div>
                  )}
                  {!isPending && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                      <span style={{
                        display: 'inline-flex', backgroundColor: cfg.bg,
                        color: cfg.color, borderRadius: '100px',
                        padding: '4px 10px', fontSize: '0.68rem',
                        fontWeight: 700, letterSpacing: '0.04em'
                      }}>
                        {cfg.label}
                      </span>
                      {r.statut === 'CONFIRMEE' && (
                        <button
                          onClick={() => handleRequestDoc(r.clientId)}
                          disabled={requestingDoc === r.clientId}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            padding: '4px 8px', borderRadius: '6px', border: 'none',
                            backgroundColor: '#FEF3C7', color: '#D97706', fontSize: '0.7rem',
                            fontWeight: 600, cursor: requestingDoc === r.clientId ? 'wait' : 'pointer'
                          }}
                          title="Demander la pièce d'identité du client"
                        >
                          <FileSearch size={12} />
                          {requestingDoc === r.clientId ? 'Envoi...' : 'Demander ID'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentBookings;