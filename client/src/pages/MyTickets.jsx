import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { animatePageEnter, animateBlobs } from '../utils/gsapAnimations';

const getCategoryGradient = (category) => {
  const c = (category || 'Other').toLowerCase();
  if (c.includes('music')) return 'linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)';
  if (c.includes('tech')) return 'linear-gradient(135deg, #8EC5FC 0%, #E0C3FC 100%)';
  if (c.includes('art')) return 'linear-gradient(135deg, #FD1D1D 0%, #FCB045 100%)';
  if (c.includes('sports')) return 'linear-gradient(135deg, #85FFBD 0%, #FFFB7D 100%)';
  if (c.includes('food')) return 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)';
  if (c.includes('business')) return 'linear-gradient(135deg, #E0C3FC 0%, #8EC5FC 100%)';
  if (c.includes('health')) return 'linear-gradient(135deg, #E2F0CB 0%, #B5EAD7 100%)';
  if (c.includes('education')) return 'linear-gradient(135deg, #D4FC79 0%, #96E6A1 100%)';
  if (c.includes('travel')) return 'linear-gradient(135deg, #A1C4FD 0%, #C2E9FB 100%)';
  return 'linear-gradient(135deg, #FDFCFB 0%, #E2D1C3 100%)';
};

const styles = {
  page: {
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
    padding: '120px 24px 80px',
  },
  container: {
    maxWidth: 1280,
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
  },
  titleSection: {
    marginBottom: 48,
    textAlign: 'center',
  },
  title: {
    fontSize: '2.8rem',
    fontWeight: 800,
    marginBottom: 10,
    letterSpacing: '-0.04em',
  },
  subtitle: {
    fontSize: '1.05rem',
    color: 'hsl(220 16% 36%)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: 28,
  },

  /* ── Ticket Card Layout ── */
  card: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 320,
  },
  visualCoverText: {
    fontSize: '1.4rem',
    fontFamily: 'var(--font-display)',
    fontWeight: 900,
    letterSpacing: '0.1em',
    color: '#fff',
    textShadow: '0 2px 8px rgba(0,0,0,0.12)',
    textTransform: 'uppercase',
    opacity: 0.85,
  },
  cardInnerTop: {
    padding: '20px 24px 12px',
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column',
  },
  cardInnerBottom: {
    padding: '12px 24px 20px',
    flex: '0 0 auto',
    marginTop: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    padding: '4px 12px',
    borderRadius: 50,
    background: 'hsl(var(--primary-glow))',
    color: 'hsl(var(--primary))',
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    border: '1px solid hsl(var(--primary) / 0.2)',
  },
  dateLabel: {
    fontSize: '0.8rem',
    color: 'hsl(220 12% 54%)',
    fontWeight: 500,
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    marginBottom: 8,
    color: 'hsl(var(--text-primary))',
  },
  metaSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    fontSize: '0.85rem',
    color: 'hsl(220 15% 36%)',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  cardFooter: {
    marginTop: 12,
  },
  viewBtn: {
    width: '100%',
    textAlign: 'center',
    fontSize: '0.85rem',
    padding: '10px 20px',
    borderRadius: 'var(--radius-sm)',
    border: '1.5px solid hsl(var(--border))',
    background: 'transparent',
    color: 'hsl(var(--text-primary))',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.25s ease',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 24px',
    background: 'var(--surface-glass)',
    border: '1px dashed hsl(var(--border))',
    borderRadius: 'var(--radius-md)',
    color: 'hsl(220 12% 54%)',
    maxWidth: 600,
    margin: '0 auto',
  },
  emptyText: {
    fontSize: '0.95rem',
    marginBottom: 16,
  },

  /* ── Blobs ── */
  blob1: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: '50%',
    background: 'hsl(198 90% 50% / 0.06)',
    filter: 'blur(130px)',
    top: 50,
    left: -100,
    pointerEvents: 'none',
    zIndex: 0,
  },
  blob2: {
    position: 'absolute',
    width: 440,
    height: 440,
    borderRadius: '50%',
    background: 'hsl(42 90% 62% / 0.05)',
    filter: 'blur(120px)',
    bottom: 100,
    right: -100,
    pointerEvents: 'none',
    zIndex: 0,
  },

  /* ── Loader ── */
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
  },
  spinner: {
    width: 40,
    height: 40,
    border: '3px solid hsl(var(--border))',
    borderTopColor: 'hsl(var(--primary))',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
};

function MyTickets() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const pageRef = useRef(null);

  const [attendingEvents, setAttendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchMyTickets = async () => {
      try {
        const { data } = await api.get('/events');
        // Filter events attended by user where user is NOT the organizer
        const attending = data.filter(
          (event) =>
            event.attendees?.some((id) => id === user._id) &&
            event.organizer?._id !== user._id &&
            event.organizer !== user._id
        );
        setAttendingEvents(attending);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyTickets();
  }, [user, navigate]);

  useEffect(() => {
    if (!loading) {
      animatePageEnter(pageRef);
      animateBlobs(pageRef);
    }
  }, [loading]);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div ref={pageRef} style={styles.page}>
      <div className="glow-blob" style={styles.blob1} />
      <div className="glow-blob" style={styles.blob2} />

      <div style={styles.container}>
        <div style={styles.titleSection}>
          <h1 style={styles.title} className="gradient-text">
            My Booking Tickets
          </h1>
          <p style={styles.subtitle}>
            Your registered passes and upcoming experiences in Elysian.
          </p>
        </div>

        {attendingEvents.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>You don't have any booked ticket passes yet.</p>
            <Link to="/" className="btn btn-primary">
              Discover Experiences
            </Link>
          </div>
        ) : (
          <div style={styles.grid}>
            {attendingEvents.map((event) => (
              <div key={event._id} className="ticket-card" style={styles.card}>
                <div
                  className="ticket-visual-header"
                  style={{ background: getCategoryGradient(event.category), height: 75 }}
                >
                  <span style={styles.visualCoverText}>{event.category || 'Ticket'}</span>
                </div>
                <div className="ticket-divider" style={{ top: 'calc(65% + 4px)' }} />

                <div style={styles.cardInnerTop}>
                  <div style={styles.cardHeader}>
                    <span style={styles.categoryBadge}>{event.category || 'Event'}</span>
                    <span style={styles.dateLabel}>{formatDate(event.date)}</span>
                  </div>
                  <h3 style={styles.cardTitle}>{event.title}</h3>
                </div>

                <div style={styles.cardInnerBottom}>
                  <div style={styles.metaSection}>
                    <div style={styles.metaItem}>📍 {event.location || 'TBA'}</div>
                    <div style={styles.metaItem}>
                      👤 {event.organizer?.name || 'Organizer'}
                    </div>
                  </div>
                  <div style={styles.cardFooter}>
                    <Link
                      to={`/event/${event._id}`}
                      style={styles.viewBtn}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'hsl(var(--primary))';
                        e.currentTarget.style.borderColor = 'hsl(var(--primary))';
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = 'hsl(var(--border))';
                        e.currentTarget.style.color = 'hsl(var(--text-primary))';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      View Ticket Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTickets;
