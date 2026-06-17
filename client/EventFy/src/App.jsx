import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 1. Import common layout components
import Navbar from './components/Navbar.jsx';

// 2. Import page screens
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Load user session on startup
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setCheckingAuth(false);
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  // Premium loading screen
  if (checkingAuth) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        background: '#050208',
        gap: '24px',
      }}>
        {/* Animated spinner */}
        <div style={{ position: 'relative', width: '50px', height: '50px' }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            border: '2px solid rgba(139, 92, 246, 0.08)',
            borderTop: '2px solid var(--primary-color)',
            borderRadius: '50%',
            animation: 'spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite',
          }} />
          <div style={{
            position: 'absolute',
            inset: '6px',
            border: '2px solid rgba(236, 72, 153, 0.08)',
            borderBottom: '2px solid var(--accent-color)',
            borderRadius: '50%',
            animation: 'spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite reverse',
          }} />
        </div>
        <span style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '0.85rem',
          color: 'rgba(148, 163, 184, 0.6)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}>
          Loading
        </span>
      </div>
    );
  }

  return (
    <Router>
      <div className="layout-container">
        {/* Render Navbar */}
        <Navbar user={user} onLogout={handleLogout} />

        <main className="main-content">
          <Routes>
            {/* Homepage (Dashboard) */}
            <Route 
              path="/" 
              element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
            />
            
            {/* Login Route */}
            <Route 
              path="/login" 
              element={user ? <Navigate to="/" /> : <Login onLoginSuccess={(userData) => setUser(userData)} />} 
            />
            
            {/* Register Route */}
            <Route 
              path="/register" 
              element={user ? <Navigate to="/" /> : <Register onRegisterSuccess={(userData) => setUser(userData)} />} 
            />

            {/* Catch-all Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
