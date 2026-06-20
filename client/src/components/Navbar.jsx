import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav} className="glass-panel">
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          Eventi<span style={styles.logoAccent}>Fy</span>
        </Link>
        <div style={styles.links}>
          <Link to="/" style={styles.link}>Events</Link>
          {user ? (
            <>
              <Link to="/create-event" style={styles.link}>Create Event</Link>
              <div style={styles.userSection}>
                <span style={styles.username}>Hi, {user.name}</span>
                <button onClick={handleLogout} className="btn btn-secondary" style={styles.logoutBtn}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={styles.registerBtn}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    position: 'sticky',
    top: '16px',
    left: '24px',
    right: '24px',
    margin: '16px 24px',
    padding: '12px 24px',
    zIndex: 100,
    borderRadius: '16px',
    background: 'rgba(15, 20, 35, 0.65)',
    backdropFilter: 'blur(20px)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '1.6rem',
    fontWeight: '800',
    color: '#fff',
    textDecoration: 'none',
    letterSpacing: '-0.03em',
  },
  logoAccent: {
    color: 'hsl(var(--primary))',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  link: {
    color: 'hsl(var(--text-secondary))',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '0.95rem',
    transition: 'color 0.2s ease',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    borderLeft: '1px solid hsl(var(--border))',
    paddingLeft: '16px',
  },
  username: {
    color: 'hsl(var(--text-primary))',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  logoutBtn: {
    padding: '8px 16px',
    fontSize: '0.85rem',
  },
  registerBtn: {
    padding: '8px 18px',
    fontSize: '0.85rem',
  },
};

export default Navbar;
