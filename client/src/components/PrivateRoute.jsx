import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const keyframesStyle = `
  @keyframes privateroute-orbit {
    0% { transform: rotate(0deg) translateX(28px) rotate(0deg); }
    100% { transform: rotate(360deg) translateX(28px) rotate(-360deg); }
  }

  @keyframes privateroute-pulse {
    0%, 100% { transform: scale(1); opacity: 0.85; box-shadow: 0 0 12px hsla(var(--primary) / 0.4); }
    50% { transform: scale(1.35); opacity: 1; box-shadow: 0 0 28px hsla(var(--primary) / 0.7); }
  }

  @keyframes privateroute-shimmer {
    0% { opacity: 0.15; }
    50% { opacity: 0.35; }
    100% { opacity: 0.15; }
  }
`;

const styles = {
  wrapper: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'hsl(var(--bg-primary))',
    zIndex: 9999,
  },
  backdrop: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse at center, hsla(var(--primary) / 0.06) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  spinnerContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitRing: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: '50%',
    border: '1px solid hsla(var(--border) / 0.15)',
    animation: 'privateroute-shimmer 2s ease-in-out infinite',
  },
  centerDot: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))',
    boxShadow: '0 0 16px hsla(var(--primary) / 0.5)',
    animation: 'privateroute-pulse 1.8s ease-in-out infinite',
    position: 'relative',
    zIndex: 2,
  },
  orbitingDot: (index) => {
    const colors = [
      'hsl(var(--primary))',
      'hsl(var(--accent))',
      'hsl(var(--secondary))',
    ];
    const sizes = [7, 6, 5];
    const durations = ['1.6s', '2.2s', '3s'];
    const delays = ['0s', '-0.55s', '-1.1s'];

    return {
      position: 'absolute',
      width: sizes[index],
      height: sizes[index],
      borderRadius: '50%',
      background: colors[index],
      boxShadow: `0 0 10px ${colors[index]}`,
      top: '50%',
      left: '50%',
      marginTop: -(sizes[index] / 2),
      marginLeft: -(sizes[index] / 2),
      animation: `privateroute-orbit ${durations[index]} linear infinite`,
      animationDelay: delays[index],
      zIndex: 3,
    };
  },
  loadingText: {
    marginTop: 32,
    fontSize: '0.85rem',
    fontWeight: 500,
    color: 'hsl(var(--text-muted))',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
};

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <>
        <style>{keyframesStyle}</style>
        <div style={styles.wrapper}>
          <div style={styles.backdrop} />
          <div style={styles.spinnerContainer}>
            <div style={styles.orbitRing} />
            <div style={styles.centerDot} />
            <div style={styles.orbitingDot(0)} />
            <div style={styles.orbitingDot(1)} />
            <div style={styles.orbitingDot(2)} />
          </div>
          <span style={styles.loadingText}>Loading</span>
        </div>
      </>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
