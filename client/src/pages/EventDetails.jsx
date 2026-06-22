import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { animatePageEnter, animateBlobs } from '../utils/gsapAnimations';

const getCategoryGradient = (category) => {
  const c = (category || 'Other').toLowerCase();
  if (c.includes('music')) return 'linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)';
  if (c.includes('tech')) return 'linear-gradient(135deg, #8EC5FC 0%, #E0C3FC 100%)';
  if (c.includes('art')) return 'linear-gradient(135deg, #FD1D1D 0%, #FCB045 100%)';
  if (c.includes('sports')) return 'linear-gradient(135deg, #85FFBD 0%, #FFFB7D 100%)';
  if (c.includes('food')) return 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)';
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
    maxWidth: 800,
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    color: 'hsl(220 16% 36%)',
    fontSize: '0.9rem',
    fontWeight: 500,
    marginBottom: 28,
    transition: 'color var(--transition-fast)',
  },
  
  /* ── Ticket details card ── */
  card: {
    position: 'relative',
    background: 'var(--surface-glass)',
    border: '1.5px solid hsl(var(--border))',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    overflow: 'visible !important',
  },
  visualCover: {
    height: 160,
    borderTopLeftRadius: 'calc(var(--radius-lg) - 1.5px)',
    borderTopRightRadius: 'calc(var(--radius-lg) - 1.5px)',
    position: 'relative',
    overflow: 'hidden',
    borderBottom: '1.5px solid hsl(var(--border))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  visualCoverText: {
    fontSize: '2.5rem',
    fontFamily: 'var(--font-display)',
    fontWeight: 900,
    letterSpacing: '0.15em',
    color: '#fff',
    textShadow: '0 4px 12px rgba(0,0,0,0.12)',
    textTransform: 'uppercase',
    opacity: 0.95,
  },
  
  /* Ticket Side Notches */
  cardNotchLeft: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: 'hsl(var(--bg-primary))',
    left: -13,
    top: '55%',
    borderRight: '1.5px solid hsl(var(--border))',
    zIndex: 3,
  },
  cardNotchRight: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: 'hsl(var(--bg-primary))',
    right: -13,
    top: '55%',
    borderLeft: '1.5px solid hsl(var(--border))',
    zIndex: 3,
  },
  cardDivider: {
    position: 'absolute',
    top: 'calc(55% + 11px)',
    left: 18,
    right: 18,
    height: 1,
    borderTop: '2px dashed hsl(var(--border))',
    zIndex: 2,
  },

  cardInnerTop: {
    padding: '40px 40px 32px',
  },
  cardInnerBottom: {
    padding: '32px 40px 40px',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  categoryBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 16px',
    borderRadius: 50,
    background: 'hsl(var(--primary-glow))',
    color: 'hsl(var(--primary))',
    fontSize: '0.8rem',
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    border: '1px solid hsl(var(--primary) / 0.25)',
  },
  dateLabel: {
    fontSize: '0.9rem',
    color: 'hsl(var(--text-muted))',
    fontWeight: 600,
  },
  title: {
    fontSize: '2.8rem',
    lineHeight: 1.15,
    marginBottom: 24,
    fontWeight: 800,
    letterSpacing: '-0.04em',
    color: 'hsl(var(--text-primary))',
  },
  hostSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    borderBottom: '1px solid hsl(var(--border))',
    paddingBottom: 24,
    marginBottom: 32,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    color: '#fff',
    fontSize: '1.15rem',
    boxShadow: '0 0 20px hsla(var(--primary) / 0.25)',
  },
  hostInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  hostLabel: {
    fontSize: '0.72rem',
    color: 'hsl(var(--text-muted))',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: 600,
  },
  hostName: {
    fontSize: '0.95rem',
    color: 'hsl(var(--text-primary))',
    fontWeight: 600,
  },
  sectionTitle: {
    fontSize: '1.05rem',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'hsl(var(--accent))',
    marginBottom: 12,
    fontWeight: 700,
  },
  description: {
    color: 'hsl(var(--text-secondary))',
    fontSize: '1.05rem',
    lineHeight: 1.7,
    marginBottom: 40,
    whiteSpace: 'pre-wrap',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 20,
    marginBottom: 40,
  },
  infoCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    background: 'hsl(var(--bg-secondary))',
    padding: '16px 20px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid hsl(var(--border))',
  },
  infoIcon: {
    fontSize: '1.8rem',
  },
  infoLabel: {
    fontSize: '0.72rem',
    color: 'hsl(var(--text-muted))',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: 600,
  },
  infoValue: {
    fontSize: '0.98rem',
    color: 'hsl(var(--text-primary))',
    fontWeight: 600,
    marginTop: 2,
  },
  actionRow: {
    display: 'flex',
    gap: 16,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  bookBtn: {
    flex: 1,
    padding: '14px 28px',
    fontSize: '1rem',
    borderRadius: 'var(--radius-sm)',
    minWidth: 200,
  },
  editBtn: {
    padding: '14px 28px',
    fontSize: '1rem',
    borderRadius: 'var(--radius-sm)',
  },
  deleteBtn: {
    padding: '14px 28px',
    fontSize: '1rem',
    borderRadius: 'var(--radius-sm)',
  },
  loginBanner: {
    width: '100%',
    padding: '28px',
    textAlign: 'center',
    background: 'hsl(var(--bg-secondary))',
    border: '1.5px solid hsl(var(--border))',
    borderRadius: 'var(--radius-md)',
  },
  loginBannerText: {
    fontSize: '0.98rem',
    color: 'hsl(var(--text-secondary))',
    marginBottom: 16,
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

  /* ── States ── */
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
  },
  spinner: {
    width: 44,
    height: 44,
    border: '3px solid hsl(var(--border))',
    borderTopColor: 'hsl(var(--primary))',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    padding: '24px',
  },
  errorCard: {
    maxWidth: 450,
    width: '100%',
    padding: '36px',
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: '1.4rem',
    color: 'hsl(var(--error))',
    marginBottom: 10,
  },
  errorText: {
    color: 'hsl(var(--text-secondary))',
    fontSize: '0.95rem',
    marginBottom: 24,
  },
};

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const pageRef = useRef(null);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /* ── Edit State ── */
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editDate, setEditDate] = useState('');

  /* ── Fetch Event Details ── */
  const fetchEvent = async () => {
    try {
      const { data } = await api.get(`/events/${id}`);
      setEvent(data);
      // Pre-fill edit forms
      setEditTitle(data.title || '');
      setEditDescription(data.description || '');
      setEditCategory(data.category || '');
      setEditLocation(data.location || '');
      if (data.date) {
        // Convert ISO format to datetime-local friendly format (YYYY-MM-DDTHH:MM)
        const d = new Date(data.date);
        const offset = d.getTimezoneOffset();
        const local = new Date(d.getTime() - offset * 60 * 1000);
        setEditDate(local.toISOString().slice(0, 16));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not retrieve event details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  /* ── Page Animations ── */
  useEffect(() => {
    if (!loading && event) {
      animatePageEnter(pageRef);
      animateBlobs(pageRef);
    }
  }, [loading, event]);

  /* ── Handlers ── */
  const handleRSVP = async () => {
    if (!user) {
      alert('You must be logged in to book a ticket.');
      return;
    }
    try {
      const { data } = await api.post(`/events/${id}/rsvp`);
      setEvent((prev) => ({ ...prev, attendees: data.attendees }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update RSVP.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`/events/${id}`);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete event.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(`/events/${id}`, {
        title: editTitle,
        description: editDescription,
        category: editCategory,
        location: editLocation,
        date: editDate,
      });
      // Fetch latest data to verify fully updated joins
      await fetchEvent();
      setIsEditing(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update event details.');
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div style={styles.errorContainer}>
        <div className="glass-panel" style={styles.errorCard}>
          <h3 style={styles.errorTitle}>Event Not Found</h3>
          <p style={styles.errorText}>{error || 'The requested event could not be found.'}</p>
          <Link to="/" className="btn btn-primary">
            Back to Discover
          </Link>
        </div>
      </div>
    );
  }

  const isAttendee = user && event.attendees?.some((userId) => userId === user._id);
  const isOrganizer =
    user &&
    event.organizer &&
    (event.organizer._id === user._id || event.organizer === user._id);

  return (
    <div ref={pageRef} style={styles.page}>
      <div className="glow-blob" style={styles.blob1} />
      <div className="glow-blob" style={styles.blob2} />

      <div style={styles.container}>
        <Link to="/" style={styles.backLink}>
          ← Back to Discover
        </Link>

        <div style={styles.card}>
          {/* Circular Cutouts & Dashed Divider */}
          <div style={styles.cardNotchLeft} />
          <div style={styles.cardNotchRight} />
          <div style={styles.cardDivider} />

          {/* Ticket Header Graphic */}
          <div
            style={{
              ...styles.visualCover,
              background: getCategoryGradient(event.category),
            }}
          >
            <span style={styles.visualCoverText}>
              {isEditing ? 'Editing Pass' : event.category || 'Access Pass'}
            </span>
          </div>

          {isEditing ? (
            /* ── EDIT MODE FORM ── */
            <form onSubmit={handleUpdate} style={{ padding: 40 }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 24, letterSpacing: '-0.02em' }}>
                Edit Experience Details
              </h2>
              
              <div className="form-group">
                <label className="form-label">Event Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="form-input"
                  style={{ minHeight: 120, resize: 'vertical' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="form-group">
                  <label className="form-label">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 32 }}>
                <label className="form-label">Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            /* ── VIEW MODE DETAILS ── */
            <>
              {/* Top segment */}
              <div style={styles.cardInnerTop}>
                <div style={styles.headerRow}>
                  <span style={styles.categoryBadge}>{event.category || 'Event'}</span>
                  <span style={styles.dateLabel}>
                    {new Date(event.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <h1 style={styles.title} className="gradient-text">
                  {event.title}
                </h1>

                <div style={styles.hostSection}>
                  <div style={styles.avatar}>
                    {event.organizer?.name ? event.organizer.name[0].toUpperCase() : 'U'}
                  </div>
                  <div style={styles.hostInfo}>
                    <span style={styles.hostLabel}>Hosted by</span>
                    <span style={styles.hostName}>{event.organizer?.name || 'Organizer'}</span>
                  </div>
                </div>

                <div>
                  <h3 style={styles.sectionTitle}>About the Event</h3>
                  <p style={styles.description}>{event.description}</p>
                </div>
              </div>

              {/* Bottom segment */}
              <div style={styles.cardInnerBottom}>
                <div style={styles.infoGrid}>
                  <div style={styles.infoCard}>
                    <span style={styles.infoIcon}>📍</span>
                    <div>
                      <div style={styles.infoLabel}>Location</div>
                      <div style={styles.infoValue}>{event.location || 'TBA'}</div>
                    </div>
                  </div>
                  <div style={styles.infoCard}>
                    <span style={styles.infoIcon}>👥</span>
                    <div>
                      <div style={styles.infoLabel}>Attendance</div>
                      <div style={styles.infoValue}>{event.attendees?.length || 0} registered</div>
                    </div>
                  </div>
                </div>

                <div style={styles.actionRow}>
                  {user ? (
                    <>
                      <button
                        onClick={handleRSVP}
                        className={`btn ${isAttendee ? 'btn-secondary' : 'btn-primary'}`}
                        style={styles.bookBtn}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        {isAttendee ? '✓ Cancel Ticket Reservation' : '🎟 Book Ticket (RSVP)'}
                      </button>

                      {isOrganizer && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="btn btn-secondary"
                          style={styles.editBtn}
                        >
                          Edit Details
                        </button>
                      )}

                      {isOrganizer && (
                        <button
                          onClick={handleDelete}
                          className="btn btn-danger"
                          style={styles.deleteBtn}
                        >
                          Delete Event
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="glass-panel" style={styles.loginBanner}>
                      <p style={styles.loginBannerText}>
                        Reserve your ticket and connect with other attendees.
                      </p>
                      <Link to="/login" className="btn btn-primary" style={{ padding: '10px 24px' }}>
                        Log in to Book Ticket
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
