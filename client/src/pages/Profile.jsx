import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { animatePageEnter, animateBlobs } from '../utils/gsapAnimations';

const styles = {
  page: {
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
    padding: '120px 24px 80px',
  },
  container: {
    maxWidth: 960,
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.2fr',
    gap: 40,
    alignItems: 'start',
  },
  card: {
    padding: 32,
    background: 'var(--surface-glass)',
    border: '1.5px solid hsl(var(--border))',
    borderRadius: 'var(--radius-lg)',
  },

  /* ── User Profile Block ── */
  profileBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 28,
  },
  avatarLarge: {
    width: 96,
    height: 96,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.5rem',
    fontWeight: 700,
    color: '#fff',
    marginBottom: 16,
    boxShadow: '0 8px 24px hsla(var(--primary) / 0.2)',
    overflow: 'hidden',
    border: '2.5px solid hsl(var(--border))',
  },
  profileImgLarge: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  userName: {
    fontSize: '1.6rem',
    fontWeight: 800,
    color: 'hsl(var(--text-primary))',
    letterSpacing: '-0.02em',
  },
  userEmail: {
    fontSize: '0.9rem',
    color: 'hsl(var(--text-muted))',
    marginTop: 2,
  },

  /* ── 3D Golden Loyalty Card ── */
  loyaltyCard: {
    position: 'relative',
    width: '100%',
    height: 200,
    background: 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)',
    borderRadius: 'var(--radius-md)',
    boxShadow: '0 10px 30px rgba(186, 140, 48, 0.22), inset 0 1px 1px rgba(255,255,255,0.4)',
    padding: 24,
    color: '#3C2E11',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden',
    border: '1.5px solid #E2C974',
    marginBottom: 28,
    cursor: 'default',
    transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  loyaltyCardShine: {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '50%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
    transform: 'skewX(-25deg)',
    animation: 'shimmer 4s infinite linear',
  },
  loyaltyTier: {
    fontFamily: 'var(--font-display)',
    fontWeight: 900,
    fontSize: '1.25rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  loyaltyDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  loyaltyLabel: {
    fontSize: '0.68rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    opacity: 0.8,
  },
  loyaltyVal: {
    fontWeight: 700,
    fontSize: '0.9rem',
    fontFamily: 'var(--font-display)',
  },
  loyaltyNumber: {
    fontFamily: 'monospace',
    letterSpacing: '2px',
    fontSize: '1.05rem',
    fontWeight: 700,
  },

  /* ── Form Edit ── */
  editTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    borderBottom: '1px solid hsl(var(--border))',
    paddingBottom: 8,
    marginBottom: 16,
    color: 'hsl(var(--text-primary))',
  },

  /* ── Right side sections ── */
  statsSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    textAlign: 'center',
    padding: '16px 8px',
    background: 'var(--surface-glass)',
    border: '1px solid hsl(var(--border))',
    borderRadius: 'var(--radius-md)',
  },
  statVal: {
    fontSize: '1.8rem',
    fontWeight: 800,
    color: 'hsl(var(--primary))',
    lineHeight: 1.15,
  },
  statLabel: {
    fontSize: '0.72rem',
    color: 'hsl(var(--text-muted))',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginTop: 4,
    fontWeight: 600,
  },

  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    marginBottom: 16,
    letterSpacing: '-0.02em',
  },

  /* ── Ticket Card Layout ── */
  lastTicket: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 220,
    position: 'relative',
    background: 'var(--surface-glass)',
    border: '1.5px solid hsl(var(--border))',
    borderRadius: 'var(--radius-md)',
    padding: 24,
    overflow: 'hidden',
  },
  lastTicketHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    padding: '4px 10px',
    borderRadius: 50,
    background: 'hsl(var(--primary-glow))',
    color: 'hsl(var(--primary))',
    fontSize: '0.72rem',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  date: {
    fontSize: '0.78rem',
    color: 'hsl(var(--text-muted))',
    fontWeight: 500,
  },
  lastTicketTitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: 'hsl(var(--text-primary))',
    marginBottom: 6,
  },
  lastTicketDesc: {
    fontSize: '0.86rem',
    color: 'hsl(var(--text-secondary))',
    lineHeight: 1.5,
    marginBottom: 16,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  lastTicketFooter: {
    marginTop: 'auto',
    borderTop: '1px dashed hsl(var(--border))',
    paddingTop: 12,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.8rem',
    color: 'hsl(var(--text-muted))',
  },

  /* ── Blobs ── */
  blob1: {
    position: 'absolute',
    width: 480,
    height: 480,
    borderRadius: '50%',
    background: 'hsl(var(--primary-glow))',
    filter: 'blur(120px)',
    top: 50,
    left: '10%',
    pointerEvents: 'none',
    zIndex: 0,
  },
  blob2: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: '50%',
    background: 'hsl(var(--accent-glow))',
    filter: 'blur(120px)',
    bottom: 50,
    right: '10%',
    pointerEvents: 'none',
    zIndex: 0,
  },
};

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const pageRef = useRef(null);

  const [imageUrl, setImageUrl] = useState('');
  const [lastEvent, setLastEvent] = useState(null);
  const [stats, setStats] = useState({ hosted: 0, booked: 0, totalAttendees: 0 });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setImageUrl(user.profileImg || '');

    const fetchProfileData = async () => {
      try {
        const { data } = await api.get('/events');
        // Filter events hosted by user
        const hosted = data.filter(
          (e) => e.organizer && (e.organizer._id === user._id || e.organizer === user._id)
        );
        // Filter events attended by user
        const booked = data.filter((e) => e.attendees?.some((id) => id === user._id));

        // Total attendees across hosted events
        const attendeesCount = hosted.reduce((acc, curr) => acc + (curr.attendees?.length || 0), 0);

        setStats({
          hosted: hosted.length,
          booked: booked.length,
          totalAttendees: attendeesCount,
        });

        // Find last registered or created event (most recent by date)
        const combined = [...hosted, ...booked].sort(
          (a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
        );
        if (combined.length > 0) {
          setLastEvent(combined[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfileData();
  }, [user, navigate]);

  useEffect(() => {
    animatePageEnter(pageRef);
    animateBlobs(pageRef);
  }, []);

  const handleUpdateProfileImg = (e) => {
    e.preventDefault();
    setIsUpdating(true);

    // Mock backend profile image save: Update local storage & context user info
    const storedInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (storedInfo) {
      storedInfo.profileImg = imageUrl;
      localStorage.setItem('userInfo', JSON.stringify(storedInfo));
      // Force reload to update context auth state
      window.location.reload();
    }
    setIsUpdating(false);
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!user) return null;

  return (
    <div ref={pageRef} style={styles.page}>
      <div className="glow-blob" style={styles.blob1} />
      <div className="glow-blob" style={styles.blob2} />

      <div style={styles.container}>
        <div style={styles.layout}>
          {/* Left Column: User details & Golden loyalty card */}
          <div>
            <div className="glass-panel" style={styles.card}>
              <div style={styles.profileBlock}>
                <div style={styles.avatarLarge}>
                  {user.profileImg ? (
                    <img src={user.profileImg} alt={user.name} style={styles.profileImgLarge} />
                  ) : (
                    user.name ? user.name.charAt(0) : '?'
                  )}
                </div>
                <h2 style={styles.userName}>{user.name}</h2>
                <p style={styles.userEmail}>{user.email}</p>
              </div>

              {/* 🏆 Self-Added Feature: Elysian Golden Elite Membership Card */}
              <div
                style={styles.loyaltyCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px) rotateX(4deg) rotateY(-4deg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
                }}
              >
                <div style={styles.loyaltyCardShine} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <span style={styles.loyaltyTier}>Golden Elite</span>
                    <div style={{ fontSize: '0.62rem', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.85, marginTop: 2 }}>
                      Elysian Passholder
                    </div>
                  </div>
                  <span style={{ fontSize: '1.5rem' }}>✨</span>
                </div>

                <div style={styles.loyaltyNumber}>
                  ELYS {user._id ? user._id.slice(-8).toUpperCase() : 'PASS-2026'}
                </div>

                <div style={styles.loyaltyDetails}>
                  <div>
                    <div style={styles.loyaltyLabel}>Cardholder</div>
                    <div style={styles.loyaltyVal}>{user.name}</div>
                  </div>
                  <div>
                    <div style={styles.loyaltyLabel}>Tier Level</div>
                    <div style={styles.loyaltyVal}>LVL 2</div>
                  </div>
                </div>
              </div>

              <div style={styles.editTitle}>Update Profile Image</div>
              <form onSubmit={handleUpdateProfileImg}>
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Profile Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="form-input"
                    style={{ fontSize: '0.85rem', padding: '10px 14px' }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '10px 20px', fontSize: '0.85rem' }}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Saving...' : 'Save Picture'}
                </button>
              </form>

              <button
                onClick={handleLogoutClick}
                className="btn btn-secondary"
                style={{ width: '100%', marginTop: 16, padding: '10px 20px', fontSize: '0.85rem' }}
              >
                Logout Account
              </button>
            </div>
          </div>

          {/* Right Column: Statistics & Last Event Ticket */}
          <div>
            {/* Statistics */}
            <div style={styles.statsSection}>
              <div style={styles.statCard}>
                <div style={styles.statVal}>{stats.booked}</div>
                <div style={styles.statLabel}>Passes Booked</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statVal}>{stats.hosted}</div>
                <div style={styles.statLabel}>Hosted Events</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statVal}>{stats.totalAttendees}</div>
                <div style={styles.statLabel}>Total Audience</div>
              </div>
            </div>

            {/* Last Experience Ticket */}
            <h3 style={styles.sectionTitle}>Last Active Experience</h3>
            {lastEvent ? (
              <div style={styles.lastTicket}>
                <div style={styles.lastTicketHeader}>
                  <span style={styles.badge}>{lastEvent.category || 'Pass'}</span>
                  <span style={styles.date}>{formatDate(lastEvent.date)}</span>
                </div>
                <h4 style={styles.lastTicketTitle}>{lastEvent.title}</h4>
                <p style={styles.lastTicketDesc}>{lastEvent.description}</p>
                <div style={styles.lastTicketFooter}>
                  <span>📍 {lastEvent.location || 'TBA'}</span>
                  <Link
                    to={`/event/${lastEvent._id}`}
                    style={{ color: 'hsl(var(--accent))', fontWeight: 700 }}
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: 32, textAlign: 'center', color: 'hsl(var(--text-muted))' }}>
                <p style={{ fontSize: '0.92rem' }}>No recent event activities found.</p>
                <Link to="/" className="btn btn-primary" style={{ marginTop: 16, padding: '8px 20px', fontSize: '0.82rem' }}>
                  Explore Experiences
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
