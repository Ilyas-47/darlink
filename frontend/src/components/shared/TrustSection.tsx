import React from 'react';
import { Shield, CheckCircle, Clock, Users, CreditCard, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface TrustFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

const listVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any } }
};

const TrustSection: React.FC = () => {
  const features: TrustFeature[] = [
    {
      icon: <Shield size={22} />,
      title: 'Hôtes Vérifiés',
      description: 'Tous nos hôtes sont rigoureusement vérifiés et validés pour garantir votre sécurité.',
      color: '#4F46E5',
      bgColor: 'rgba(79, 70, 229, 0.08)',
    },
    {
      icon: <CheckCircle size={22} />,
      title: 'Avis Vérifiés',
      description: 'Lisez les avis authentiques des résidents précédents pour faire votre choix en confiance.',
      color: '#059669',
      bgColor: 'rgba(5, 150, 105, 0.08)',
    },
    {
      icon: <CreditCard size={22} />,
      title: 'Protection du Paiement',
      description: 'Votre paiement est sécurisé et ne sera libéré que 48h après votre arrivée.',
      color: '#DD7246',
      bgColor: 'rgba(221, 114, 70, 0.08)',
    },
    {
      icon: <Clock size={22} />,
      title: 'Annulation Flexible',
      description: 'Annulez gratuitement dans les 24 heures suivant votre réservation, sans questions.',
      color: '#0891B2',
      bgColor: 'rgba(8, 145, 178, 0.08)',
    },
    {
      icon: <Users size={22} />,
      title: 'Support 24/7',
      description: 'Notre équipe est disponible jour et nuit pour vous aider avec n\'importe quel problème.',
      color: '#D97706',
      bgColor: 'rgba(217, 119, 6, 0.08)',
    },
    {
      icon: <AlertCircle size={22} />,
      title: 'Garantie de Conformité',
      description: 'Si le logement ne correspond pas à l\'annonce, demandez un remboursement ou une alternative.',
      color: '#E11D74',
      bgColor: 'rgba(225, 29, 116, 0.08)',
    },
  ];

  return (
    <section style={{ padding: '96px 24px', backgroundColor: '#FAF9F7' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <p style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#DD7246', marginBottom: '12px' }}>
            Votre sécurité avant tout
          </p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1A1A2E', letterSpacing: '-0.5px', marginBottom: '20px' }}>
            Réservez en Toute Confiance
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#6B7280', maxWidth: '580px', margin: '0 auto', lineHeight: 1.65 }}>
            Chez Darlink, votre sécurité et votre satisfaction sont nos priorités absolues.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px',
          }}
        >
          {features.map((feature, i) => (
            <TrustCard key={i} feature={feature} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const TrustCard: React.FC<{ feature: TrustFeature }> = ({ feature }) => {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6, boxShadow: `0 15px 30px ${feature.color}08`, borderColor: `${feature.color}33` }}
      style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '32px',
        border: '1.5px solid #F0EDE8',
        display: 'flex',
        gap: '20px',
        alignItems: 'flex-start',
        cursor: 'default',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        style={{
          width: '52px',
          height: '52px',
          minWidth: '52px',
          borderRadius: '14px',
          backgroundColor: feature.bgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: feature.color,
          border: `1px solid ${feature.color}15`,
        }}
      >
        {feature.icon}
      </div>
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1A1A2E', marginBottom: '8px' }}>
          {feature.title}
        </h3>
        <p style={{ fontSize: '0.9rem', color: '#6B7280', lineHeight: 1.65, margin: 0 }}>
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
};

export default TrustSection;