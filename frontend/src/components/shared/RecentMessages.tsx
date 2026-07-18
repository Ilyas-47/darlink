import React, { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { darlinkApi } from '../../services/darlinkApi';

interface Conversation {
  contactId: number;
  contactUser: { id: number; nom: string; photoProfil?: string; role: string };
  lastMessage: { contenu: string; dateEnvoi: string; lu: boolean };
  unreadCount: number;
}

interface RecentMessagesProps {
  onGoToMessages?: () => void;
}

const INITIALS = (name: string) => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

const RecentMessages: React.FC<RecentMessagesProps> = ({ onGoToMessages }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await darlinkApi.getConversations();
        setConversations(data.slice(0, 3)); // Only keep the 3 most recent
      } catch (err) {
        console.error('Error fetching recent conversations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  const totalUnread = conversations.reduce((acc, conv) => acc + conv.unreadCount, 0);

  return (
    <div style={{
      width: '240px', minWidth: '240px',
      backgroundColor: 'white', borderRadius: '16px',
      border: '1.5px solid #F0EDE8', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 18px', borderBottom: '1px solid #F0EDE8' }}>
        <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1A1A2E', margin: 0 }}>
          Recent Messages
        </h3>
        {totalUnread > 0 && (
          <span style={{
            backgroundColor: '#DD7246', color: 'white',
            borderRadius: '100px', padding: '2px 7px',
            fontSize: '0.65rem', fontWeight: 800,
          }}>
            {totalUnread} new
          </span>
        )}
      </div>

      {/* Messages List */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#9CA3AF', fontSize: '0.8rem' }}>Chargement...</div>
        ) : conversations.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#9CA3AF', fontSize: '0.8rem' }}>Aucun message récent</div>
        ) : (
          conversations.map((conv, idx) => {
            const isLast = idx === conversations.length - 1;
            const timeStr = new Date(conv.lastMessage.dateEnvoi).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
            return (
              <div key={conv.contactId} style={{
                display: 'flex', gap: '12px', padding: '14px 18px',
                borderBottom: isLast ? 'none' : '1px solid #F8F7F5',
                cursor: 'pointer', transition: 'background-color 0.2s',
                backgroundColor: conv.unreadCount > 0 ? '#FDFBF9' : 'transparent',
              }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = '#F8F7F5')}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = conv.unreadCount > 0 ? '#FDFBF9' : 'transparent')}
                onClick={onGoToMessages}
              >
                {/* Avatar */}
                <div style={{
                  width: '32px', height: '32px', minWidth: '32px',
                  borderRadius: '50%', backgroundColor: '#1A1A2E',
                  color: 'white', fontSize: '0.75rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {conv.contactUser.photoProfil ? (
                    <img src={conv.contactUser.photoProfil} alt={conv.contactUser.nom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    INITIALS(conv.contactUser.nom)
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0, paddingTop: '2px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
                    <h4 style={{
                      margin: 0, fontSize: '0.82rem',
                      fontWeight: conv.unreadCount > 0 ? 800 : 700,
                      color: '#1A1A2E', whiteSpace: 'nowrap',
                      overflow: 'hidden', textOverflow: 'ellipsis'
                    }}>
                      {conv.contactUser.nom}
                    </h4>
                    <span style={{ fontSize: '0.65rem', color: conv.unreadCount > 0 ? '#DD7246' : '#9CA3AF', fontWeight: conv.unreadCount > 0 ? 700 : 500 }}>
                      {timeStr}
                    </span>
                  </div>
                  <p style={{
                    margin: 0, fontSize: '0.78rem',
                    color: conv.unreadCount > 0 ? '#1A1A2E' : '#6B7280',
                    fontWeight: conv.unreadCount > 0 ? 600 : 400,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    lineHeight: 1.3
                  }}>
                    {conv.lastMessage.contenu}
                  </p>
                </div>

                {/* Unread indicator dot */}
                {conv.unreadCount > 0 && (
                  <div style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    backgroundColor: '#DD7246', marginTop: '6px'
                  }} />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer CTA */}
      <div style={{ padding: '14px 18px', borderTop: '1px solid #F0EDE8' }}>
        <button style={{
          width: '100%', padding: '10px',
          backgroundColor: '#1A1A2E', color: 'white',
          border: 'none', borderRadius: '10px',
          fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          transition: 'background 0.2s',
        }}
          onClick={onGoToMessages}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = '#DD7246')}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = '#1A1A2E')}
        >
          <MessageCircle size={13} /> ALLER AUX MESSAGES
        </button>
      </div>
    </div>
  );
};

export default RecentMessages;