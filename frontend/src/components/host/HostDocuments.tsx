import React, { useEffect, useState } from 'react';
import { darlinkApi } from '../../services/darlinkApi';
import SignaturePad from '../shared/SignaturePad';
import { UploadCloud, CheckCircle, Clock, XCircle, FileText } from 'lucide-react';

interface Document {
  id: number;
  type: string;
  fichier: string;
  statut: string;
  dateSoumission: string;
}

export default function HostDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);

  const fetchDocuments = async () => {
    try {
      const data = await darlinkApi.listMyDocuments();
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const { url } = await darlinkApi.uploadImage(file);
      await darlinkApi.uploadDocument('PIECE_IDENTITE', url);
      setSuccess('Document envoyé avec succès. En attente de validation.');
      fetchDocuments();
    } catch (err) {
      setError("Erreur lors de l'envoi du document.");
    } finally {
      setUploading(false);
    }
  };

  const handleSignature = async (base64: string) => {
    setUploading(true);
    setError('');
    setSuccess('');

    try {
      await darlinkApi.uploadDocument('CONTRAT_SIGNE', base64);
      setSuccess('Contrat signé avec succès. En attente de validation.');
      fetchDocuments();
      setIsContractModalOpen(false);
    } catch (err) {
      setError("Erreur lors de l'envoi de la signature.");
    } finally {
      setUploading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VALIDE': return <CheckCircle size={16} color="#059669" />;
      case 'REFUSE': return <XCircle size={16} color="#DC2626" />;
      default: return <Clock size={16} color="#D97706" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'VALIDE': return 'Validé';
      case 'REFUSE': return 'Refusé';
      default: return 'En attente';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* ── ALERTS ── */}
      {error && (
        <div style={{ padding: '12px 16px', backgroundColor: '#FEF2F2', color: '#DC2626', borderRadius: '8px', border: '1px solid #FECACA', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ padding: '12px 16px', backgroundColor: '#F0FDF4', color: '#059669', borderRadius: '8px', border: '1px solid #A7F3D0', fontSize: '0.9rem' }}>
          {success}
        </div>
      )}

      {/* ── DOCUMENTS LIST ── */}
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #F0EDE8' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1A1A2E', margin: '0 0 16px' }}>Mes documents soumis</h2>
        
        {loading ? (
          <p style={{ color: '#6B7280' }}>Chargement...</p>
        ) : documents.length === 0 ? (
          <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>Vous n'avez soumis aucun document pour le moment.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {documents.map(doc => (
              <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #E5E7EB', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '10px', backgroundColor: '#F3F4F6', borderRadius: '8px', color: '#4B5563' }}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: 600, color: '#111827' }}>
                      {doc.type === 'CONTRAT_SIGNE' ? 'Contrat Électronique' : "Pièce d'identité"}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#6B7280' }}>
                      Soumis le {new Date(doc.dateSoumission).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: '#F9FAFB', borderRadius: '20px', border: '1px solid #E5E7EB' }}>
                  {getStatusIcon(doc.statut)}
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>{getStatusText(doc.statut)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* ── UPLOAD ID ── */}
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #F0EDE8' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1A1A2E', margin: '0 0 8px' }}>Pièce d'identité</h3>
          <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: '0 0 16px', lineHeight: 1.5 }}>
            Veuillez fournir une copie claire de votre carte d'identité nationale (CIN) ou passeport pour valider votre compte hôte.
          </p>
          
          <label style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '32px', border: '2px dashed #D1D5DB', borderRadius: '12px',
            backgroundColor: '#F9FAFB', cursor: uploading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s', opacity: uploading ? 0.7 : 1
          }}>
            <UploadCloud size={32} color="#9CA3AF" style={{ marginBottom: '12px' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>Cliquez pour uploader</span>
            <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>PNG, JPG ou PDF (max. 5MB)</span>
            <input type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={handleFileUpload} disabled={uploading} />
          </label>
        </div>

        {/* ── ELECTRONIC SIGNATURE ── */}
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #F0EDE8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1A1A2E', margin: '0 0 8px' }}>Contrat Électronique</h3>
          <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: '0 0 20px', lineHeight: 1.5, textAlign: 'center' }}>
            Vous devez lire attentivement le contrat avant de pouvoir le signer.
          </p>
          
          <button
            onClick={() => setIsContractModalOpen(true)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#DD7246',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FileText size={18} />
            Lire et Signer le Contrat
          </button>
        </div>
      </div>

      {/* ── MODAL CONTRAT ── */}
      {isContractModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '600px',
            maxHeight: '90vh', display: 'flex', flexDirection: 'column',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                Contrat Hôte Darlink
              </h2>
              <button onClick={() => setIsContractModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
                <XCircle size={24} />
              </button>
            </div>
            
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1, backgroundColor: '#F9FAFB' }}>
              <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '0.85rem', color: '#374151', lineHeight: 1.6 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>1. Objet du Contrat</h3>
                <p style={{ marginBottom: '16px' }}>Le présent contrat a pour objet de définir les conditions générales de location et de collaboration entre Darlink et l'Hôte pour la mise à disposition d'espaces de coliving.</p>
                
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>2. Engagements de l'Hôte</h3>
                <p style={{ marginBottom: '16px' }}>L'Hôte s'engage à fournir des logements conformes aux descriptions, à respecter les standards de propreté, de sécurité et d'accueil définis par la charte qualité de Darlink.</p>

                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>3. Conditions Financières</h3>
                <p style={{ marginBottom: '16px' }}>Les revenus générés par les réservations seront versés à l'Hôte déduction faite des frais de service de la plateforme, conformément à la grille tarifaire en vigueur.</p>

                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>4. Durée et Résiliation</h3>
                <p style={{ marginBottom: '16px' }}>Ce contrat est conclu pour une durée indéterminée. Il peut être résilié par l'une ou l'autre des parties moyennant un préavis de 30 jours.</p>
              </div>
            </div>

            <div style={{ padding: '24px', borderTop: '1px solid #E5E7EB' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', margin: '0 0 12px' }}>
                Signature Électronique
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: '0 0 16px' }}>
                En signant dans le cadre ci-dessous, vous acceptez sans réserve les termes du contrat.
              </p>
              <SignaturePad 
                onSign={handleSignature} 
                onClear={() => {}} 
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
