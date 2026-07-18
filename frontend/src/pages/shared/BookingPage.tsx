import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { MapPin, Users, DollarSign, Heart, Share2, Check, MessageCircle } from 'lucide-react';
import { colivingAPI, type ColivingData } from '../../services/colivingAPI';
import { getAuthToken, getImageUrl } from '../../config/api';
import { toast } from 'sonner';
import * as Dialog from '@radix-ui/react-dialog';

export default function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const fromDate = searchParams.get('from');
  const toDate = searchParams.get('to');

  const [property, setProperty] = useState<ColivingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [checkIn, setCheckIn] = useState(fromDate || '2026-05-15');
  const [checkOut, setCheckOut] = useState(toDate || '2026-06-15');
  const [guests, setGuests] = useState(1);

  const [availableChambres, setAvailableChambres] = useState<
    { id: number; nom: string; capacitePersonnes: number; prixParMois: string | number }[]
  >([]);
  const [selectedChambreId, setSelectedChambreId] = useState<number | null>(null);
  const [reserving, setReserving] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const data = await colivingAPI.getColivingById(parseInt(id || '1'));
        setProperty(data);
        if (!data) {
          setError('Coliving non trouvé');
        }
      } catch (err) {
        console.error('Erreur lors du chargement du coliving:', err);
        setError('Impossible de charger les détails du coliving');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  useEffect(() => {
    if (!property?.id) return;
    let cancelled = false;
    (async () => {
      const list = await colivingAPI.getAvailableChambres(property.id, checkIn, checkOut);
      if (cancelled) return;
      setAvailableChambres(Array.isArray(list) ? list : []);
      setSelectedChambreId(Array.isArray(list) && list.length ? list[0].id : null);
    })();
    return () => {
      cancelled = true;
    };
  }, [property?.id, checkIn, checkOut, property]);


  const calculateNights = () => {
    if (!property) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  };

  const selectedChambre = property?.chambres.find((c) => c.id === selectedChambreId);
  const prixMois = selectedChambre ? Number(selectedChambre.prixParMois) : property?.prixParMois ?? 0;

  const calculateTotal = () => {
    const nights = calculateNights();
    return (prixMois * nights) / 30;
  };

  const handleReserve = async () => {
    if (!getAuthToken()) {
      navigate('/auth');
      return;
    }
    if (!selectedChambreId) {
      toast.error('Aucune chambre disponible sur ces dates.');
      return;
    }
    setReserving(true);
    try {
      const res = await colivingAPI.createReservation(
        selectedChambreId,
        checkIn,
        checkOut,
        guests
      );
      if (!res) {
        toast.error('Impossible de créer la réservation (vérifiez que vous êtes connecté en tant que client).');
        return;
      }
      toast.success('Demande envoyée. Statut : en attente de confirmation par l’hôte.');
    } catch {
      toast.error('Erreur réseau.');
    } finally {
      setReserving(false);
    }
  };

  const nights = calculateNights();
  const total = calculateTotal();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Chargement des détails du coliving...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#F44336' }}>{error || 'Coliving non trouvé'}</p>
      </div>
    );
  }

  const mainImage = property.images?.[0]?.url ? getImageUrl(property.images[0].url) : 'https://via.placeholder.com/800x400';

  return (
    <div style={styles.container}>
      <div style={styles.breadcrumb}>
        <a href="/" style={styles.link}>Accueil</a>
        <span style={styles.separator}>/</span>
        <a href="/properties" style={styles.link}>Propriétés</a>
        <span style={styles.separator}>/</span>
        <span>{property.titre}</span>
      </div>

      <div style={styles.content}>
        {/* Left: Property Details */}
        <div style={styles.mainContent}>
          {/* Image Gallery */}
          <div style={styles.imageGallery}>
            <img src={mainImage} alt={property.titre} style={styles.mainImage} />
            <button style={styles.favoriteButton}>
              <Heart size={20} style={{ marginRight: 8 }} />
              Ajouter aux favoris
            </button>
          </div>

          {/* Property Info */}
          <div style={styles.propertyInfo}>
            <div style={styles.propertyHeader}>
              <div>
                <h1 style={styles.propertyName}>{property.titre}</h1>
                <div style={styles.ratingRow}>
                  <span style={styles.stars}>★ {property.note}</span>
                  <span style={styles.reviews}>({property.reviews} avis)</span>
                  <span style={styles.location}>
                    <MapPin size={16} style={{ marginRight: 4 }} />
                    {property.adresse}
                  </span>
                </div>
              </div>
              <button style={styles.shareButton}>
                <Share2 size={20} />
              </button>
            </div>

            <p style={styles.description}>{property.description}</p>

            {/* Details Grid */}
            <div style={styles.detailsGrid}>
              <div style={styles.detailItem}>
                <Users size={20} style={{ color: '#DD7246' }} />
                <div>
                  <p style={styles.detailLabel}>Capacité</p>
                  <p style={styles.detailValue}>{property.capacite} personnes</p>
                </div>
              </div>
              <div style={styles.detailItem}>
                <MapPin size={20} style={{ color: '#DD7246' }} />
                <div>
                  <p style={styles.detailLabel}>Chambres</p>
                  <p style={styles.detailValue}>{property.chambres.length} chambre(s)</p>
                </div>
              </div>
              <div style={styles.detailItem}>
                <DollarSign size={20} style={{ color: '#DD7246' }} />
                <div>
                  <p style={styles.detailLabel}>Prix Mensuel</p>
                  <p style={styles.detailValue}>{prixMois} MAD/mois (chambre choisie)</p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div style={styles.amenitiesSection}>
              <h3 style={styles.sectionTitle}>Équipements</h3>
              <div style={styles.amenitiesList}>
                {property.equipements && property.equipements.map((amenity, idx) => (
                  <div key={idx} style={styles.amenityItem}>
                    <Check size={18} style={{ color: '#DD7246', marginRight: 8 }} />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* About Host */}
            <div style={styles.hostSection}>
              <h3 style={styles.sectionTitle}>À propos de l'hôte</h3>
              <div style={styles.hostCard}>
                <img src={property.hote.photoProfil || 'https://ui-avatars.com/api/?background=DD7246&color=fff&bold=true&name=host'} alt={property.hote.nom} style={styles.hostAvatar} />
                <div style={styles.hostInfo}>
                  <h4 style={styles.hostName}>{property.hote.nom}</h4>
                  <p style={styles.hostRole}>Hôte</p>
                  <p style={styles.hostBio}>{property.hote.email}</p>
                </div>
                <button style={styles.contactButton}>
                  <MessageCircle size={18} />
                  Contacter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Booking Summary */}
        <div style={styles.sidebar}>
          <div style={styles.bookingSummary}>
            <div style={styles.priceRow}>
              <span style={styles.priceLabel}>{prixMois} MAD par mois (chambre sélectionnée)</span>
            </div>

            {/* Date Selection */}
            <div style={styles.bookingSection}>
              <h3 style={styles.bookingTitle}>Dates</h3>
              <div style={styles.dateInputs}>
                <div style={styles.dateGroup}>
                  <label style={styles.dateLabel}>Arrivée</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    style={styles.dateInput}
                  />
                </div>
                <div style={styles.dateGroup}>
                  <label style={styles.dateLabel}>Départ</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    style={styles.dateInput}
                  />
                </div>
              </div>
              <p style={styles.nightsInfo}>{nights} nuits sélectionnées</p>
            </div>

            <div style={styles.bookingSection}>
              <h3 style={styles.bookingTitle}>Chambre</h3>
              {availableChambres.length === 0 ? (
                <p style={{ fontSize: 13, color: '#c62828' }}>Aucune chambre libre sur cette période.</p>
              ) : (
                <select
                  value={selectedChambreId ?? ''}
                  onChange={(e) => setSelectedChambreId(parseInt(e.target.value, 10))}
                  style={styles.dateInput}
                >
                  {availableChambres.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nom} — {Number(c.prixParMois)} MAD/mois (max {c.capacitePersonnes} pers.)
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Guest Selection */}
            <div style={styles.bookingSection}>
              <h3 style={styles.bookingTitle}>Invités</h3>
              <div style={styles.guestSelector}>
                <button
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  style={styles.guestButton}
                >
                  −
                </button>
                <span style={styles.guestCount}>{guests}</span>
                <button
                  onClick={() =>
                    setGuests(
                      Math.min(
                        selectedChambre ? selectedChambre.capacitePersonnes : property.capacite,
                        guests + 1
                      )
                    )
                  }
                  style={styles.guestButton}
                >
                  +
                </button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div style={styles.priceBreakdown}>
              <div style={styles.breakdownRow}>
                <span>Estimation ({prixMois} MAD/mois × {nights} nuits / 30)</span>
                <span>{Math.round(total)} MAD</span>
              </div>
              <div style={styles.breakdownRow}>
                <span>Frais de service</span>
                <span>{Math.round(total * 0.08)} MAD</span>
              </div>
              <div style={styles.breakdownRow}>
                <span>Taxe de séjour</span>
                <span>{Math.round(total * 0.05)} MAD</span>
              </div>
              <div style={styles.breakdownTotal}>
                <strong>Total</strong>
                <strong style={{ fontSize: 18, color: '#DD7246' }}>
                  {Math.round(total + total * 0.13)} MAD
                </strong>
              </div>
            </div>

            {/* Booking Buttons */}
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  style={{ ...styles.bookButton, opacity: reserving || !selectedChambreId ? 0.7 : 1 }}
                  disabled={reserving || !selectedChambreId}
                >
                  <Check size={18} style={{ marginRight: 8 }} />
                  {reserving ? 'Envoi…' : 'Demander la réservation'}
                </button>
              </Dialog.Trigger>

              <Dialog.Portal>
                <Dialog.Overlay style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', position: 'fixed', inset: 0, zIndex: 50, backdropFilter: 'blur(4px)' }} />
                <Dialog.Content style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90vw', maxWidth: '400px', zIndex: 51, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                  <Dialog.Title style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1A1A2E', margin: 0 }}>
                    Confirmer la réservation
                  </Dialog.Title>
                  <Dialog.Description style={{ marginTop: '12px', fontSize: '0.9rem', color: '#6B7280', lineHeight: 1.5 }}>
                    Vous êtes sur le point de demander une réservation pour <strong>{property.titre}</strong>.
                    <br/><br/>
                    <div style={{ background: '#FAF9F7', padding: '12px', borderRadius: '8px' }}>
                      <p style={{ margin: '0 0 8px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Arrivée :</span> <strong>{new Date(checkIn).toLocaleDateString('fr-FR')}</strong>
                      </p>
                      <p style={{ margin: '0 0 8px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Départ :</span> <strong>{new Date(checkOut).toLocaleDateString('fr-FR')}</strong>
                      </p>
                      <p style={{ margin: '0 0 0', display: 'flex', justifyContent: 'space-between', color: '#DD7246' }}>
                        <span>Total estimé :</span> <strong>{Math.round(total + total * 0.13)} MAD</strong>
                      </p>
                    </div>
                  </Dialog.Description>
                  <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <Dialog.Close asChild>
                      <button style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #E0E0E0', background: 'white', color: '#6B7280', fontWeight: 600, cursor: 'pointer' }}>
                        Annuler
                      </button>
                    </Dialog.Close>
                    <Dialog.Close asChild>
                      <button onClick={handleReserve} style={{ padding: '10px 16px', borderRadius: '8px', background: '#DD7246', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
                        Confirmer l'envoi
                      </button>
                    </Dialog.Close>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>

            <button style={styles.contactHostButton}>
              <MessageCircle size={18} style={{ marginRight: 8 }} />
              Contacter l'Hôte
            </button>

            {/* Protection Notice */}
            <div style={styles.protectionBox}>
              <p style={styles.protectionTitle}>Protection Darlink</p>
              <p style={styles.protectionText}>
                ✓ Paiement sécurisé<br/>
                ✓ Annulation gratuite jusqu'à 7 jours avant<br/>
                ✓ Support 24/7 en français
              </p>
            </div>

            {/* Important Info */}
            <div style={styles.importantBox}>
              <p style={styles.importantTitle}>Points Importants</p>
              <ul style={styles.importantList}>
                <li>Minimum 30 jours de séjour</li>
                <li>Accès commun à la cuisine</li>
                <li>Événements communautaires hebdomadaires</li>
                <li>Contrat standardisé Darlink</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 1400,
    margin: '0 auto',
    padding: '20px'
  } as React.CSSProperties,
  breadcrumb: {
    fontSize: 13,
    color: '#999',
    marginBottom: 20,
    display: 'flex',
    gap: 8,
    alignItems: 'center'
  } as React.CSSProperties,
  link: {
    color: '#DD7246',
    textDecoration: 'none',
    cursor: 'pointer'
  } as React.CSSProperties,
  separator: {
    color: '#E0E0E0'
  } as React.CSSProperties,
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: 30
  } as React.CSSProperties,
  mainContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 30
  } as React.CSSProperties,
  imageGallery: {
    position: 'relative' as const,
    borderRadius: 12,
    overflow: 'hidden',
    height: 400
  } as React.CSSProperties,
  mainImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const
  } as React.CSSProperties,
  favoriteButton: {
    position: 'absolute' as const,
    top: 16,
    right: 16,
    padding: '10px 14px',
    background: 'white',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    fontSize: 13,
    fontWeight: 600,
    color: '#DD7246',
    transition: 'all 0.3s ease'
  } as React.CSSProperties,
  propertyInfo: {
    background: 'white',
    borderRadius: 12,
    padding: 30,
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
  } as React.CSSProperties,
  propertyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  } as React.CSSProperties,
  propertyName: {
    fontSize: 28,
    fontWeight: 700,
    color: '#2C2C2C',
    margin: 0
  } as React.CSSProperties,
  ratingRow: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    marginTop: 8,
    flexWrap: 'wrap' as const
  } as React.CSSProperties,
  stars: {
    color: '#FFB800',
    fontWeight: 600
  } as React.CSSProperties,
  reviews: {
    color: '#999',
    fontSize: 13
  } as React.CSSProperties,
  location: {
    display: 'flex',
    alignItems: 'center',
    color: '#666',
    fontSize: 13
  } as React.CSSProperties,
  shareButton: {
    background: '#FFF4E0',
    border: 'none',
    borderRadius: 8,
    padding: 10,
    cursor: 'pointer',
    color: '#DD7246',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.3s ease'
  } as React.CSSProperties,
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 1.6,
    marginBottom: 24
  } as React.CSSProperties,
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
    padding: 20,
    background: '#FAFAFA',
    borderRadius: 12,
    marginBottom: 24
  } as React.CSSProperties,
  detailItem: {
    display: 'flex',
    gap: 12
  } as React.CSSProperties,
  detailLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: 600,
    margin: 0,
    textTransform: 'uppercase'
  } as React.CSSProperties,
  detailValue: {
    fontSize: 14,
    color: '#2C2C2C',
    fontWeight: 600,
    margin: '4px 0 0 0'
  } as React.CSSProperties,
  amenitiesSection: {
    marginBottom: 24
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#2C2C2C',
    marginBottom: 16,
    margin: 0
  } as React.CSSProperties,
  amenitiesList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 12
  } as React.CSSProperties,
  amenityItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
    color: '#666'
  } as React.CSSProperties,
  hostSection: {
    paddingTop: 24,
    borderTop: '1px solid #E0E0E0'
  } as React.CSSProperties,
  hostCard: {
    display: 'flex',
    gap: 16,
    alignItems: 'flex-start',
    padding: 16,
    background: '#FAFAFA',
    borderRadius: 12
  } as React.CSSProperties,
  hostAvatar: {
    width: 60,
    height: 60,
    borderRadius: '50%',
    objectFit: 'cover'
  } as React.CSSProperties,
  hostInfo: {
    flex: 1
  } as React.CSSProperties,
  hostName: {
    fontSize: 14,
    fontWeight: 700,
    color: '#2C2C2C',
    margin: 0
  } as React.CSSProperties,
  hostRole: {
    fontSize: 12,
    color: '#999',
    margin: '2px 0'
  } as React.CSSProperties,
  hostBio: {
    fontSize: 13,
    color: '#666',
    margin: '4px 0 0 0'
  } as React.CSSProperties,
  contactButton: {
    padding: '8px 12px',
    background: '#DD7246',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    transition: 'all 0.3s ease'
  } as React.CSSProperties,
  sidebar: {
    position: 'sticky' as const,
    top: 20,
    height: 'fit-content'
  } as React.CSSProperties,
  bookingSummary: {
    background: 'white',
    borderRadius: 12,
    padding: 20,
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  } as React.CSSProperties,
  priceRow: {
    textAlign: 'center' as const,
    paddingBottom: 16,
    borderBottom: '1px solid #E0E0E0'
  } as React.CSSProperties,
  priceLabel: {
    fontSize: 16,
    fontWeight: 700,
    color: '#2C2C2C'
  } as React.CSSProperties,
  bookingSection: {
    paddingBottom: 16,
    borderBottom: '1px solid #E0E0E0',
    marginBottom: 16
  } as React.CSSProperties,
  bookingTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#2C2C2C',
    margin: 0,
    marginBottom: 12
  } as React.CSSProperties,
  dateInputs: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 8
  } as React.CSSProperties,
  dateGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 4
  } as React.CSSProperties,
  dateLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: '#666'
  } as React.CSSProperties,
  dateInput: {
    padding: '8px 10px',
    border: '1px solid #E0E0E0',
    borderRadius: 6,
    fontSize: 13,
    fontFamily: 'inherit'
  } as React.CSSProperties,
  nightsInfo: {
    fontSize: 12,
    color: '#999',
    margin: '8px 0 0 0'
  } as React.CSSProperties,
  guestSelector: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: '8px 12px',
    border: '1px solid #E0E0E0',
    borderRadius: 6
  } as React.CSSProperties,
  guestButton: {
    background: '#FFF4E0',
    border: 'none',
    width: 32,
    height: 32,
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 600,
    color: '#DD7246'
  } as React.CSSProperties,
  guestCount: {
    fontSize: 14,
    fontWeight: 600,
    color: '#2C2C2C'
  } as React.CSSProperties,
  priceBreakdown: {
    background: '#FAFAFA',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16
  } as React.CSSProperties,
  breakdownRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 13,
    color: '#666',
    marginBottom: 8
  } as React.CSSProperties,
  breakdownTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTop: '1px solid #E0E0E0',
    marginTop: 12,
    fontSize: 14,
    fontWeight: 600,
    color: '#2C2C2C'
  } as React.CSSProperties,
  bookButton: {
    width: '100%',
    padding: '12px 16px',
    background: '#DD7246',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    transition: 'all 0.3s ease'
  } as React.CSSProperties,
  contactHostButton: {
    width: '100%',
    padding: '12px 16px',
    background: 'white',
    color: '#DD7246',
    border: '1px solid #E0E0E0',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  } as React.CSSProperties,
  protectionBox: {
    background: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeft: '3px solid #4CAF50'
  } as React.CSSProperties,
  protectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: '#2E7D32',
    margin: 0
  } as React.CSSProperties,
  protectionText: {
    fontSize: 12,
    color: '#388E3C',
    margin: '6px 0 0 0',
    lineHeight: 1.5
  } as React.CSSProperties,
  importantBox: {
    background: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    borderLeft: '3px solid #FF9800'
  } as React.CSSProperties,
  importantTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: '#E65100',
    margin: 0
  } as React.CSSProperties,
  importantList: {
    fontSize: 12,
    color: '#BF360C',
    margin: '6px 0 0 0',
    paddingLeft: 16,
    lineHeight: 1.5
  } as React.CSSProperties
};
