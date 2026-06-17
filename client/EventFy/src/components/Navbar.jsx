import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CalendarRange, PlusCircle, LogOut, User, Sparkles } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Scroll-aware glass effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <header style={{
      padding: '16px 20px 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(-30px)',
      transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      <nav className="navbar-glass" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '10px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: scrolled 
          ? '1px solid rgba(139, 92, 246, 0.08)' 
          : '1px solid rgba(255, 255, 255, 0.04)',
        transition: 'all 0.5s ease',
      }}>
        {/* ===== BRAND LOGO ===== */}
        <Link to="/" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          textDecoration: 'none', 
          color: '#fff',
        }}>
          <div className="logo-icon-wrapper">
            <CalendarRange size={20} style={{ color: 'var(--primary-color)' }} />
          </div>
          <span className="logo-text">EventiFy</span>
        </Link>

        {/* ===== NAV ACTIONS ===== */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <>
              {/* User Pill */}
              <div className="nav-user-pill">
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#fff',
                  flexShrink: 0,
                }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span style={{ 
                  color: 'var(--text-secondary)', 
                  fontSize: '0.85rem',
                  whiteSpace: 'nowrap',
                }}>
                  {user.name}
                </span>
              </div>

              {/* Create Event Button */}
              <Link 
                to="/create" 
                className="btn btn-cyan" 
                style={{ 
                  padding: '8px 16px', 
                  borderRadius: '10px', 
                  fontSize: '0.82rem',
                  gap: '6px',
                }}
              >
                <PlusCircle size={15} />
                <span>Create</span>
              </Link>

              {/* Logout Button */}
              <button 
                onClick={handleLogoutClick} 
                className="btn btn-secondary" 
                style={{ 
                  padding: '8px 10px', 
                  borderRadius: '10px',
                }}
              >
                <LogOut size={16} style={{ color: 'var(--error-color)' }} />
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className="btn btn-primary" 
              style={{ 
                padding: '9px 20px', 
                borderRadius: '10px', 
                fontSize: '0.85rem',
                gap: '6px',
              }}
            >
              <Sparkles size={15} />
              <span>Get Started</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
