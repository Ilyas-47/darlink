import React, { useEffect, useState, useRef } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { darlinkApi } from '../../services/darlinkApi';
import { getStoredUser } from '../../config/api';

interface Conversation {
  contactId: number;
  contactUser: { id: number; nom: string; photoProfil?: string; role: string };
  lastMessage: { contenu: string; dateEnvoi: string; lu: boolean };
  unreadCount: number;
}

interface Message {
  id: number;
  expediteurId: number;
  destinataireId: number;
  contenu: string;
  dateEnvoi: string;
  coliving?: { id: number; titre: string };
}

const HostMessages: React.FC = () => {
  const me = getStoredUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeContact, setActiveContact] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeContact) {
      fetchMessages(activeContact.contactId);
    }
  }, [activeContact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const data = await darlinkApi.getConversations();
      setConversations(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setLoading(false);
    }
  };

  const fetchMessages = async (contactId: number) => {
    try {
      const data = await darlinkApi.getMessages(contactId);
      setMessages(data);
      // Update unread count locally
      setConversations(prev => prev.map(c => 
        c.contactId === contactId ? { ...c, unreadCount: 0 } : c
      ));
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !activeContact) return;
    
    try {
      const msg = await darlinkApi.sendMessage(activeContact.contactId, newMessage);
      setMessages(prev => [...prev, msg]);
      setNewMessage('');
      
      // Update conversation list with latest message
      setConversations(prev => prev.map(c => 
        c.contactId === activeContact.contactId 
          ? { ...c, lastMessage: { contenu: msg.contenu, dateEnvoi: msg.dateEnvoi, lu: true } }
          : c
      ));
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>Chargement des messages...</div>;
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 140px)', backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #F0EDE8' }}>
      {/* Sidebar: Conversations List */}
      <div style={{ width: '300px', borderRight: '1px solid #F0EDE8', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #F0EDE8', backgroundColor: '#FAF9F7' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1A1A2E', margin: 0 }}>Boîte de réception</h2>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversations.length === 0 ? (
            <p style={{ padding: '20px', color: '#9CA3AF', fontSize: '0.9rem', textAlign: 'center' }}>Aucun message pour le moment.</p>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.contactId}
                onClick={() => setActiveContact(conv)}
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid #F0EDE8',
                  cursor: 'pointer',
                  backgroundColor: activeContact?.contactId === conv.contactId ? '#F8F7F5' : 'transparent',
                  transition: 'background-color 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={conv.contactUser.photoProfil || `https://ui-avatars.com/api/?background=DD7246&color=fff&bold=true&name=${conv.contactUser.nom}`}
                    alt={conv.contactUser.nom}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: conv.unreadCount > 0 ? 800 : 600, color: '#1A1A2E', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {conv.contactUser.nom}
                      </h4>
                      <span style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>
                        {new Date(conv.lastMessage.dateEnvoi).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: conv.unreadCount > 0 ? '#1A1A2E' : '#6B7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: conv.unreadCount > 0 ? 600 : 400 }}>
                      {conv.lastMessage.contenu}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#DD7246' }} />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#FAF9F7' }}>
        {activeContact ? (
          <>
            {/* Chat Header */}
            <div style={{ padding: '20px', borderBottom: '1px solid #F0EDE8', backgroundColor: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img
                src={activeContact.contactUser.photoProfil || `https://ui-avatars.com/api/?background=DD7246&color=fff&bold=true&name=${activeContact.contactUser.nom}`}
                alt={activeContact.contactUser.nom}
                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#1A1A2E' }}>{activeContact.contactUser.nom}</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#6B7280' }}>
                  {activeContact.contactUser.role === 'HOTE' ? 'Hôte Darlink' : 'Client Darlink'}
                </p>
              </div>
            </div>

            {/* Chat Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {messages.map((msg, index) => {
                const isMine = msg.expediteurId === me?.id;
                const showColivingRef = msg.coliving && (index === 0 || messages[index - 1].coliving?.id !== msg.coliving.id);
                return (
                  <React.Fragment key={msg.id}>
                    {showColivingRef && (
                      <div style={{ textAlign: 'center', margin: '10px 0' }}>
                        <span style={{ backgroundColor: '#F3F4F6', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', color: '#6B7280', fontWeight: 600 }}>
                          À propos de : {msg.coliving?.titre}
                        </span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        maxWidth: '70%',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        borderBottomRightRadius: isMine ? '4px' : '16px',
                        borderBottomLeftRadius: !isMine ? '4px' : '16px',
                        backgroundColor: isMine ? '#DD7246' : 'white',
                        color: isMine ? 'white' : '#1A1A2E',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                        border: isMine ? 'none' : '1px solid #F0EDE8'
                      }}>
                        <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>{msg.contenu}</p>
                        <p style={{ margin: '4px 0 0', fontSize: '0.65rem', color: isMine ? 'rgba(255,255,255,0.7)' : '#9CA3AF', textAlign: 'right' }}>
                          {new Date(msg.dateEnvoi).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div style={{ padding: '20px', borderTop: '1px solid #F0EDE8', backgroundColor: 'white' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Écrivez votre message..."
                  style={{
                    flex: 1, minHeight: '48px', maxHeight: '120px', padding: '12px 16px',
                    borderRadius: '24px', border: '1px solid #E5E7EB',
                    fontSize: '0.95rem', fontFamily: 'inherit', resize: 'none',
                    outline: 'none', backgroundColor: '#F9FAFB'
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                  style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    backgroundColor: '#DD7246', color: 'white', border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: !newMessage.trim() ? 'not-allowed' : 'pointer',
                    opacity: !newMessage.trim() ? 0.6 : 1,
                    transition: 'all 0.2s', flexShrink: 0
                  }}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <MessageSquare size={32} color="#D1D5DB" />
            </div>
            <p style={{ fontSize: '1.1rem', margin: 0 }}>Sélectionnez une conversation pour afficher les messages</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostMessages;
