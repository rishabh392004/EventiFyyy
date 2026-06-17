import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
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
        headers: {
          'Content-Type': 'application/json',
        },
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
  }; // <--- 1. We closed the handleSubmit function here!

  // 2. Now the Login component itself returns the JSX
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 120px)', padding: '20px' }}>
      <div className="glass" style={{ width: '100%', maxWidth: '420px', padding: '30px 24px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.45)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.6rem', color: '#fff' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Login to explore experiences</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="glass" style={{ background: 'rgba(239, 68, 68, 0.08)', borderColor: 'rgba(239, 68, 68, 0.2)', padding: '12px', borderRadius: '8px', marginBottom: '20px', color: '#fca5a5', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Email InputField */}
          <InputField 
            label="Email Address"
            type="email"
            name="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={Mail}
          />
          
          {/* Password InputField */}
          <InputField 
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={Lock}
          />

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary" 
            style={{ width: '100%', padding: '12px', marginTop: '8px', fontSize: '1rem' }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;