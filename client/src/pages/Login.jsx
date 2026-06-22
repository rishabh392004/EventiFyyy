import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { animateFormEntrance } from '../utils/gsapAnimations';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    if (formRef.current) {
      animateFormEntrance(formRef.current);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    wrapper: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '2rem',
    },
    blobOne: {
      position: 'absolute',
      width: '420px',
      height: '420px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, hsla(var(--primary), 0.18) 0%, transparent 70%)',
      top: '-120px',
      left: '-100px',
      filter: 'blur(80px)',
      pointerEvents: 'none',
      zIndex: 0,
    },
    blobTwo: {
      position: 'absolute',
      width: '360px',
      height: '360px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, hsla(var(--accent), 0.15) 0%, transparent 70%)',
      bottom: '-80px',
      right: '-60px',
      filter: 'blur(90px)',
      pointerEvents: 'none',
      zIndex: 0,
    },
    blobThree: {
      position: 'absolute',
      width: '200px',
      height: '200px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, hsla(var(--secondary), 0.12) 0%, transparent 70%)',
      top: '40%',
      right: '15%',
      filter: 'blur(60px)',
      pointerEvents: 'none',
      zIndex: 0,
    },
    spinRing: {
      position: 'absolute',
      width: '90px',
      height: '90px',
      borderRadius: '50%',
      border: '2px solid hsla(var(--primary), 0.15)',
      top: '12%',
      right: '18%',
      animation: 'spinSlow 18s linear infinite',
      pointerEvents: 'none',
      zIndex: 0,
    },
    spinRingInner: {
      position: 'absolute',
      width: '52px',
      height: '52px',
      borderRadius: '50%',
      border: '1.5px solid hsla(var(--accent), 0.12)',
      bottom: '15%',
      left: '12%',
      animation: 'spinSlow 24s linear infinite reverse',
      pointerEvents: 'none',
      zIndex: 0,
    },
    card: {
      width: '100%',
      maxWidth: '480px',
      position: 'relative',
      zIndex: 1,
    },
    cardInner: {
      background: 'var(--surface-glass)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: '1px solid hsl(var(--border))',
      borderRadius: 'var(--radius-lg)',
      padding: '3rem 2.5rem 2.5rem',
      boxShadow: 'var(--shadow-lg)',
    },
    title: {
      fontSize: '2rem',
      fontWeight: 700,
      color: 'hsl(var(--text-primary))',
      marginBottom: '0.5rem',
      letterSpacing: '-0.02em',
    },
    subtitle: {
      fontSize: '0.95rem',
      color: 'hsl(var(--text-muted))',
      marginBottom: '2rem',
      lineHeight: 1.5,
    },
    errorBox: {
      background: 'hsla(var(--error) / 0.08)',
      border: '1px solid hsla(var(--error) / 0.2)',
      borderRadius: 'var(--radius-md)',
      padding: '0.85rem 1rem',
      marginBottom: '1.5rem',
      color: 'hsl(var(--error))',
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
    },
    submitBtn: {
      marginTop: '0.5rem',
      width: '100%',
      padding: '0.85rem 1.5rem',
      fontSize: '0.95rem',
      fontWeight: 600,
      cursor: loading ? 'not-allowed' : 'pointer',
      opacity: loading ? 0.7 : 1,
      transition: 'var(--transition-fast)',
    },
    footer: {
      textAlign: 'center',
      marginTop: '1.75rem',
      paddingTop: '1.5rem',
      borderTop: '1px solid hsla(var(--border), 0.5)',
      fontSize: '0.9rem',
      color: 'hsl(var(--text-muted))',
    },
    footerLink: {
      color: 'hsl(var(--primary))',
      textDecoration: 'none',
      fontWeight: 600,
      transition: 'var(--transition-fast)',
    },
  };

  return (
    <div style={styles.wrapper}>
      <style>{`
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={styles.blobOne} className="glow-blob" />
      <div style={styles.blobTwo} className="glow-blob" />
      <div style={styles.blobThree} className="glow-blob" />
      <div style={styles.spinRing} />
      <div style={styles.spinRingInner} />

      <div style={styles.card} ref={formRef}>
        <div style={styles.cardInner} className="glass-panel">
          <h1 style={styles.title}>
            Welcome <span className="gradient-text">Back</span>
          </h1>
          <p style={styles.subtitle}>
            Sign in to your account and continue managing your events.
          </p>

          {error && <div style={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <input
                className="form-input"
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <input
                className="form-input"
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={styles.footer}>
            New here?{' '}
            <Link to="/register" style={styles.footerLink}>
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
