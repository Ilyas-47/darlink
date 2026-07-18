import React, { useEffect, useState } from 'react';
import { Home, Wifi, Coffee, Dumbbell, Wind, Check, X } from 'lucide-react';
import { darlinkApi } from '../../services/darlinkApi';
import { colivingAPI } from '../../services/colivingAPI';
import AIImageGenerator from '../shared/AIImageGenerator';
import MapPicker from '../shared/MapPicker';

interface AddListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  colivingId?: number | null;
}

interface PropertyData {
  name: string;
  description: string;
  location: string;
  price: number;
  rooms: number;
  capacity: number;
  images: string[];
  latitude?: number;
  longitude?: number;
}

type Step = 'property' | 'amenities' | 'review' | 'success';

const iconForName = (nom: string) => {
  const n = nom.toLowerCase();
  if (n.includes('wifi')) return Wifi;
  if (n.includes('cuisine') || n.includes('café')) return Coffee;
  if (n.includes('sport')) return Dumbbell;
  if (n.includes('climat')) return Wind;
  return Home;
};

export default function AddListingModal({ isOpen, onClose, onSuccess, colivingId }: AddListingModalProps) {
  const [step, setStep] = useState<Step>('property');
  const [equipements, setEquipements] = useState<{ id: number; nom: string; icone: string | null }[]>([]);
  const [selectedEquipementIds, setSelectedEquipementIds] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const [property, setProperty] = useState<PropertyData>({
    name: '',
    description: '',
    location: '',
    price: 2500,
    rooms: 1,
    capacity: 2,
    images: [],
    latitude: undefined,
    longitude: undefined,
  });

  // Load equipements list + existing coliving data if in edit mode
  useEffect(() => {
    if (isOpen) {
      // 1. Get equipements
      darlinkApi.listEquipements()
        .then(setEquipements)
        .catch(() => setApiError('Impossible de charger les équipements.'));

      // 2. Fetch existing coliving if edit mode
      if (colivingId) {
        setSubmitting(true);
        colivingAPI.getColivingById(colivingId)
          .then((data: any) => {
            if (data) {
              const chambres = data.chambres || [];
              const priceVal = chambres.length > 0 ? Number(chambres[0].prixParMois) : Number(data.prixParMois || 2500);
              const roomsVal = chambres.length > 0 ? Number(chambres[0].litsDisponibles) : 1;
              const capVal = chambres.length > 0 ? Number(chambres[0].capacitePersonnes) : Number(data.capacite || 2);

              setProperty({
                name: data.titre || '',
                description: data.description || '',
                location: data.adresse || '',
                price: priceVal,
                rooms: roomsVal,
                capacity: capVal,
                images: data.images?.map((img: any) => img.url) || [data.image].filter(Boolean),
              });

              // Pre-select equipement links
              if (data.equipementLinks) {
                setSelectedEquipementIds(data.equipementLinks.map((link: any) => link.equipementId));
              } else if (data.equipements) {
                // Fallback direct name match or similar
                darlinkApi.listEquipements().then(list => {
                  const matched = list.filter(eq => data.equipements.includes(eq.nom)).map(eq => eq.id);
                  setSelectedEquipementIds(matched);
                });
              }
            }
          })
          .catch(() => setApiError('Erreur lors de la récupération des détails du coliving.'))
          .finally(() => setSubmitting(false));
      }
    }
  }, [isOpen, colivingId]);

  if (!isOpen) return null;

  const steps: Step[] = ['property', 'amenities', 'review'];
  const stepIndex = steps.indexOf(step === 'success' ? 'review' : step);

  const handleNextStep = async () => {
    setApiError('');
    if (step === 'property') {
      if (!property.name.trim() || !property.location.trim() || !property.description.trim()) {
        setApiError('Remplissez au minimum le nom, la localisation et la description.');
        return;
      }
      if (property.images.length < 3) {
        setApiError(`Veuillez ajouter au moins 3 photos (actuellement : ${property.images.length}/3).`);
        return;
      }
      setStep('amenities');
    } else if (step === 'amenities') {
      setStep('review');
    } else if (step === 'review') {
      setSubmitting(true);
      try {
        const payload = {
          titre: property.name.trim(),
          description: property.description.trim(),
          adresse: property.location.trim(),
          equipementIds: selectedEquipementIds,
          imageUrls: property.images,
          chambres: [
            {
              nom: 'Chambre principale',
              description: `${property.rooms} chambre(s) — capacité ${property.capacity} pers.`,
              capacitePersonnes: Math.max(1, property.capacity),
              litsDisponibles: Math.max(1, property.rooms),
              prixParMois: Math.max(1, property.price),
              typeChambre: 'PRIVEE' as const,
            },
          ],
          latitude: property.latitude,
          longitude: property.longitude,
        };

        if (colivingId) {
          await darlinkApi.updateColiving(colivingId, payload);
        } else {
          await darlinkApi.createColiving(payload);
        }
        setStep('success');
      } catch (e) {
        setApiError(e instanceof Error ? e.message : 'Erreur à la soumission');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handlePrevStep = () => {
    setApiError('');
    if (step === 'amenities') setStep('property');
    else if (step === 'review') setStep('amenities');
  };

  const toggleEquipement = (id: number) => {
    setSelectedEquipementIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleClose = () => {
    setStep('property');
    setProperty({
      name: '',
      description: '',
      location: '',
      price: 2500,
      rooms: 1,
      capacity: 2,
      images: [],
    });
    setSelectedEquipementIds([]);
    setApiError('');
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>{colivingId ? 'Modifier le coliving' : 'Publier un coliving'}</h2>
          <button onClick={handleClose} style={styles.closeBtn} aria-label="Fermer">
            <X size={20} />
          </button>
        </div>

        {/* Stepper */}
        {step !== 'success' && (
          <div style={styles.progressContainer}>
            {steps.map((s, idx) => (
              <div key={s} style={styles.progressStep}>
                <div
                  style={{
                    ...styles.stepCircle,
                    background: stepIndex >= idx ? '#DD7246' : '#E0E0E0',
                    color: stepIndex >= idx ? 'white' : '#999',
                  }}
                >
                  {idx + 1}
                </div>
                <p style={styles.stepLabel}>
                  {['Propriété', 'Équipements', 'Révision'][idx]}
                </p>
                {idx < 2 && <div style={styles.stepLine} />}
              </div>
            ))}
          </div>
        )}

        {/* Content body */}
        <div style={styles.body}>
          {apiError && (
            <p style={{ color: '#c62828', marginBottom: 16, fontSize: '0.85rem' }}>⚠️ {apiError}</p>
          )}

          {step === 'property' && (
            <div style={styles.form}>
              <div style={styles.formGrid}>
                <div style={styles.fullWidth}>
                  <label style={styles.label}>Nom du riad / espace</label>
                  <input
                    type="text"
                    value={property.name}
                    onChange={(e) => setProperty({ ...property, name: e.target.value })}
                    placeholder="ex: Villa Surf & Yoga"
                    style={styles.input}
                  />
                </div>
                <div style={styles.fullWidth}>
                  <label style={styles.label}>Description</label>
                  <textarea
                    value={property.description}
                    onChange={(e) => setProperty({ ...property, description: e.target.value })}
                    placeholder="Ambiance, règles de vie, profil de la communauté..."
                    style={{ ...styles.input, minHeight: 80, resize: 'none' }}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Localisation (Ville, Quartier) <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="text"
                    value={property.location}
                    onChange={(e) => setProperty({ ...property, location: e.target.value })}
                    placeholder="ex: Taghazout, Agadir"
                    style={styles.input}
                  />
                </div>

                <div style={styles.fullWidth}>
                  <label style={styles.label}>Emplacement exact sur la carte <span style={{ color: 'red' }}>*</span></label>
                  <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '12px' }}>
                    Cliquez sur la carte pour placer le repère à l'emplacement exact de votre coliving.
                  </p>
                  <MapPicker 
                    position={property.latitude && property.longitude ? [property.latitude, property.longitude] : null}
                    onChange={(pos) => setProperty({ ...property, latitude: pos[0], longitude: pos[1] })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Prix mensuel (MAD)</label>
                    <input
                      type="number"
                      value={property.price}
                      onChange={(e) => setProperty({ ...property, price: parseInt(e.target.value, 10) || 0 })}
                      style={styles.input}
                    />
                  </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Chambres dispo</label>
                  <input
                    type="number"
                    value={property.rooms}
                    onChange={(e) => setProperty({ ...property, rooms: parseInt(e.target.value, 10) || 1 })}
                    min={1}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Capacité (pers.)</label>
                  <input
                    type="number"
                    value={property.capacity}
                    onChange={(e) => setProperty({ ...property, capacity: parseInt(e.target.value, 10) || 1 })}
                    min={1}
                    style={styles.input}
                  />
                </div>
                </div>
                <div style={styles.fullWidth}>
                  <label style={styles.label}>Photos du coliving (3 minimum)</label>
                  
                  {/* Image Grid Preview */}
                  {property.images.length > 0 && (
                    <div style={{
                      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px'
                    }}>
                      {property.images.map((img, idx) => (
                        <div key={idx} style={{ position: 'relative', width: '100%', height: '90px' }}>
                          <img src={img} alt={`Preview ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                          <button
                            onClick={() => setProperty(prev => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== idx)
                            }))}
                            style={{
                              position: 'absolute', top: '4px', right: '4px',
                              background: '#EF4444', color: 'white', border: 'none',
                              borderRadius: '50%', width: '20px', height: '20px',
                              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload Box */}
                  <div style={{
                    display: 'flex', flexDirection: 'column', gap: '10px',
                    padding: '20px', border: '2px dashed #E5E7EB', borderRadius: '12px',
                    alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAF9F7',
                    position: 'relative'
                  }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setSubmitting(true);
                        setApiError('');
                        try {
                          const res = await darlinkApi.uploadImage(file);
                          setProperty(prev => ({ ...prev, images: [...prev.images, res.url] }));
                        } catch (err) {
                          setApiError('Erreur lors de l\'upload du fichier.');
                        } finally {
                          setSubmitting(false);
                        }
                      }}
                      style={{
                        position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%'
                      }}
                    />
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      backgroundColor: 'rgba(221,114,70,0.1)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', color: '#DD7246', marginBottom: '4px'
                    }}>
                      <Home size={18} />
                    </div>
                    <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#4B5563', margin: '0 0 2px' }}>
                      Ajouter une photo depuis mon PC ({property.images.length}/3 minimum)
                    </p>
                    <p style={{ fontSize: '0.68rem', color: '#9CA3AF', margin: 0 }}>
                      PNG, JPG ou JPEG jusqu'à 5 Mo
                    </p>
                  </div>

                  {/* AI Generator */}
                  <div style={{ marginTop: '12px' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                      Ou générer avec l'IA et ajouter à la galerie
                    </p>
                    <AIImageGenerator
                      onImageGenerated={(url) => setProperty((prev) => ({ ...prev, images: [...prev.images, url] }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'amenities' && (
            <div style={styles.form}>
              <p style={{ color: '#6B7280', fontSize: '0.85rem', marginBottom: '12px' }}>Sélectionnez les équipements de l'espace :</p>
              <div style={styles.amenitiesGrid}>
                {equipements.map((eq) => {
                  const Icon = iconForName(eq.nom);
                  const isSelected = selectedEquipementIds.includes(eq.id);
                  return (
                    <button
                      key={eq.id}
                      type="button"
                      onClick={() => toggleEquipement(eq.id)}
                      style={{
                        ...styles.amenityButton,
                        background: isSelected ? '#DD7246' : '#FAF9F7',
                        color: isSelected ? 'white' : '#2C2C2C',
                        borderColor: isSelected ? '#DD7246' : '#E5E7EB',
                      }}
                    >
                      <Icon size={18} />
                      <span style={{ fontSize: '0.78rem' }}>{eq.nom}</span>
                      {isSelected && <Check size={14} style={{ marginLeft: 'auto' }} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 'review' && (
            <div style={styles.review}>
              <div style={styles.reviewSection}>
                <h3 style={styles.reviewTitle}>Détails</h3>
                <p style={styles.reviewText}><strong>Nom :</strong> {property.name}</p>
                <p style={styles.reviewText}><strong>Adresse :</strong> {property.location}</p>
                <p style={styles.reviewText}><strong>Prix :</strong> {property.price} MAD/mois</p>
                <p style={styles.reviewText}><strong>Photos :</strong> {property.images.length} photos ajoutées</p>
                <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                  {property.images.slice(0, 5).map((img, i) => (
                    <img key={i} src={img} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #E5E7EB' }} />
                  ))}
                  {property.images.length > 5 && (
                    <div style={{ width: '40px', height: '40px', borderRadius: '6px', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#4B5563', border: '1px solid #E5E7EB' }}>
                      +{property.images.length - 5}
                    </div>
                  )}
                </div>
              </div>
              <div style={styles.reviewSection}>
                <h3 style={styles.reviewTitle}>Équipements</h3>
                <div style={styles.selectedAmenities}>
                  {equipements
                    .filter((e) => selectedEquipementIds.includes(e.id))
                    .map((e) => (
                      <span key={e.id} style={styles.amenityTag}>
                        {e.nom}
                      </span>
                    ))}
                  {selectedEquipementIds.length === 0 && (
                    <span style={{ color: '#999', fontSize: 13 }}>Aucun équipement sélectionné</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div style={styles.successContainer}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎉</div>
              <h3 style={styles.successTitle}>Soumission réussie !</h3>
              <p style={styles.successMessage}>
                Votre coliving a été enregistré et est en attente de validation par l'administrateur.
              </p>
              <button onClick={() => { onSuccess(); handleClose(); }} style={styles.btnPrimary}>
                Fermer
              </button>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {step !== 'success' && (
          <div style={styles.footer}>
            <button
              onClick={handlePrevStep}
              disabled={step === 'property'}
              style={{
                ...styles.btnSecondary,
                opacity: step === 'property' ? 0.5 : 1,
                cursor: step === 'property' ? 'not-allowed' : 'pointer',
              }}
            >
              Précédent
            </button>
            <button
              onClick={handleNextStep}
              disabled={submitting}
              style={styles.btnPrimary}
            >
              {step === 'review' ? (submitting ? 'Envoi...' : 'Soumettre') : 'Suivant'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 10000,
  } as React.CSSProperties,
  modal: {
    backgroundColor: 'white',
    borderRadius: '20px',
    width: '100%', maxWidth: '620px',
    display: 'flex', flexDirection: 'column',
    maxHeight: '90vh',
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    overflow: 'hidden',
  } as React.CSSProperties,
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '20px 24px', borderBottom: '1px solid #F0EDE8',
  } as React.CSSProperties,
  title: { fontSize: '1.25rem', fontWeight: 800, color: '#1A1A2E', margin: 0 },
  closeBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#9CA3AF', padding: '4px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background 0.2s',
  } as React.CSSProperties,
  progressContainer: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 40px', backgroundColor: '#FAF9F7', borderBottom: '1px solid #F0EDE8',
  } as React.CSSProperties,
  progressStep: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
    flex: 1, position: 'relative',
  } as React.CSSProperties,
  stepCircle: {
    width: '28px', height: '28px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: '0.8rem', zIndex: 1,
  } as React.CSSProperties,
  stepLabel: { fontSize: '0.68rem', fontWeight: 600, color: '#6B7280', margin: 0 },
  stepLine: {
    position: 'absolute', top: '14px', left: '50%', width: '100%', height: '2px',
    backgroundColor: '#E5E7EB', zIndex: 0,
  } as React.CSSProperties,
  body: {
    flex: 1, overflowY: 'auto', padding: '24px',
  } as React.CSSProperties,
  form: { display: 'flex', flexDirection: 'column', gap: '16px' } as React.CSSProperties,
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' } as React.CSSProperties,
  fullWidth: { gridColumn: '1 / -1' } as React.CSSProperties,
  formGroup: { display: 'flex', flexDirection: 'column', gap: '4px' } as React.CSSProperties,
  label: { fontSize: '0.78rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '2px' } as React.CSSProperties,
  input: {
    padding: '10px 12px', border: '1.5px solid #F0EDE8', borderRadius: '10px',
    fontSize: '0.85rem', outline: 'none', transition: 'border-color 0.2s',
  } as React.CSSProperties,
  amenitiesGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px',
  } as React.CSSProperties,
  amenityButton: {
    padding: '12px 10px', border: '1.5px solid', borderRadius: '10px',
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
    transition: 'all 0.2s ease', fontWeight: 600, textAlign: 'left',
  } as React.CSSProperties,
  review: { display: 'flex', flexDirection: 'column', gap: '16px' } as React.CSSProperties,
  reviewSection: { paddingBottom: '12px', borderBottom: '1px solid #F0EDE8' } as React.CSSProperties,
  reviewTitle: { fontSize: '0.9rem', fontWeight: 700, color: '#1A1A2E', margin: '0 0 8px 0' } as React.CSSProperties,
  reviewText: { fontSize: '0.84rem', color: '#6B7280', margin: '0 0 4px 0' } as React.CSSProperties,
  selectedAmenities: { display: 'flex', flexWrap: 'wrap', gap: '6px' } as React.CSSProperties,
  amenityTag: {
    background: 'rgba(221,114,70,0.08)', color: '#DD7246',
    padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600,
  } as React.CSSProperties,
  successContainer: { textAlign: 'center', padding: '20px 0' } as React.CSSProperties,
  successTitle: { fontSize: '1.3rem', fontWeight: 800, color: '#1A1A2E', margin: '0 0 8px 0' } as React.CSSProperties,
  successMessage: { fontSize: '0.9rem', color: '#6B7280', margin: '0 0 20px 0', lineHeight: 1.6 } as React.CSSProperties,
  footer: {
    display: 'flex', justifyContent: 'space-between', padding: '16px 24px', borderTop: '1px solid #F0EDE8',
  } as React.CSSProperties,
  btnPrimary: {
    backgroundColor: '#DD7246', color: 'white', border: 'none', borderRadius: '10px',
    padding: '11px 24px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
    transition: 'background 0.2s', boxShadow: '0 4px 12px rgba(221,114,70,0.2)',
  } as React.CSSProperties,
  btnSecondary: {
    backgroundColor: 'white', color: '#6B7280', border: '1.5px solid #E5E7EB',
    borderRadius: '10px', padding: '10px 20px', fontSize: '0.85rem', fontWeight: 600,
    cursor: 'pointer', transition: 'border-color 0.2s',
  } as React.CSSProperties,
};
