import React, { useEffect, useState } from 'react';
import { darlinkApi } from '../../services/darlinkApi';
import { FileText, CheckCircle, Clock, UploadCloud } from 'lucide-react';

export default function ClientDocumentRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState<number | null>(null);

  const fetchRequests = async () => {
    try {
      const data = await darlinkApi.listClientRequests();
      setRequests(data);
    } catch (err) {
      setError('Erreur lors du chargement des demandes de documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, requestId: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(requestId);
    setError('');

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      try {
        await darlinkApi.respondToDocumentRequest(requestId, base64);
        fetchRequests();
      } catch (err) {
        setError('Erreur lors de l\'envoi du document.');
      } finally {
        setUploading(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const formatStatus = (s: string) => {
    if (s === 'EN_ATTENTE') return 'En attente';
    if (s === 'VALIDE') return 'Validé';
    if (s === 'REFUSE') return 'Refusé';
    return s;
  };

  if (loading) return null;
  if (requests.length === 0) return null;

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #F0EDE8', padding: '24px', marginBottom: '24px' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1A1A2E', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <FileText size={20} color="#DD7246" /> Documents Demandés
      </h3>

      {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {requests.map(req => (
          <div key={req.id} style={{ padding: '16px', borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: req.statut === 'EN_ATTENTE' ? '#FFFBEB' : '#F9FAFB' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>
                  Pièce d'identité requise
                </h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#6B7280' }}>
                  Demandé par {req.hote?.user?.nom || 'votre hôte'} le {new Date(req.dateDemande).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                padding: '4px 8px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700,
                backgroundColor: req.statut === 'VALIDE' ? '#D1FAE5' : req.statut === 'REFUSE' ? '#FEE2E2' : '#FEF3C7',
                color: req.statut === 'VALIDE' ? '#065F46' : req.statut === 'REFUSE' ? '#991B1B' : '#92400E'
              }}>
                {req.statut === 'VALIDE' ? <CheckCircle size={12} /> : <Clock size={12} />}
                {formatStatus(req.statut)}
              </span>
            </div>

            {req.statut === 'EN_ATTENTE' && !req.document && (
              <label style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '12px', backgroundColor: 'white', border: '2px dashed #D1D5DB', borderRadius: '8px',
                cursor: uploading === req.id ? 'not-allowed' : 'pointer', opacity: uploading === req.id ? 0.6 : 1,
                transition: 'all 0.2s', color: '#4B5563', fontWeight: 600, fontSize: '0.85rem'
              }}>
                <UploadCloud size={18} />
                {uploading === req.id ? 'Envoi en cours...' : 'Uploader ma CIN / Passeport'}
                <input 
                  type="file" 
                  accept="image/*,.pdf" 
                  style={{ display: 'none' }} 
                  onChange={(e) => handleFileUpload(e, req.id)}
                  disabled={uploading === req.id}
                />
              </label>
            )}

            {req.document && (
              <div style={{ fontSize: '0.8rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle size={14} /> Document soumis. En attente de validation par l'hôte.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
