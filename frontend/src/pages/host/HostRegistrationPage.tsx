import React, { useEffect, useState } from 'react';
import { Home, Wifi, Coffee, Dumbbell, Wind, Check, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { darlinkApi } from '../../services/darlinkApi';
import { getStoredUser } from '../../config/api';
import AIImageGenerator from '../../components/shared/AIImageGenerator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { hostRegistrationSchema, type HostRegistrationFormData } from '../../schemas/host.schema';
import { toast } from 'sonner';



type Step = 'property' | 'amenities' | 'review' | 'success';

const iconForName = (nom: string) => {
  const n = nom.toLowerCase();
  if (n.includes('wifi')) return Wifi;
  if (n.includes('cuisine') || n.includes('café')) return Coffee;
  if (n.includes('sport')) return Dumbbell;
  if (n.includes('climat')) return Wind;
  return Home;
};

export default function HostRegistrationPage() {
  const user = getStoredUser();
  const [step, setStep] = useState<Step>('property');
  const [equipements, setEquipements] = useState<{ id: number; nom: string; icone: string | null }[]>([]);
  const [selectedEquipementIds, setSelectedEquipementIds] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const { register, trigger, watch, setValue, formState: { errors } } = useForm<HostRegistrationFormData>({
    resolver: zodResolver(hostRegistrationSchema),
    defaultValues: {
      name: '',
      description: '',
      location: '',
      price: 2500,
      rooms: 1,
      capacity: 2,
      image: '',
    }
  });
  
  const property = watch();

  useEffect(() => {
    darlinkApi
      .listEquipements()
      .then(setEquipements)
      .catch(() => setApiError('Impossible de charger les équipements.'));
  }, []);

  const steps: Step[] = ['property', 'amenities', 'review'];
  const stepIndex = steps.indexOf(step === 'success' ? 'review' : step);

  const handleNextStep = async () => {
    setApiError('');
    if (step === 'property') {
      const isValid = await trigger();
      if (!isValid) return;
      setStep('amenities');
    } else if (step === 'amenities') {
      setStep('review');
    } else if (step === 'review') {
      setSubmitting(true);
      try {
        await darlinkApi.createColiving({
          titre: property.name.trim(),
          description: property.description.trim(),
          adresse: property.location.trim(),
          equipementIds: selectedEquipementIds,
          imageUrls: [property.image.trim()],
          chambres: [
            {
              nom: 'Chambre principale',
              description: `${property.rooms} chambre(s) — capacité ${property.capacity} pers.`,
              capacitePersonnes: Math.max(1, property.capacity),
              litsDisponibles: Math.max(1, property.rooms),
              prixParMois: Math.max(1, property.price),
              typeChambre: 'PRIVEE',
            },
          ],
        });
        toast.success('Soumission réussie !');
        setStep('success');
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Erreur à la soumission';
        setApiError(msg);
        toast.error(msg);
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

  if (!user || user.role !== 'HOTE') {
    return (
      <div style={styles.container}>
        <div style={styles.wrapper}>
          <div style={styles.content}>
            <h2 style={styles.stepTitle}>Connexion hôte requise</h2>
            <p style={{ color: '#666', lineHeight: 1.6 }}>
              Pour soumettre un coliving, connectez-vous avec un compte <strong>hôte</strong>, ou inscrivez-vous en
              choisissant « Hôte ».
            </p>
            <Link to="/auth" style={{ color: '#DD7246', fontWeight: 600 }}>
              Aller à la page de connexion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>Publier un coliving</h1>
          <p style={styles.subtitle}>Soumission en attente de validation par l&apos;admin Darlink</p>
        </div>

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

        {apiError ? (
          <p style={{ color: '#c62828', marginBottom: 16, textAlign: 'center' }}>{apiError}</p>
        ) : null}

        <div style={styles.content}>
          {step === 'property' && (
            <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
              <h2 style={styles.stepTitle}>Détails du coliving</h2>
              <div style={styles.formGrid}>
                <div style={styles.fullWidth}>
                  <label style={styles.label}>Nom</label>
                  <input
                    type="text"
                    {...register("name")}
                    placeholder="ex: Villa Surf & Yoga"
                    style={styles.input}
                  />
                  {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name.message}</span>}
                </div>
                <div style={styles.fullWidth}>
                  <label style={styles.label}>Description</label>
                  <textarea
                    {...register("description")}
                    placeholder="Ambiance, règles de vie, public…"
                    style={{ ...styles.input, minHeight: 120 }}
                  />
                  {errors.description && <span className="text-red-500 text-xs mt-1 block">{errors.description.message}</span>}
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Adresse</label>
                  <input
                    type="text"
                    {...register("location")}
                    placeholder="Ville, quartier…"
                    style={styles.input}
                  />
                  {errors.location && <span className="text-red-500 text-xs mt-1 block">{errors.location.message}</span>}
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Prix mensuel indicatif (MAD)</label>
                  <input
                    type="number"
                    {...register("price", { valueAsNumber: true })}
                    style={styles.input}
                  />
                  {errors.price && <span className="text-red-500 text-xs mt-1 block">{errors.price.message}</span>}
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Nombre de chambres (indicatif)</label>
                  <input
                    type="number"
                    {...register("rooms", { valueAsNumber: true })}
                    min={1}
                    style={styles.input}
                  />
                  {errors.rooms && <span className="text-red-500 text-xs mt-1 block">{errors.rooms.message}</span>}
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Capacité (personnes)</label>
                  <input
                    type="number"
                    {...register("capacity", { valueAsNumber: true })}
                    min={1}
                    style={styles.input}
                  />
                  {errors.capacity && <span className="text-red-500 text-xs mt-1 block">{errors.capacity.message}</span>}
                </div>
                <div style={styles.fullWidth}>
                  <label style={styles.label}>Photo de couverture (URL)</label>
                  <input
                    type="text"
                    {...register("image")}
                    placeholder="https://images.unsplash.com/..."
                    style={styles.input}
                  />
                  {errors.image && <span className="text-red-500 text-xs mt-1 block">{errors.image.message}</span>}
                  <div style={{ marginTop: '16px' }}>
                    <AIImageGenerator
                      onImageGenerated={(url) => setValue('image', url)}
                    />
                  </div>
                </div>
              </div>
            </form>
          )}

          {step === 'amenities' && (
            <div style={styles.form}>
              <h2 style={styles.stepTitle}>Équipements</h2>
              <p style={styles.stepDescription}>Données issues de la base (table équipements)</p>
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
                        background: isSelected ? '#DD7246' : 'white',
                        color: isSelected ? 'white' : '#2C2C2C',
                        borderColor: isSelected ? '#DD7246' : '#E0E0E0',
                      }}
                    >
                      <Icon size={24} />
                      <span>{eq.icone ? `${eq.icone} ` : ''}{eq.nom}</span>
                      {isSelected && <Check size={20} style={{ marginLeft: 'auto' }} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 'review' && (
            <div style={styles.review}>
              <h2 style={styles.stepTitle}>Révision</h2>
              <div style={styles.reviewSection}>
                <h3 style={styles.reviewTitle}>Coliving</h3>
                <div style={styles.reviewGrid}>
                  <div>
                    <strong>Nom:</strong> {property.name}
                  </div>
                  <div>
                    <strong>Adresse:</strong> {property.location}
                  </div>
                  <div>
                    <strong>Prix:</strong> {property.price} MAD/mois (chambre principale)
                  </div>
                </div>
              </div>
              <div style={styles.reviewSection}>
                <h3 style={styles.reviewTitle}>Équipements sélectionnés</h3>
                <div style={styles.selectedAmenities}>
                  {equipements
                    .filter((e) => selectedEquipementIds.includes(e.id))
                    .map((e) => (
                      <span key={e.id} style={styles.amenityTag}>
                        {e.nom}
                      </span>
                    ))}
                  {selectedEquipementIds.length === 0 && (
                    <span style={{ color: '#999', fontSize: 13 }}>Aucun (possible)</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div style={styles.successContainer}>
              <div style={styles.successIcon}><CheckCircle size={64} color="#10B981" /></div>
              <h2 style={styles.successTitle}>Soumission reçue</h2>
              <p style={styles.successMessage}>
                Votre coliving est en statut <strong>en attente</strong>. Un administrateur le validera avant
                publication sur le catalogue.
              </p>
              <div style={styles.successDetails}>
                <p>
                  <strong>Coliving:</strong> {property.name}
                </p>
                <p>
                  <strong>Adresse:</strong> {property.location}
                </p>
              </div>
              <button type="button" onClick={() => (window.location.href = '/host')} style={styles.continueButton}>
                Tableau de bord hôte
              </button>
            </div>
          )}
        </div>

        {step !== 'success' && (
          <div style={styles.actions}>
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={step === 'property'}
              style={{
                ...styles.button,
                background: step === 'property' ? '#E0E0E0' : 'white',
                color: step === 'property' ? '#999' : '#DD7246',
                cursor: step === 'property' ? 'not-allowed' : 'pointer',
              }}
            >
              Précédent
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              disabled={submitting}
              style={{ ...styles.buttonPrimary, opacity: submitting ? 0.7 : 1 }}
            >
              {step === 'review' ? (submitting ? 'Envoi…' : 'Soumettre') : 'Suivant'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#FAFAFA',
    padding: '40px 20px',
  } as React.CSSProperties,
  wrapper: {
    maxWidth: 900,
    margin: '0 auto',
  } as React.CSSProperties,
  header: {
    textAlign: 'center' as const,
    marginBottom: 40,
  } as React.CSSProperties,
  title: {
    fontSize: 32,
    fontWeight: 700,
    color: '#2C2C2C',
    margin: 0,
  } as React.CSSProperties,
  subtitle: {
    fontSize: 15,
    color: '#666',
    margin: '8px 0 0 0',
  } as React.CSSProperties,
  progressContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    gap: 16,
  } as React.CSSProperties,
  progressStep: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 8,
    flex: 1,
    position: 'relative',
  } as React.CSSProperties,
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 14,
    transition: 'all 0.3s ease',
  } as React.CSSProperties,
  stepLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: '#666',
    margin: 0,
    textAlign: 'center',
  } as React.CSSProperties,
  stepLine: {
    position: 'absolute' as const,
    top: 20,
    left: '50%',
    width: '100%',
    height: 2,
    background: '#E0E0E0',
    zIndex: -1,
  } as React.CSSProperties,
  content: {
    background: 'white',
    borderRadius: 16,
    padding: 40,
    marginBottom: 30,
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  } as React.CSSProperties,
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 24,
  } as React.CSSProperties,
  stepTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: '#2C2C2C',
    margin: 0,
  } as React.CSSProperties,
  stepDescription: {
    fontSize: 14,
    color: '#666',
    margin: 0,
  } as React.CSSProperties,
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 16,
  } as React.CSSProperties,
  fullWidth: {
    gridColumn: '1 / -1',
  } as React.CSSProperties,
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 8,
  } as React.CSSProperties,
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: '#2C2C2C',
  } as React.CSSProperties,
  input: {
    padding: '12px 14px',
    border: '1px solid #E0E0E0',
    borderRadius: 8,
    fontSize: 14,
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'all 0.3s ease',
  } as React.CSSProperties,
  amenitiesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: 12,
  } as React.CSSProperties,
  amenityButton: {
    padding: '16px 12px',
    border: '2px solid',
    borderRadius: 8,
    background: 'white',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 8,
    transition: 'all 0.3s ease',
    fontSize: 13,
    fontWeight: 600,
  } as React.CSSProperties,
  review: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 24,
  } as React.CSSProperties,
  reviewSection: {
    paddingBottom: 20,
    borderBottom: '1px solid #E0E0E0',
  } as React.CSSProperties,
  reviewTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#2C2C2C',
    margin: '0 0 12px 0',
  } as React.CSSProperties,
  reviewGrid: {
    display: 'grid',
    gap: 8,
  } as React.CSSProperties,
  selectedAmenities: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  } as React.CSSProperties,
  amenityTag: {
    background: '#FFF4E0',
    color: '#DD7246',
    padding: '6px 12px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 600,
  } as React.CSSProperties,
  successContainer: {
    textAlign: 'center' as const,
    padding: 40,
  } as React.CSSProperties,
  successIcon: {
    fontSize: 64,
    marginBottom: 20,
  } as React.CSSProperties,
  successTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: '#2C2C2C',
    margin: '0 0 12px 0',
  } as React.CSSProperties,
  successMessage: {
    fontSize: 15,
    color: '#666',
    margin: '0 0 24px 0',
  } as React.CSSProperties,
  successDetails: {
    background: '#FFF4E0',
    padding: 20,
    borderRadius: 8,
    marginBottom: 24,
    textAlign: 'left' as const,
  } as React.CSSProperties,
  continueButton: {
    padding: '14px 32px',
    background: '#DD7246',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  } as React.CSSProperties,
  actions: {
    display: 'flex',
    gap: 12,
    justifyContent: 'flex-end',
  } as React.CSSProperties,
  button: {
    padding: '12px 24px',
    border: '1px solid #E0E0E0',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  } as React.CSSProperties,
  buttonPrimary: {
    padding: '12px 32px',
    background: '#DD7246',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  } as React.CSSProperties,
};
