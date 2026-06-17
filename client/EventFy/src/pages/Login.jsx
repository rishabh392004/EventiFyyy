import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle, ArrowRight, Zap } from 'lucide-react';
import InputField from '../components/InputField.jsx';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password');
      }

      localStorage.setItem('userInfo', JSON.stringify(data));
      onLoginSuccess(data);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: 'calc(100vh - 100px)', 
      padding: '20px',
      position: 'relative',
    }}>
      {/* Ambient Background Orbs */}
      <div className="ambient-bg">
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        <div className="ambient-orb ambient-orb-3" />
      </div>

      {/* Auth Card */}
      <div className="auth-card" style={{ 
        width: '100%', 
        maxWidth: '440px', 
        padding: '40px 32px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '12px', 
          marginBottom: '32px',
          position: 'relative',
          zIndex: 1,
        }}>
          <div className="auth-icon-orb">
            <Zap size={26} style={{ color: 'var(--primary-color)' }} />
          </div>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">
            Sign in to discover and manage your events
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="error-banner">
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '18px',
          position: 'relative',
          zIndex: 1,
        }}>
          <div className="fade-in stagger-1" style={{ opacity: 0 }}>
            <InputField 
              label="Email Address"
              type="email"
              name="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
            />
          </div>
          
          <div className="fade-in stagger-2" style={{ opacity: 0 }}>
            <InputField 
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
            />
          </div>

          <div className="fade-in stagger-3" style={{ opacity: 0 }}>
            <button 
              type="submit" 
              disabled={loading}
              className="submit-btn"
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid rgba(255,255,255,0.2)',
                    borderTop: '2px solid #fff',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    display: 'inline-block',
                  }} />
                  Signing In...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Sign In
                  <ArrowRight size={18} />
                </span>
              )}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="auth-divider fade-in stagger-4" style={{ opacity: 0 }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            or
          </span>
        </div>

        {/* Footer */}
        <div className="fade-in stagger-5" style={{ 
          opacity: 0,
          textAlign: 'center', 
          fontSize: '0.88rem', 
          color: 'var(--text-secondary)',
          position: 'relative',
          zIndex: 1,
        }}>
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
