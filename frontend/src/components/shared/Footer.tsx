import { useState } from 'react';
import { FaInstagram, FaTiktok, FaDiscord } from 'react-icons/fa6';
import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  const linkGroups = {
    residents: [
      { to: '/destinations', label: 'Trouver mon espace' },
      { to: '/destinations', label: 'Destinations' },
      { to: '/about#how-it-works', label: 'Comment ça marche' },
      { to: '/about#faq', label: 'Questions fréquentes' },
    ],
    hotes: [
      { to: '/host-register', label: 'Devenir Hôte' },
      { to: '/host', label: 'Tableau de bord Hôte' },
      { to: '/about#hosting-guide', label: "Guide d'hébergement" },
    ],
    apropos: [
      { to: '/about', label: 'À propos de Darlink' },
      { to: '/about#contact', label: 'Contact' },
    ],
  };

  return (
    <footer style={{ backgroundColor: '#0F0A06', color: 'white' }}>
      {/* Main Footer */}
      <div style={{ padding: '72px 24px 48px' }}>
        <div
          className="footer-grid"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
            gap: '48px',
          }}
        >
          {/* Brand column */}
          <div>
            <div style={{ marginBottom: '20px' }}>
              <img
                src="/logo.png"
                alt="Darlink Logo"
                style={{ height: '40px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
                onError={e => {
                  e.currentTarget.style.display = 'none';
                  const next = e.currentTarget.nextElementSibling as HTMLElement;
                  if (next) next.style.display = 'block';
                }}
              />
              <span style={{ display: 'none', fontSize: '1.6rem', fontWeight: 800, color: 'white', letterSpacing: '-0.5px' }}>
                Darlink
              </span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '28px', maxWidth: '260px' }}>
              La première plateforme dédiée au coliving premium au Maroc — pour nomades digitaux, créatifs et entrepreneurs.
            </p>

            {/* Newsletter */}
            <form
              onSubmit={handleNewsletter}
              style={{
                display: 'flex',
                backgroundColor: 'rgba(255,255,255,0.07)',
                border: `1px solid ${subscribed ? '#059669' : 'rgba(255,255,255,0.12)'}`,
                borderRadius: '10px',
                overflow: 'hidden',
                marginBottom: '28px',
                transition: 'border-color 0.3s',
              }}
            >
              <input
                type="email"
                placeholder={subscribed ? '✓ Merci !' : 'Votre email...'}
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={subscribed}
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                  padding: '11px 14px',
                  fontSize: '0.85rem',
                  color: subscribed ? '#10B981' : 'white',
                }}
              />
              <button
                type="submit"
                disabled={subscribed}
                style={{
                  backgroundColor: subscribed ? '#059669' : '#DD7246',
                  border: 'none',
                  padding: '11px 14px',
                  cursor: subscribed ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'background 0.3s',
                }}
              >
                {subscribed ? <Check size={15} color="white" /> : <ArrowRight size={15} color="white" />}
              </button>
            </form>

            {/* Socials */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                { href: 'https://instagram.com/darlink', icon: <FaInstagram size={18} />, label: 'Instagram' },
                { href: 'https://tiktok.com/@darlink', icon: <FaTiktok size={18} />, label: 'TikTok' },
                { href: 'https://discord.gg/darlink', icon: <FaDiscord size={18} />, label: 'Discord' },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: '38px', height: '38px', borderRadius: '10px',
                    backgroundColor: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.backgroundColor = '#DD7246';
                    e.currentTarget.style.borderColor = '#DD7246';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {[
            { title: 'Pour les Résidents', links: linkGroups.residents },
            { title: 'Pour les Hôtes', links: linkGroups.hotes },
            { title: 'À Propos', links: linkGroups.apropos },
          ].map(col => (
            <div key={col.title}>
              <h4
                style={{
                  fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)',
                  marginBottom: '20px',
                }}
              >
                {col.title}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {col.links.map((link, i) => (
                  <li key={i}>
                    <Link
                      to={link.to}
                      style={{
                        color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem',
                        textDecoration: 'none', transition: 'color 0.2s',
                        display: 'inline-block',
                      }}
                      onMouseOver={e => (e.currentTarget.style.color = 'white')}
                      onMouseOut={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '20px 24px' }}>
        <div
          style={{
            maxWidth: '1200px', margin: '0 auto',
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', flexWrap: 'wrap', gap: '12px',
          }}
        >
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255,255,255,0.3)' }}>
            © {new Date().getFullYear()} Darlink. Tous droits réservés.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            {[
              { to: '/legal', label: 'Confidentialité' },
              { to: '/legal', label: 'Conditions' },
              { to: '/legal', label: 'Cookies' },
            ].map(link => (
              <Link
                key={link.label}
                to={link.to}
                style={{
                  color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem',
                  textDecoration: 'none', transition: 'color 0.2s',
                }}
                onMouseOver={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                onMouseOut={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Subscribed toast */}
      {subscribed && (
        <div className="toast toast-success">
          ✓ Merci pour votre inscription à la newsletter Darlink !
        </div>
      )}
    </footer>
  );
};

export default Footer;