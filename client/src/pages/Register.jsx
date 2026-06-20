import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register user. Email may be already taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Decorative Blur Blobs */}
      <div className="glow-blob" style={{ ...styles.blob, top: '10%', right: '10%', width: '400px', height: '400px', background: 'hsl(var(--primary))' }}></div>
      <div className="glow-blob" style={{ ...styles.blob, bottom: '10%', left: '10%', width: '350px', height: '350px', background: 'hsl(var(--secondary))' }}></div>

      <div className="glass-panel" style={styles.card}>
        <h2 style={styles.title}>Join <span className="gradient-text">EventiFy</span></h2>
        <p style={styles.subtitle}>Sign up to search, create, and join events</p>

        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={styles.btn} disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account? <Link to="/login" style={styles.footerLink}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '85vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '24px',
    position: 'relative',
  },
  blob: {
    opacity: 0.08,
  },
  card: {
    width: '100%',
    maxWidth: '450px',
    padding: '40px 32px',
    background: 'rgba(15, 20, 35, 0.55)',
  },
  title: {
    fontSize: '2.2rem',
    marginBottom: '8px',
    textAlign: 'center',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    color: 'hsl(var(--text-secondary))',
    fontSize: '0.95rem',
    marginBottom: '32px',
    textAlign: 'center',
  },
  errorAlert: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid hsl(var(--error))',
    color: 'hsl(var(--error))',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '0.9rem',
    marginBottom: '24px',
    lineHeight: 1.4,
  },
  btn: {
    width: '100%',
    padding: '14px',
  },
  footerText: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '0.9rem',
    color: 'hsl(var(--text-secondary))',
  },
  footerLink: {
    color: 'hsl(var(--primary))',
    fontWeight: '600',
    textDecoration: 'none',
  },
};

export default Register;
