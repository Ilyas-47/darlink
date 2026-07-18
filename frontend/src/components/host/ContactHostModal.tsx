import React, { useState } from 'react';
import { X, Send, LogIn } from 'lucide-react';
import { darlinkApi } from '../../services/darlinkApi';
import { getStoredUser } from '../../config/api';
import { Link } from 'react-router-dom';

interface ContactHostModalProps {
  isOpen: boolean;
  onClose: () => void;
  hostId: number;
  hostName: string;
  colivingId?: number;
}

const ContactHostModal: React.FC<ContactHostModalProps> = ({ isOpen, onClose, hostId, hostName, colivingId }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const me = getStoredUser();

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);
    setError('');
    
    try {
      await darlinkApi.sendMessage(hostId, message, colivingId);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setMessage('');
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'envoi');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white', borderRadius: '16px',
        width: '100%', maxWidth: '500px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid #F0EDE8',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1A1A2E', margin: 0 }}>
            Contacter {hostName}
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#DEF7EC', color: '#03543F', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Send size={28} />
              </div>
              <h4 style={{ fontSize: '1.2rem', color: '#1A1A2E', marginBottom: '8px' }}>Message envoyé !</h4>
              <p style={{ color: '#6B7280' }}>L'hôte a bien reçu votre demande.</p>
            </div>
          ) : (
            <>
              {error && (
                <div style={{ backgroundColor: '#FEF2F2', color: '#DC2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>
                  {error}
                </div>
              )}
              
              <p style={{ fontSize: '0.9rem', color: '#6B7280', marginBottom: '16px' }}>
                Écrivez votre message à l'attention de l'hôte. Il vous répondra dans les plus brefs délais.
              </p>

              {me ? (
                <>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Bonjour, je suis intéressé(e) par..."
                    style={{
                      width: '100%', minHeight: '150px', padding: '16px',
                      borderRadius: '12px', border: '1px solid #E5E7EB',
                      fontSize: '0.95rem', fontFamily: 'inherit', resize: 'vertical',
                      marginBottom: '20px', outline: 'none'
                    }}
                  />

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button
                      onClick={onClose}
                      style={{
                        padding: '12px 20px', borderRadius: '10px',
                        backgroundColor: '#F3F4F6', color: '#4B5563',
                        border: 'none', fontWeight: 600, cursor: 'pointer'
                      }}
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSend}
                      disabled={sending || !message.trim()}
                      style={{
                        padding: '12px 24px', borderRadius: '10px',
                        backgroundColor: '#DD7246', color: 'white',
                        border: 'none', fontWeight: 600, cursor: sending || !message.trim() ? 'not-allowed' : 'pointer',
                        opacity: sending || !message.trim() ? 0.7 : 1,
                        display: 'flex', alignItems: 'center', gap: '8px'
                      }}
                    >
                      {sending ? 'Envoi...' : (
                        <>
                          Envoyer <Send size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <LogIn size={28} />
                  </div>
                  <h4 style={{ fontSize: '1.1rem', color: '#1A1A2E', marginBottom: '8px' }}>Connexion requise</h4>
                  <p style={{ color: '#6B7280', marginBottom: '24px' }}>Vous devez être connecté pour envoyer un message à l'hôte.</p>
                  <Link
                    to="/auth"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      padding: '12px 24px', borderRadius: '10px',
                      backgroundColor: '#DD7246', color: 'white',
                      textDecoration: 'none', fontWeight: 600
                    }}
                  >
                    Se connecter
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactHostModal;
