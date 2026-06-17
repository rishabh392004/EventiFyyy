import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, ArrowRight, CalendarRange, Shield } from 'lucide-react';
import InputField from '../components/InputField.jsx';

const Register = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('userInfo', JSON.stringify(data));
      onRegisterSuccess(data);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    const pw = formData.password;
    if (!pw) return { level: 0, text: '', color: 'transparent' };
    if (pw.length < 6) return { level: 1, text: 'Weak', color: 'var(--error-color)' };
    if (pw.length < 10) return { level: 2, text: 'Fair', color: '#f59e0b' };
    if (/[A-Z]/.test(pw) && /[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw)) {
      return { level: 4, text: 'Strong', color: 'var(--success-color)' };
    }
    return { level: 3, text: 'Good', color: 'var(--secondary-color)' };
  };

  const strength = getPasswordStrength();

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
          marginBottom: '28px',
          position: 'relative',
          zIndex: 1,
        }}>
          <div className="auth-icon-orb">
            <CalendarRange size={26} style={{ color: 'var(--primary-color)' }} />
          </div>
          <h2 className="auth-title">Join EventiFy</h2>
          <p className="auth-subtitle">
            Create your account and start hosting amazing events
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
          gap: '16px',
          position: 'relative',
          zIndex: 1,
        }}>
          <div className="fade-in stagger-1" style={{ opacity: 0 }}>
            <InputField 
              label="Full Name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              icon={User}
            />
          </div>

          <div className="fade-in stagger-2" style={{ opacity: 0 }}>
            <InputField 
              label="Email Address"
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              icon={Mail}
            />
          </div>

          <div className="fade-in stagger-3" style={{ opacity: 0 }}>
            <InputField 
              label="Password"
              type="password"
              name="password"
              placeholder="Min 6 characters"
              value={formData.password}
              onChange={handleChange}
              icon={Lock}
            />
            {/* Password Strength Bar */}
            {formData.password && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ 
                  display: 'flex', 
                  gap: '4px', 
                  marginBottom: '4px',
                }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                      flex: 1,
                      height: '3px',
                      borderRadius: '2px',
                      background: i <= strength.level 
                        ? strength.color 
                        : 'rgba(255,255,255,0.06)',
                      transition: 'all 0.4s ease',
                      boxShadow: i <= strength.level 
                        ? `0 0 8px ${strength.color}40` 
                        : 'none',
                    }} />
                  ))}
                </div>
                <span style={{ 
                  fontSize: '0.7rem', 
                  color: strength.color,
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                }}>
                  {strength.text}
                </span>
              </div>
            )}
          </div>

          <div className="fade-in stagger-4" style={{ opacity: 0 }}>
            <InputField 
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              icon={Shield}
            />
            {/* Match indicator */}
            {formData.confirmPassword && (
              <div style={{ 
                marginTop: '6px', 
                fontSize: '0.7rem', 
                fontWeight: 500,
                color: formData.password === formData.confirmPassword 
                  ? 'var(--success-color)' 
                  : 'var(--error-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.3s ease',
              }}>
                <span>{formData.password === formData.confirmPassword ? '✓' : '✗'}</span>
                <span>
                  {formData.password === formData.confirmPassword 
                    ? 'Passwords match' 
                    : 'Passwords do not match'}
                </span>
              </div>
            )}
          </div>

          <div className="fade-in stagger-5" style={{ opacity: 0 }}>
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
                  Creating Account...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Create Account
                  <ArrowRight size={18} />
                </span>
              )}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="auth-divider fade-in stagger-5" style={{ opacity: 0 }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            or
          </span>
        </div>

        {/* Footer */}
        <div className="fade-in stagger-6" style={{ 
          opacity: 0,
          textAlign: 'center', 
          fontSize: '0.88rem', 
          color: 'var(--text-secondary)',
          position: 'relative',
          zIndex: 1,
        }}>
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
