import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type Tab = 'privacy' | 'terms' | 'cookies';

const tabs: { key: Tab; label: string }[] = [
  { key: 'privacy', label: 'Politique de confidentialité' },
  { key: 'terms', label: "Conditions d'utilisation" },
  { key: 'cookies', label: 'Politique des cookies' },
];

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState<Tab>('privacy');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAF9F7' }}>
      {/* Header */}
      <section style={{
        padding: '100px 24px 48px',
        background: 'linear-gradient(135deg, #1A1007 0%, #2D1F10 100%)',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#DD7246', marginBottom: '12px' }}>
          Informations légales
        </p>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'white', marginBottom: '12px' }}>
          Mentions Légales
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem' }}>
          Dernière mise à jour : Juin 2025
        </p>
      </section>

      {/* Tabs */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          display: 'flex', gap: '4px', marginTop: '-24px',
          background: 'white', borderRadius: '14px', padding: '4px',
          border: '1.5px solid #F0EDE8', boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        }}>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                flex: 1, padding: '12px 16px', borderRadius: '10px', border: 'none',
                fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s',
                background: activeTab === t.key ? '#DD7246' : 'transparent',
                color: activeTab === t.key ? 'white' : '#6B7280',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{
          marginTop: '32px', marginBottom: '80px',
          background: 'white', borderRadius: '16px', padding: '40px',
          border: '1.5px solid #F0EDE8',
        }}>
          {activeTab === 'privacy' && <PrivacyContent />}
          {activeTab === 'terms' && <TermsContent />}
          {activeTab === 'cookies' && <CookiesContent />}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ marginBottom: '24px', borderBottom: '1px solid #F0EDE8', paddingBottom: '20px' }}>
      <button onClick={() => setOpen(v => !v)} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
        background: 'none', border: 'none', cursor: 'pointer', padding: '0',
      }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1A1A2E', margin: 0 }}>{title}</h3>
        <ChevronDown size={18} color="#9CA3AF" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      {open && (
        <div style={{ marginTop: '12px', fontSize: '0.9rem', color: '#6B7280', lineHeight: 1.8 }}>
          {children}
        </div>
      )}
    </div>
  );
}

function PrivacyContent() {
  return (
    <>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1A1A2E', marginBottom: '24px' }}>
        Politique de Confidentialité
      </h2>
      <Section title="1. Collecte des données">
        <p>Darlink collecte les données personnelles suivantes lors de votre inscription ou de votre navigation :</p>
        <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
          <li>Nom complet et adresse email</li>
          <li>Numéro de téléphone</li>
          <li>Profession et biographie (pour les résidents)</li>
          <li>Documents d'identité (pour la vérification des hôtes)</li>
          <li>Informations de paiement sécurisées (traitées par nos partenaires)</li>
        </ul>
      </Section>
      <Section title="2. Utilisation des données">
        <p>Vos données sont utilisées exclusivement pour :</p>
        <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
          <li>La gestion de votre compte et de votre profil</li>
          <li>Le traitement et la validation des réservations</li>
          <li>La mise en relation sécurisée entre les hôtes et les résidents</li>
          <li>L'amélioration de nos services et de l'expérience utilisateur</li>
          <li>L'envoi de notifications relatives à vos séjours</li>
        </ul>
      </Section>
      <Section title="3. Protection des données">
        <p>Nous mettons tout en œuvre pour protéger vos données personnelles par :</p>
        <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
          <li>Des protocoles de sécurité avancés et un chiffrement des données de bout en bout</li>
          <li>Des serveurs sécurisés et surveillés en permanence</li>
          <li>Un accès strict et limité aux seules personnes autorisées au sein de notre équipe</li>
        </ul>
      </Section>
      <Section title="4. Vos droits">
        <p>Conformément à la loi 09-08 relative à la protection des données personnelles au Maroc, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Pour exercer ce droit, veuillez nous contacter à <strong>contact@darlink.ma</strong>.</p>
      </Section>
    </>
  );
}

function TermsContent() {
  return (
    <>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1A1A2E', marginBottom: '24px' }}>
        Conditions Générales d'Utilisation
      </h2>
      <Section title="1. Objet">
        <p>Les présentes conditions régissent l'utilisation de la plateforme Darlink, accessible à l'adresse darlink.ma. En utilisant nos services, en tant que visiteur, résident ou hôte, vous acceptez ces conditions dans leur intégralité.</p>
      </Section>
      <Section title="2. Inscription et compte">
        <p>L'inscription est gratuite et ouverte à toute personne majeure. Vous vous engagez à fournir des informations exactes et à maintenir la confidentialité de vos identifiants. Les hôtes s'engagent à fournir des documents d'identité valides pour notre processus de vérification de sécurité.</p>
      </Section>
      <Section title="3. Réservations et Paiements">
        <p>Les réservations sont soumises à la disponibilité et à la confirmation de l'hôte. Les prix affichés incluent les frais de service Darlink. Toute annulation est soumise aux conditions d'annulation spécifiques définies par l'hôte et acceptées par le résident lors de la réservation.</p>
      </Section>
      <Section title="4. Responsabilités">
        <p>Darlink agit en tant qu'intermédiaire technologique de mise en relation entre les résidents et les hôtes. Bien que nous vérifiions méticuleusement chaque annonce, les hôtes restent seuls responsables de la conformité, de la qualité et de la sécurité des espaces qu'ils proposent.</p>
      </Section>
      <Section title="5. Propriété intellectuelle">
        <p>L'ensemble du contenu de la plateforme (textes, images, chartes graphiques, logos, code source) est la propriété exclusive de Darlink et est protégé par le droit de la propriété intellectuelle. Toute reproduction ou utilisation non autorisée est strictement interdite.</p>
      </Section>
    </>
  );
}

function CookiesContent() {
  return (
    <>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1A1A2E', marginBottom: '24px' }}>
        Politique des Cookies
      </h2>
      <Section title="1. Qu'est-ce qu'un cookie ?">
        <p>Un cookie est un petit fichier texte sécurisé stocké sur votre appareil (ordinateur, smartphone, tablette) lors de votre visite sur notre plateforme. Il nous permet de vous offrir une navigation fluide et personnalisée.</p>
      </Section>
      <Section title="2. Cookies utilisés">
        <p>La plateforme Darlink utilise les catégories de cookies suivantes :</p>
        <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
          <li><strong>Cookies essentiels ou techniques</strong> : indispensables au fonctionnement du site (ex: maintien de votre session de connexion de façon sécurisée).</li>
          <li><strong>Cookies analytiques</strong> : pour mesurer l'audience, comprendre comment la plateforme est utilisée et améliorer nos services (totalement anonymisés).</li>
          <li><strong>Cookies fonctionnels</strong> : pour mémoriser vos préférences de navigation.</li>
        </ul>
      </Section>
      <Section title="3. Gestion de vos préférences">
        <p>Vous pouvez à tout moment configurer votre navigateur pour refuser l'installation des cookies. Toutefois, la désactivation des cookies essentiels peut altérer considérablement votre expérience sur la plateforme et vous empêcher de vous connecter à votre compte.</p>
      </Section>
    </>
  );
}
