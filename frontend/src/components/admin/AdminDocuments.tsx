import { useEffect, useState } from 'react';
import { darlinkApi } from '../../services/darlinkApi';
import { FileText, CheckCircle, XCircle } from 'lucide-react';

interface PendingDocument {
  id: number;
  type: string;
  fichier: string;
  statut: string;
  dateSoumission: string;
  user: string;
  email: string;
}

export default function AdminDocuments() {
  const [documents, setDocuments] = useState<PendingDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState<number | null>(null);

  const fetchDocuments = async () => {
    try {
      const data = await darlinkApi.listPendingDocumentsAdmin();
      setDocuments(data);
    } catch (e) {
      setError('Erreur lors du chargement des documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleModerate = async (id: number, statut: 'VALIDE' | 'REFUSE') => {
    setActionId(id);
    setError('');
    try {
      await darlinkApi.moderateDocumentAdmin(id, statut);
      setDocuments(prev => prev.filter(d => d.id !== id));
    } catch (e) {
      setError('Erreur lors de la modération du document.');
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
    return <p style={{ color: '#6B7280' }}>Chargement des documents...</p>;
  }

  return (
    <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #F0EDE8' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1A1A2E', margin: '0 0 4px' }}>
          Validation des Documents Hôtes
        </h2>
        <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: 0 }}>
          Vérifiez les pièces d'identité et les contrats électroniques signés par les nouveaux hôtes.
        </p>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', backgroundColor: '#FEF2F2', color: '#DC2626', borderRadius: '8px', border: '1px solid #FECACA', fontSize: '0.9rem', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {documents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#F9FAFB', borderRadius: '12px' }}>
          <FileText size={48} color="#D1D5DB" style={{ marginBottom: '16px' }} />
          <p style={{ color: '#6B7280', margin: 0, fontWeight: 500 }}>Aucun document en attente de validation.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {documents.map(doc => (
            <div key={doc.id} style={{ display: 'flex', flexDirection: 'column', padding: '20px', border: '1px solid #E5E7EB', borderRadius: '12px', backgroundColor: '#FAF9F7' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#DD7246', textTransform: 'uppercase' }}>
                    {doc.type === 'CONTRAT_SIGNE' ? 'Contrat' : 'Identité'}
                  </span>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1A1A2E', margin: '4px 0 2px' }}>{doc.user}</h4>
                  <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: 0 }}>{doc.email}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>Soumis le</span>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', margin: 0 }}>
                    {new Date(doc.dateSoumission).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>

              <div style={{ height: '160px', backgroundColor: '#F3F4F6', borderRadius: '8px', marginBottom: '16px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {doc.fichier.endsWith('.pdf') ? (
                  <a href={doc.fichier} target="_blank" rel="noopener noreferrer" style={{ color: '#4F46E5', fontWeight: 600, textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <FileText size={32} />
                    Ouvrir le PDF
                  </a>
                ) : (
                  <a href={doc.fichier} target="_blank" rel="noopener noreferrer" style={{ width: '100%', height: '100%', display: 'block' }}>
                    <img src={doc.fichier} alt="Document" style={{ width: '100%', height: '100%', objectFit: doc.type === 'CONTRAT_SIGNE' ? 'contain' : 'cover' }} />
                  </a>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                <button
                  onClick={() => handleModerate(doc.id, 'REFUSE')}
                  disabled={actionId === doc.id}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #FECACA', backgroundColor: 'white', color: '#DC2626', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <XCircle size={16} /> Refuser
                </button>
                <button
                  onClick={() => handleModerate(doc.id, 'VALIDE')}
                  disabled={actionId === doc.id}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#059669', color: 'white', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <CheckCircle size={16} /> Valider
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
