import { useEffect, useState } from 'react';
import { darlinkApi } from '../../services/darlinkApi';
import { Activity, Clock } from 'lucide-react';

interface AuditLog {
  id: number;
  user: string;
  email: string;
  action: string;
  details: string;
  dateCreation: string;
}

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await darlinkApi.getAuditLogs();
        setLogs(data);
      } catch (err) {
        setError('Erreur lors du chargement de la traçabilité.');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #F0EDE8' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1A1A2E', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={24} color="#DD7246" /> Journal d'Activité
        </h2>
        <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: 0 }}>
          Traçabilité globale des actions critiques effectuées sur la plateforme.
        </p>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', backgroundColor: '#FEF2F2', color: '#DC2626', borderRadius: '8px', border: '1px solid #FECACA', fontSize: '0.9rem', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <p style={{ color: '#6B7280' }}>Chargement des logs...</p>
      ) : logs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#F9FAFB', borderRadius: '12px' }}>
          <Activity size={48} color="#D1D5DB" style={{ marginBottom: '16px' }} />
          <p style={{ color: '#6B7280', margin: 0, fontWeight: 500 }}>Aucune activité enregistrée.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {logs.map(log => (
            <div key={log.id} style={{ display: 'flex', flexDirection: 'column', padding: '16px', border: '1px solid #E5E7EB', borderRadius: '12px', backgroundColor: '#FAF9F7' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111827', backgroundColor: '#E5E7EB', padding: '4px 8px', borderRadius: '4px' }}>
                  {log.action}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> {new Date(log.dateCreation).toLocaleString('fr-FR')}
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#374151', marginBottom: '4px' }}>
                <strong>Utilisateur :</strong> {log.user} ({log.email})
              </div>
              <div style={{ fontSize: '0.8rem', color: '#4B5563' }}>
                <strong>Détails :</strong> {log.details}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
