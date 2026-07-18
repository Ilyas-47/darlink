import { useEffect, useState } from 'react';
import { darlinkApi } from '../../services/darlinkApi';
import { FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

interface ClientDocRequest {
  id: number;
  statut: string;
  dateDemande: string;
  hote: { user: { nom: string } };
  client: { user: { nom: string; email: string } };
  document: { fichier: string; statut: string } | null;
}

export default function AdminClientDocs() {
  const [requests, setRequests] = useState<ClientDocRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await darlinkApi.listAllRequestsAdmin();
        setRequests(data);
      } catch (err) {
        setError('Erreur lors du chargement des demandes de documents clients.');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'VALIDE': return <CheckCircle size={16} color="#10B981" />;
      case 'REFUSE': return <XCircle size={16} color="#EF4444" />;
      default: return <Clock size={16} color="#F59E0B" />;
    }
  };

  const [viewingFile, setViewingFile] = useState<string | null>(null);

  const formatStatus = (s: string) => {
    if (s === 'EN_ATTENTE') return 'En attente';
    if (s === 'VALIDE') return 'Validé';
    if (s === 'REFUSE') return 'Refusé';
    return s;
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #F0EDE8' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1A1A2E', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={24} color="#DD7246" /> Documents Clients
        </h2>
        <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: 0 }}>
          Supervision des demandes de pièces d'identité effectuées par les hôtes aux clients.
        </p>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', backgroundColor: '#FEF2F2', color: '#DC2626', borderRadius: '8px', border: '1px solid #FECACA', fontSize: '0.9rem', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <p style={{ color: '#6B7280' }}>Chargement...</p>
      ) : requests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#F9FAFB', borderRadius: '12px' }}>
          <FileText size={48} color="#D1D5DB" style={{ marginBottom: '16px' }} />
          <p style={{ color: '#6B7280', margin: 0, fontWeight: 500 }}>Aucune demande de document client.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB', color: '#4B5563', borderBottom: '1px solid #E5E7EB', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Demandé par (Hôte)</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Demandé à (Client)</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Fichier</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Statut Hôte</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '12px 16px', color: '#6B7280' }}>
                    {new Date(req.dateDemande).toLocaleDateString('fr-FR')}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 500, color: '#111827' }}>
                    {req.hote?.user?.nom || 'Inconnu'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 500, color: '#111827' }}>{req.client?.user?.nom || 'Inconnu'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{req.client?.user?.email}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {req.document?.fichier ? (
                      <button onClick={() => setViewingFile(req.document!.fichier)} style={{ color: '#3B82F6', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        Voir Fichier
                      </button>
                    ) : (
                      <span style={{ color: '#9CA3AF' }}>Non soumis</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 8px', borderRadius: '9999px', backgroundColor: '#F3F4F6', fontWeight: 600 }}>
                      {getStatusIcon(req.statut)}
                      {formatStatus(req.statut)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* File Viewer Modal */}
      {viewingFile && (
        <div 
          onClick={() => setViewingFile(null)} 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', backgroundColor: 'white', borderRadius: '12px', padding: '20px', maxWidth: '800px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1A1A2E' }}>Document</h3>
              <button onClick={() => setViewingFile(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
                <XCircle size={24} />
              </button>
            </div>
            <div style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', backgroundColor: '#F3F4F6', borderRadius: '8px' }}>
              {viewingFile.startsWith('data:application/pdf') ? (
                <iframe src={viewingFile} style={{ width: '100%', height: '600px', border: 'none' }} title="Document PDF" />
              ) : (
                <img src={viewingFile} alt="Document" style={{ maxWidth: '100%', objectFit: 'contain' }} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
