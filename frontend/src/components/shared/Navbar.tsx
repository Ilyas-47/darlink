import { useState, useEffect } from 'react';
import { Menu, X, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { darlinkApi } from '../../services/darlinkApi';
import { getStoredUser } from '../../config/api';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const NAV_LINKS = [
  { to: '/destinations', label: 'Explorer' },
  { to: '/community',   label: 'Communauté' },
  { to: '/about',       label: 'À propos' },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    if (user) { setIsLoggedIn(true); setUserRole(user.role); }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    darlinkApi.logout();
    setIsLoggedIn(false);
    setUserRole(null);
    setUserMenuOpen(false);
    window.location.href = '/';
  };

  const dashboardLink =
    userRole === 'ADMIN' ? { to: '/admin',   label: 'Admin' } :
    userRole === 'HOTE'  ? { to: '/host',    label: 'Tableau de bord' } :
                           { to: '/profile', label: 'Réservations' };

  const isActive = (to: string) =>
    location.pathname === to || location.pathname.startsWith(to + '/');

  return (
    <>
      <div style={{
        position: 'sticky', top: 0, zIndex: 200, width: '100%',
        padding: scrolled ? '12px 24px 0' : '0',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <nav style={{
          maxWidth: scrolled ? '1200px' : '100%',
          margin: '0 auto',
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: scrolled ? '20px' : '0px',
          border: scrolled ? '1px solid rgba(255, 255, 255, 0.5)' : '1px solid #F0EDE8',
          boxShadow: scrolled ? '0 20px 40px rgba(15,10,6,0.08)' : 'none',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          <div style={{
            maxWidth: '1200px', margin: '0 auto',
            padding: '0 24px',
            height: scrolled ? '64px' : '72px',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'height 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}>

            {/* Logo + Nav links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
              
              {/* Logo */}
              <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
                <img
                  src="/logo.png"
                  alt="Darlink"
                  style={{ height: scrolled ? '40px' : '44px', objectFit: 'contain', transition: 'height 0.4s' }}
                  onError={e => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                    const next = e.currentTarget.nextElementSibling as HTMLElement;
                    if (next) next.style.display = 'block';
                  }}
                />
                <span style={{ display: 'none', fontSize: '1.6rem', fontWeight: 800, color: '#DD7246', letterSpacing: '-0.5px' }}>
                  Darlink
                </span>
              </Link>

              {/* Nav links desktop */}
              <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {NAV_LINKS.map(link => {
                  const active = isActive(link.to);
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      style={{
                        position: 'relative',
                        padding: '8px 16px',
                        fontSize: '0.9rem',
                        fontWeight: active ? 700 : 600,
                        color: active ? '#DD7246' : '#1A1A2E',
                        textDecoration: 'none',
                        borderRadius: '12px',
                        transition: 'all 0.2s',
                      }}
                      onMouseOver={e => {
                        if (!active) {
                          e.currentTarget.style.color = '#DD7246';
                          e.currentTarget.style.backgroundColor = 'rgba(221,114,70,0.06)';
                        }
                      }}
                      onMouseOut={e => {
                        if (!active) {
                          e.currentTarget.style.color = '#1A1A2E';
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {link.label}
                      {active && (
                        <span style={{
                          position: 'absolute', bottom: '4px',
                          left: '16px', right: '16px',
                          height: '2px', backgroundColor: '#DD7246', borderRadius: '2px',
                        }} />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Login / Account Right side */}
            <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {isLoggedIn ? (
                <>
                  <Link
                    to={dashboardLink.to}
                    style={{
                      fontSize: '0.88rem', fontWeight: 700,
                      color: '#6B7280', textDecoration: 'none',
                      padding: '8px 16px', borderRadius: '12px',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={e => { e.currentTarget.style.color = '#DD7246'; e.currentTarget.style.backgroundColor = 'rgba(221,114,70,0.06)'; }}
                    onMouseOut={e => { e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    {dashboardLink.label}
                  </Link>

                  <div style={{ width: '1px', height: '24px', backgroundColor: '#E5EDE8' }} />

                  {/* Dropdown via Radix UI */}
                  <DropdownMenu.Root open={userMenuOpen} onOpenChange={setUserMenuOpen}>
                    <DropdownMenu.Trigger asChild>
                      <button
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '8px 16px', borderRadius: '14px',
                          border: `1.5px solid ${userMenuOpen ? '#DD7246' : '#F0EDE8'}`,
                          backgroundColor: userMenuOpen ? '#FFFAF7' : 'white',
                          cursor: 'pointer', transition: 'all 0.2s',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                        }}
                        onMouseOver={e => e.currentTarget.style.borderColor = '#DD7246'}
                        onMouseOut={e => { if (!userMenuOpen) e.currentTarget.style.borderColor = '#F0EDE8'; }}
                      >
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '50%',
                          backgroundColor: '#DD7246', color: 'white',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.8rem', fontWeight: 800,
                        }}>
                          {getStoredUser()?.nom?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1A1A2E' }}>
                          Mon compte
                        </span>
                      </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        sideOffset={8}
                        style={{
                          backgroundColor: 'white', borderRadius: '16px',
                          border: '1.5px solid #F0EDE8',
                          boxShadow: '0 12px 40px rgba(15,10,6,0.12)',
                          minWidth: '200px', overflow: 'hidden', zIndex: 300,
                          padding: '6px'
                        }}
                      >
                        <DropdownMenu.Item asChild style={{ outline: 'none' }}>
                          <Link to="/profile" onClick={() => setUserMenuOpen(false)}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', fontSize: '0.9rem', color: '#1A1A2E', textDecoration: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = '#FAFAF9'}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <User size={16} /> Mon Profil
                          </Link>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item asChild style={{ outline: 'none' }}>
                          <Link to={dashboardLink.to} onClick={() => setUserMenuOpen(false)}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', fontSize: '0.9rem', color: '#1A1A2E', textDecoration: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = '#FAFAF9'}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            Tableau de bord
                          </Link>
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator style={{ height: '1px', backgroundColor: '#F0EDE8', margin: '4px' }} />
                        <DropdownMenu.Item asChild style={{ outline: 'none' }}>
                          <button onClick={handleLogout}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 14px', fontSize: '0.9rem', color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderRadius: '10px', fontWeight: 700 }}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            Déconnexion
                          </button>
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </>
              ) : (
                <Link
                  to="/auth"
                  style={{
                    display: 'flex', alignItems: 'center',
                    padding: '12px 28px', borderRadius: '14px',
                    backgroundColor: '#DD7246', color: 'white',
                    fontSize: '0.9rem', fontWeight: 700,
                    textDecoration: 'none', letterSpacing: '0.04em',
                    transition: 'all 0.2s',
                    boxShadow: '0 8px 20px rgba(221,114,70,0.2)'
                  }}
                  onMouseOver={e => { e.currentTarget.style.backgroundColor = '#C4622F'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseOut={e => { e.currentTarget.style.backgroundColor = '#DD7246'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  SE CONNECTER
                </Link>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="nav-mobile-btn"
              onClick={() => setMobileOpen(v => !v)}
              style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: '#1A1A2E' }}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <div style={{
              borderTop: '1px solid #F0EDE8', backgroundColor: 'white',
              padding: '16px 20px 24px',
              display: 'flex', flexDirection: 'column', gap: '8px',
              borderRadius: scrolled ? '0 0 20px 20px' : '0'
            }}>
              {NAV_LINKS.map(link => (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                  style={{
                    padding: '12px 16px', fontSize: '0.95rem', fontWeight: 600,
                    color: isActive(link.to) ? '#DD7246' : '#1A1A2E',
                    textDecoration: 'none', borderRadius: '12px',
                    backgroundColor: isActive(link.to) ? 'rgba(221,114,70,0.06)' : 'transparent',
                  }}
                >
                  {link.label}
                </Link>
              ))}

              <div style={{ height: '1px', backgroundColor: '#F0EDE8', margin: '8px 0' }} />

              {isLoggedIn ? (
                <>
                  <Link to={dashboardLink.to} onClick={() => setMobileOpen(false)}
                    style={{ padding: '12px 16px', fontSize: '0.95rem', fontWeight: 600, color: '#1A1A2E', textDecoration: 'none', borderRadius: '12px' }}
                  >
                    {dashboardLink.label}
                  </Link>
                  <Link to="/profile" onClick={() => setMobileOpen(false)}
                    style={{ padding: '12px 16px', fontSize: '0.95rem', fontWeight: 600, color: '#1A1A2E', textDecoration: 'none', borderRadius: '12px' }}
                  >
                    Mon Profil
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    style={{ padding: '12px 16px', fontSize: '0.95rem', fontWeight: 700, color: '#DC2626', background: '#FEF2F2', border: 'none', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', marginTop: '4px' }}
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setMobileOpen(false)}
                  style={{ padding: '14px', fontSize: '0.95rem', fontWeight: 700, color: 'white', textDecoration: 'none', borderRadius: '12px', backgroundColor: '#DD7246', textAlign: 'center', marginTop: '4px' }}
                >
                  SE CONNECTER
                </Link>
              )}
            </div>
          )}
        </nav>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .nav-desktop { display: flex !important; }
          .nav-mobile-btn { display: none !important; }
        }
        @media (max-width: 767px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;