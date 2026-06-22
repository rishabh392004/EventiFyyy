import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { animateNavbar } from '../utils/gsapAnimations';
import logoImg from '../assets/logo.png';

const Navbar = () => {
  const navRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (navRef.current) {
      animateNavbar(navRef.current);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const styles = {
    wrapper: {
      position: 'fixed',
      top: 16,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 32px)',
      maxWidth: 1200,
      zIndex: 1000,
    },
    nav: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 24px',
      background: scrolled
        ? 'hsla(var(--bg-secondary) / 0.85)'
        : 'hsla(var(--bg-secondary) / 0.6)',
      backdropFilter: 'blur(24px) saturate(1.8)',
      WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
      border: '1px solid hsla(var(--border) / 0.35)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: scrolled
        ? 'var(--shadow-lg), 0 0 40px hsla(var(--primary) / 0.08)'
        : 'var(--shadow-md)',
      transition: 'background var(--transition-normal), box-shadow var(--transition-normal)',
    },
    brand: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      textDecoration: 'none',
      cursor: 'pointer',
    },
    logo: {
      width: 32,
      height: 32,
      borderRadius: 'var(--radius-sm)',
      objectFit: 'contain',
    },
    brandText: {
      fontSize: '1.25rem',
      fontWeight: 800,
      letterSpacing: '-0.5px',
      background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    desktopLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
    },
    navLink: (active) => ({
      position: 'relative',
      padding: '8px 16px',
      fontSize: '0.875rem',
      fontWeight: 500,
      color: active ? 'hsl(var(--primary))' : 'hsl(var(--text-secondary))',
      textDecoration: 'none',
      borderRadius: 'var(--radius-md)',
      background: active ? 'hsla(var(--primary) / 0.1)' : 'transparent',
      transition: 'color var(--transition-fast), background var(--transition-fast)',
      cursor: 'pointer',
      border: 'none',
      outline: 'none',
      display: 'inline-flex',
      alignItems: 'center',
    }),
    activeDot: {
      position: 'absolute',
      bottom: 2,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 4,
      height: 4,
      borderRadius: '50%',
      background: 'hsl(var(--primary))',
      boxShadow: '0 0 8px hsl(var(--primary))',
    },
    createBtn: {
      padding: '8px 18px',
      fontSize: '0.8rem',
      fontWeight: 600,
      color: 'hsl(var(--bg-primary))',
      background: 'linear-gradient(135deg, hsl(var(--accent)), hsl(var(--primary)))',
      border: 'none',
      borderRadius: 'var(--radius-md)',
      textDecoration: 'none',
      cursor: 'pointer',
      letterSpacing: '0.3px',
      boxShadow: '0 2px 12px hsla(var(--primary) / 0.35)',
      transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
    },
    userSection: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    },
    avatar: {
      width: 34,
      height: 34,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.85rem',
      fontWeight: 700,
      color: '#fff',
      textTransform: 'uppercase',
      boxShadow: '0 0 12px hsla(var(--primary) / 0.3)',
      flexShrink: 0,
    },
    userName: {
      fontSize: '0.85rem',
      fontWeight: 500,
      color: 'hsl(var(--text-primary))',
      maxWidth: 100,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    logoutBtn: {
      padding: '6px 14px',
      fontSize: '0.78rem',
      fontWeight: 600,
      color: 'hsl(var(--text-secondary))',
      background: 'hsla(var(--bg-tertiary) / 0.6)',
      border: '1px solid hsla(var(--border) / 0.4)',
      borderRadius: 'var(--radius-sm)',
      cursor: 'pointer',
      transition: 'color var(--transition-fast), border-color var(--transition-fast), background var(--transition-fast)',
    },
    authLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    signInLink: {
      padding: '8px 16px',
      fontSize: '0.85rem',
      fontWeight: 500,
      color: 'hsl(var(--text-secondary))',
      textDecoration: 'none',
      borderRadius: 'var(--radius-md)',
      transition: 'color var(--transition-fast)',
    },
    getStartedBtn: {
      padding: '9px 22px',
      fontSize: '0.85rem',
      fontWeight: 600,
      color: '#fff',
      background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))',
      border: 'none',
      borderRadius: 'var(--radius-md)',
      textDecoration: 'none',
      cursor: 'pointer',
      boxShadow: '0 2px 16px hsla(var(--primary) / 0.4)',
      transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
    },
    hamburger: {
      display: 'none',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 5,
      width: 36,
      height: 36,
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: 4,
      borderRadius: 'var(--radius-sm)',
      transition: 'background var(--transition-fast)',
    },
    hamburgerLine: (open, idx) => {
      const base = {
        width: 22,
        height: 2,
        borderRadius: 2,
        background: 'hsl(var(--text-primary))',
        transition: 'transform 0.3s cubic-bezier(0.645,0.045,0.355,1), opacity 0.2s ease',
        transformOrigin: 'center',
      };
      if (open && idx === 0) return { ...base, transform: 'translateY(7px) rotate(45deg)' };
      if (open && idx === 1) return { ...base, opacity: 0, transform: 'scaleX(0)' };
      if (open && idx === 2) return { ...base, transform: 'translateY(-7px) rotate(-45deg)' };
      return base;
    },
    mobileMenu: (open) => ({
      position: 'absolute',
      top: 'calc(100% + 8px)',
      left: 0,
      right: 0,
      background: 'hsla(var(--bg-secondary) / 0.95)',
      backdropFilter: 'blur(24px) saturate(1.8)',
      WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
      border: '1px solid hsla(var(--border) / 0.35)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      padding: open ? '16px' : '0 16px',
      maxHeight: open ? 400 : 0,
      overflow: 'hidden',
      opacity: open ? 1 : 0,
      transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease, padding 0.35s cubic-bezier(0.4,0,0.2,1)',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }),
    mobileLink: (active) => ({
      display: 'flex',
      alignItems: 'center',
      padding: '12px 16px',
      fontSize: '0.9rem',
      fontWeight: 500,
      color: active ? 'hsl(var(--primary))' : 'hsl(var(--text-secondary))',
      textDecoration: 'none',
      borderRadius: 'var(--radius-md)',
      background: active ? 'hsla(var(--primary) / 0.1)' : 'transparent',
      transition: 'color var(--transition-fast), background var(--transition-fast)',
    }),
    mobileDivider: {
      height: 1,
      background: 'hsla(var(--border) / 0.3)',
      margin: '8px 0',
    },
    mobileUserRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 16px',
    },
    mobileUserInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
    },
  };

  const cssMediaRule = `
    @media (max-width: 768px) {
      .eventify-desktop-links { display: none !important; }
      .eventify-desktop-user { display: none !important; }
      .eventify-hamburger { display: flex !important; }
    }
  `;

  return (
    <>
      <style>{cssMediaRule}</style>
      <div style={styles.wrapper} ref={navRef}>
        <nav style={styles.nav}>
          {/* Brand */}
          <Link to="/" style={styles.brand}>
            <img src={logoImg} alt="Elysian" style={styles.logo} />
            <span style={styles.brandText}>Elysian</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="eventify-desktop-links" style={styles.desktopLinks}>
            <Link to="/" style={styles.navLink(isActive('/'))}>
              Discover
              {isActive('/') && <span style={styles.activeDot} />}
            </Link>

            {user && (
              <Link to="/my-events" style={styles.navLink(isActive('/my-events'))}>
                My Events
                {isActive('/my-events') && <span style={styles.activeDot} />}
              </Link>
            )}

            {user && (
              <Link to="/my-tickets" style={styles.navLink(isActive('/my-tickets'))}>
                My Tickets
                {isActive('/my-tickets') && <span style={styles.activeDot} />}
              </Link>
            )}

            {user && (
              <Link
                to="/create-event"
                style={styles.createBtn}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px) scale(1.03)';
                  e.currentTarget.style.boxShadow = '0 4px 20px hsla(var(--primary) / 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 12px hsla(var(--primary) / 0.35)';
                }}
              >
                <span style={{ fontSize: '1rem', lineHeight: 1 }}>+</span>
                Create
              </Link>
            )}
          </div>

          {/* Desktop User Section */}
          <div className="eventify-desktop-user" style={styles.userSection}>
            {user ? (
              <>
                <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textDecoration: 'none' }}>
                  <div style={styles.avatar}>
                    {user.profileImg ? (
                      <img src={user.profileImg} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      user.name ? user.name.charAt(0) : '?'
                    )}
                  </div>
                  <span style={styles.userName}>{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  style={styles.logoutBtn}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'hsl(var(--text-primary))';
                    e.currentTarget.style.borderColor = 'hsla(var(--border-hover) / 0.6)';
                    e.currentTarget.style.background = 'hsla(var(--bg-tertiary) / 0.9)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'hsl(var(--text-secondary))';
                    e.currentTarget.style.borderColor = 'hsla(var(--border) / 0.4)';
                    e.currentTarget.style.background = 'hsla(var(--bg-tertiary) / 0.6)';
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <div style={styles.authLinks}>
                <Link
                  to="/login"
                  style={styles.signInLink}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'hsl(var(--text-primary))'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'hsl(var(--text-secondary))'; }}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  style={styles.getStartedBtn}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 24px hsla(var(--primary) / 0.55)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 16px hsla(var(--primary) / 0.4)';
                  }}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger (Mobile) */}
          <button
            className="eventify-hamburger"
            style={styles.hamburger}
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <div style={styles.hamburgerLine(mobileOpen, 0)} />
            <div style={styles.hamburgerLine(mobileOpen, 1)} />
            <div style={styles.hamburgerLine(mobileOpen, 2)} />
          </button>

          {/* Mobile Dropdown */}
          <div style={styles.mobileMenu(mobileOpen)}>
            <Link to="/" style={styles.mobileLink(isActive('/'))}>
              Discover
            </Link>

            {user && (
              <Link to="/my-events" style={styles.mobileLink(isActive('/my-events'))}>
                My Hosted Events
              </Link>
            )}

            {user && (
              <Link to="/my-tickets" style={styles.mobileLink(isActive('/my-tickets'))}>
                My Tickets
              </Link>
            )}

            {user && (
              <Link to="/profile" style={styles.mobileLink(isActive('/profile'))}>
                My Profile
              </Link>
            )}

            {user && (
              <Link to="/create-event" style={styles.mobileLink(isActive('/create-event'))}>
                + Create Event
              </Link>
            )}

            <div style={styles.mobileDivider} />

            {user ? (
              <div style={styles.mobileUserRow}>
                <div style={styles.mobileUserInfo}>
                  <div style={{ ...styles.avatar, width: 28, height: 28, fontSize: '0.75rem' }}>
                    {user.profileImg ? (
                      <img src={user.profileImg} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      user.name ? user.name.charAt(0) : '?'
                    )}
                  </div>
                  <span style={{ ...styles.userName, fontSize: '0.85rem' }}>{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  style={styles.logoutBtn}
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" style={styles.mobileLink(isActive('/login'))}>
                  Sign In
                </Link>
                <div style={{ padding: '8px 16px 4px' }}>
                  <Link
                    to="/register"
                    style={{
                      ...styles.getStartedBtn,
                      display: 'block',
                      textAlign: 'center',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  >
                    Get Started
                  </Link>
                </div>
              </>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
