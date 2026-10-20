import { useState, useEffect } from 'react';
import { Mail, MapPin, MessageCircle, Calendar, Edit2, Save, X, User, FileText, Activity } from 'lucide-react';
import { darlinkApi } from '../../services/darlinkApi';
import { setAuthSession, getAuthToken, getImageUrl } from '../../config/api';
import ClientDocumentRequests from '../../components/shared/ClientDocumentRequests';
import HostMessages from '../../components/host/HostMessages';
import ContactHostModal from '../../components/host/ContactHostModal';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import styles from '../../styles/UserProfilePage.module.css';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  country: string;
  bio: string;
  avatar: string;
  joinDate: string;
  interests: string[];
}

interface Booking {
  id: number;
  colivingId?: number;
  hoteId?: number;
  hoteName?: string;
  propertyName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  price: number;
  status: 'EN_ATTENTE' | 'CONFIRMEE' | 'ANNULEE' | 'TERMINEE' | string;
  image: string;
  paiement: any | null;
}

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'messages' | 'documents'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>({
    name: '', email: '', phone: '', country: 'Maroc', bio: '', avatar: '', joinDate: '', interests: []
  });

  const [editData, setEditData] = useState(profile);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Payment Modal state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'PAYPAL' | 'CARTE_BANCAIRE' | 'ESPECE'>('PAYPAL');
  const [processingPayment, setProcessingPayment] = useState(false);

  // Contact Host Modal state
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedHostForContact, setSelectedHostForContact] = useState<{
    hostId: number;
    hostName: string;
    colivingId?: number;
  } | null>(null);

  const fetchBookingsData = async () => {
    try {
      const res = await darlinkApi.listMyReservations();
      setBookings(res.map((r: any) => ({
        id: r.id,
        colivingId: r.coliving?.id,
        hoteId: r.coliving?.hoteId,
        hoteName: r.coliving?.hoteNom,
        propertyName: r.coliving?.titre || r.chambre?.coliving?.titre || 'Espace inconnu',
        location: r.coliving?.adresse || r.chambre?.coliving?.adresse || 'Adresse inconnue',
        checkIn: String(r.dateDebut).slice(0,10),
        checkOut: String(r.dateFin).slice(0,10),
        price: Number(r.prixTotal),
        status: r.statut,
        image: r.chambre?.coliving?.images?.[0]?.url 
          ? getImageUrl(r.chambre.coliving.images[0].url) 
          : r.coliving?.image
            ? getImageUrl(r.coliving.image)
            : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop',
        paiement: r.paiement
      })));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { user } = await darlinkApi.getMe();
        
        const p: UserProfile = {
          name: user.nom,
          email: user.email,
          phone: user.telephone || '',
          country: 'Maroc',
          bio: user.client?.biographie || user.hote?.ribBanque || '',
          avatar: user.photoProfil || `https://ui-avatars.com/api/?background=DD7246&color=fff&bold=true&name=${user.nom}`,
          joinDate: new Date().getFullYear().toString(),
          interests: ['🧘 Yoga', '💻 Coworking']
        };
        
        setProfile(p);
        setEditData(p);
        
        if (user.role === 'CLIENT') {
          await fetchBookingsData();
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erreur réseau');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    setError('');
    try {
      const { user } = await darlinkApi.updateMe({
        nom: editData.name,
        telephone: editData.phone,
        photoProfil: editData.avatar,
        biographie: editData.bio,
      });
      
      setProfile({
        ...profile,
        name: user.nom,
        phone: user.telephone || '',
        bio: user.client?.biographie || '',
        avatar: user.photoProfil || `https://ui-avatars.com/api/?background=DD7246&color=fff&bold=true&name=${user.nom}`
      });
      
      const token = getAuthToken();
      if (token) setAuthSession(token, user);
      
      setIsEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handlePaymentSubmit = async (method: 'PAYPAL' | 'CARTE_BANCAIRE' | 'ESPECE' | 'VIREMENT') => {
    if (!selectedBooking) return;
    setProcessingPayment(true);
    setError('');
    try {
      await darlinkApi.createPaiement(selectedBooking.id, method);
      await fetchBookingsData();
      setPaymentModalOpen(false);
      setSelectedBooking(null);
      alert('Paiement initié avec succès !');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur lors du paiement');
    } finally {
      setProcessingPayment(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'CONFIRMEE': return '#10B981';
      case 'PAYE': return '#10B981';
      case 'TERMINEE': return '#3B82F6';
      case 'EN_ATTENTE': return '#F59E0B';
      case 'ANNULEE': 
      case 'ECHOUE': return '#EF4444';
      default: return '#9CA3AF';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'CONFIRMEE': return 'Confirmée';
      case 'TERMINEE': return 'Terminée';
      case 'EN_ATTENTE': return 'En attente';
      case 'ANNULEE': return 'Annulée';
      case 'PAYE': return 'Payé';
      case 'ECHOUE': return 'Échoué';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>Chargement de votre espace...</div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      
      {/* Header Profile Summary */}
      <div className={styles.headerCard}>
        <img src={profile.avatar} alt="Avatar" className={styles.avatarImage} />
        <div style={{ flex: 1 }}>
          <h1 className={styles.welcomeText}>Bonjour, {profile.name} 👋</h1>
          <p className={styles.metaText}>
            <Mail size={16} /> {profile.email} • Membre depuis {profile.joinDate}
          </p>
        </div>
      </div>

      <div className={styles.gridContainer}>
        {/* Sidebar Navigation */}
        <div className={styles.sidebarNav}>
          <button 
            onClick={() => setActiveTab('profile')}
            className={styles.navButton}
            style={{
              backgroundColor: activeTab === 'profile' ? '#1A1A2E' : 'transparent',
              color: activeTab === 'profile' ? 'white' : '#6B7280'
            }}
          >
            <User size={20} /> Mes Informations
          </button>
          <button 
            onClick={() => setActiveTab('bookings')}
            className={styles.navButton}
            style={{
              backgroundColor: activeTab === 'bookings' ? '#1A1A2E' : 'transparent',
              color: activeTab === 'bookings' ? 'white' : '#6B7280'
            }}
          >
            <Calendar size={20} /> Mes Réservations
          </button>
          
          <button 
            onClick={() => setActiveTab('messages')}
            className={styles.navButton}
            style={{
              backgroundColor: activeTab === 'messages' ? '#1A1A2E' : 'transparent',
              color: activeTab === 'messages' ? 'white' : '#6B7280'
            }}
          >
            <MessageCircle size={20} /> Mes Messages
          </button>

          <button 
            onClick={() => setActiveTab('documents')}
            className={styles.navButton}
            style={{
              backgroundColor: activeTab === 'documents' ? '#1A1A2E' : 'transparent',
              color: activeTab === 'documents' ? 'white' : '#6B7280'
            }}
          >
            <FileText size={20} /> Mes Documents
          </button>
        </div>

        {/* Content Area */}
        <div className={styles.contentArea}>
          {error && <div className={styles.errorBanner}>{error}</div>}

          {/* TAB: PROFILE */}
          {activeTab === 'profile' && (
            <div>
              <div className={styles.tabHeader}>
                <h2 className={styles.tabTitle}>Informations Personnelles</h2>
                <button
                  onClick={() => { if (!isEditing) setEditData(profile); setIsEditing(!isEditing); }}
                  className={styles.actionButton}
                  style={{
                    backgroundColor: isEditing ? '#F3F4F6' : '#DD7246',
                    color: isEditing ? '#4B5563' : 'white'
                  }}
                >
                  {isEditing ? <><X size={18}/> Annuler</> : <><Edit2 size={18}/> Modifier</>}
                </button>
              </div>

              {isEditing ? (
                <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className={styles.formRow}>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>Nom complet</label>
                      <input type="text" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} className={styles.inputField} />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>Téléphone</label>
                      <input type="tel" value={editData.phone} onChange={e => setEditData({...editData, phone: e.target.value})} className={styles.inputField} />
                    </div>
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Biographie</label>
                    <textarea value={editData.bio} onChange={e => setEditData({...editData, bio: e.target.value})} className={styles.inputField} style={{ minHeight: '100px' }} />
                  </div>
                  <button type="button" onClick={handleSaveProfile} disabled={saving} className={styles.submitButton}>
                    <Save size={18} /> {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </form>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className={styles.formRow}>
                    <div>
                      <p className={styles.profileLabel}>Téléphone</p>
                      <p className={styles.profileValue}>{profile.phone || 'Non renseigné'}</p>
                    </div>
                    <div>
                      <p className={styles.profileLabel}>Pays de résidence</p>
                      <p className={styles.profileValue}>{profile.country}</p>
                    </div>
                  </div>
                  <div>
                    <p className={styles.profileLabel}>À propos de moi</p>
                    <p className={styles.profileValue} style={{ color: '#4B5563', fontSize: '1rem', lineHeight: 1.6 }}>{profile.bio || 'Aucune biographie renseignée pour le moment.'}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: BOOKINGS */}
          {activeTab === 'bookings' && (
            <div>
              <h2 className={styles.tabTitle}>Mes Réservations</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
                <div className={styles.statsCard}>
                  <div className={styles.statsNumber}>{bookings.length}</div>
                  <div className={styles.statsLabel}>Total</div>
                </div>
                <div className={styles.statsCard} style={{ backgroundColor: '#ECFDF5' }}>
                  <div className={styles.statsNumber} style={{ color: '#059669' }}>{bookings.filter(b => b.status === 'CONFIRMEE').length}</div>
                  <div className={styles.statsLabel} style={{ color: '#059669' }}>Confirmées</div>
                </div>
                <div className={styles.statsCard} style={{ backgroundColor: '#EFF6FF' }}>
                  <div className={styles.statsNumber} style={{ color: '#2563EB' }}>{bookings.filter(b => b.status === 'TERMINEE').length}</div>
                  <div className={styles.statsLabel} style={{ color: '#2563EB' }}>Terminées</div>
                </div>
              </div>

              {bookings.length === 0 ? (
                <div className={styles.emptyState}>
                  <Calendar size={48} color="#D1D5DB" style={{ marginBottom: '16px' }} />
                  <p style={{ color: '#6B7280', fontSize: '1.1rem' }}>Vous n'avez aucune réservation pour le moment.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {bookings.map(booking => (
                    <div key={booking.id} className={styles.bookingCard}>
                      <img src={booking.image} alt={booking.propertyName} className={styles.bookingImage} />
                      <div className={styles.bookingDetails}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <h3 className={styles.bookingName}>{booking.propertyName}</h3>
                            <span style={{ padding: '6px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: getStatusColor(booking.status), color: 'white' }}>
                              {getStatusText(booking.status)}
                            </span>
                          </div>
                          <div className={styles.bookingMeta}>
                            <span className={styles.metaRow}><MapPin size={16}/> {booking.location}</span>
                            <span className={styles.metaRow}><Calendar size={16}/> {booking.checkIn} - {booking.checkOut}</span>
                          </div>
                          <div className={styles.bookingPrice}>{booking.price} MAD</div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                          {booking.status === 'CONFIRMEE' && !booking.paiement && (
                            <button 
                              onClick={() => { setSelectedBooking(booking); setPaymentModalOpen(true); }}
                              className={styles.payButton}
                            >
                              Payer maintenant
                            </button>
                          )}
                          {booking.paiement && (
                            <div className={styles.paidBadge}>
                              <Activity size={16} /> Paiement : {getStatusText(booking.paiement.statut)}
                            </div>
                          )}
                          <button 
                            onClick={() => {
                              if (booking.hoteId) {
                                setSelectedHostForContact({
                                  hostId: booking.hoteId,
                                  hostName: booking.hoteName || 'l\'hôte',
                                  colivingId: booking.colivingId,
                                });
                                setContactModalOpen(true);
                              } else {
                                setActiveTab('messages');
                              }
                            }}
                            className={styles.messageIconButton}
                            title="Contacter l'hôte"
                          >
                            <MessageCircle size={20}/>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: MESSAGES */}
          {activeTab === 'messages' && (
            <div>
              <div style={{ marginBottom: '32px' }}>
                <h2 className={styles.tabTitle}>Mes Messages</h2>
                <p style={{ color: '#6B7280', margin: 0 }}>Échangez avec les propriétaires de vos colivings.</p>
              </div>
              <HostMessages />
            </div>
          )}

          {/* TAB: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div>
              <div style={{ marginBottom: '32px' }}>
                <h2 className={styles.tabTitle}>Mes Documents & Identité</h2>
                <p style={{ color: '#6B7280', margin: 0 }}>Gérez vos documents d'identité pour faciliter vos futures réservations.</p>
              </div>

              <div className={styles.dashedContainer}>
                <ClientDocumentRequests />
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Payment Modal */}
      {paymentModalOpen && selectedBooking && (
        <div 
          onClick={() => setPaymentModalOpen(false)}
          className={styles.modalOverlay}>
          <div 
            onClick={(e) => e.stopPropagation()}
            className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Paiement</h3>
              <button onClick={() => setPaymentModalOpen(false)} className={styles.modalCloseButton}><X size={24} /></button>
            </div>
            
            <div className={styles.modalAmountBox}>
              <p style={{ margin: '0 0 4px 0', color: '#6B7280', fontSize: '0.9rem' }}>Montant à régler</p>
              <div className={styles.modalAmountValue}>{selectedBooking.price} MAD</div>
              <p style={{ margin: '4px 0 0 0', color: '#4B5563', fontSize: '0.9rem' }}>Pour <strong>{selectedBooking.propertyName}</strong></p>
            </div>
            
            <h4 className={styles.methodTitle}>Choisissez votre méthode :</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              <label className={styles.methodLabel} style={{
                border: paymentMethod === 'PAYPAL' ? '2px solid #003087' : '1px solid #E5E7EB',
                backgroundColor: paymentMethod === 'PAYPAL' ? '#F0F8FF' : 'white'
              }}>
                <input type="radio" name="payment" value="PAYPAL" checked={paymentMethod === 'PAYPAL'} onChange={() => setPaymentMethod('PAYPAL')} className={styles.radioInput} />
                <div>
                  <div style={{ fontWeight: 700, color: '#003087', fontSize: '1.1rem' }}>PayPal Sandbox</div>
                  <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>Paiement de test via PayPal.</div>
                </div>
              </label>

              <label className={styles.methodLabel} style={{
                border: paymentMethod === 'CARTE_BANCAIRE' ? '2px solid #DD7246' : '1px solid #E5E7EB',
                backgroundColor: paymentMethod === 'CARTE_BANCAIRE' ? '#FFF5F1' : 'white'
              }}>
                <input type="radio" name="payment" value="CARTE_BANCAIRE" checked={paymentMethod === 'CARTE_BANCAIRE'} onChange={() => setPaymentMethod('CARTE_BANCAIRE')} className={styles.radioInput} />
                <div>
                  <div style={{ fontWeight: 700, color: '#1A1A2E', fontSize: '1.1rem' }}>Paiement par carte</div>
                  <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>Visa, Mastercard, etc.</div>
                </div>
              </label>

              <label className={styles.methodLabel} style={{
                border: paymentMethod === 'ESPECE' ? '2px solid #DD7246' : '1px solid #E5E7EB',
                backgroundColor: paymentMethod === 'ESPECE' ? '#FFF5F1' : 'white'
              }}>
                <input type="radio" name="payment" value="ESPECE" checked={paymentMethod === 'ESPECE'} onChange={() => setPaymentMethod('ESPECE')} className={styles.radioInput} />
                <div>
                  <div style={{ fontWeight: 700, color: '#1A1A2E', fontSize: '1.1rem' }}>Paiement en Espèces</div>
                  <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>À régler sur place.</div>
                </div>
              </label>
            </div>

            {paymentMethod === 'PAYPAL' ? (
              <PayPalScriptProvider options={{ clientId: "test", currency: "EUR" }}>
                <PayPalButtons
                  style={{ layout: "vertical", shape: 'rect' }}
                  createOrder={(_data, actions) => {
                    const valInEur = (selectedBooking.price / 10).toFixed(2);
                    return actions.order.create({
                      intent: "CAPTURE",
                      purchase_units: [{ amount: { currency_code: "EUR", value: valInEur } }],
                    });
                  }}
                  onApprove={(_data, actions) => {
                    return actions.order!.capture().then(() => {
                      handlePaymentSubmit('PAYPAL');
                    });
                  }}
                  onError={() => {
                    setError('Une erreur est survenue avec PayPal.');
                  }}
                />
              </PayPalScriptProvider>
            ) : (
              <button 
                onClick={() => handlePaymentSubmit(paymentMethod)}
                disabled={processingPayment}
                className={styles.confirmPayButton}
                style={{
                  opacity: processingPayment ? 0.7 : 1,
                  cursor: processingPayment ? 'wait' : 'pointer'
                }}
              >
                {processingPayment ? 'Traitement...' : 'Confirmer le paiement'}
              </button>
            )}
          </div>
        </div>
      )}

      {selectedHostForContact && (
        <ContactHostModal
          isOpen={contactModalOpen}
          onClose={() => {
            setContactModalOpen(false);
            setSelectedHostForContact(null);
          }}
          hostId={selectedHostForContact.hostId}
          hostName={selectedHostForContact.hostName}
          colivingId={selectedHostForContact.colivingId}
        />
      )}
    </div>
  );
}
