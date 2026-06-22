import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import {
  animateHero,
  animateStaggerCards,
  animateBlobs,
} from '../utils/gsapAnimations';

/* ═══════════════════════════════════════════════════════
   DASHBOARD — ELYSIAN DISCOVER PLATFORM (Long Edition)
   ═══════════════════════════════════════════════════════ */

const CATEGORIES = [
  'All',
  'Music',
  'Tech',
  'Art',
  'Sports',
  'Food',
  'Business',
  'Health',
  'Education',
  'Travel',
  'Other',
];

const VIBE_CATEGORIES = [
  { name: 'Music', gradient: 'linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)', emoji: '🎵', desc: 'Acoustic gigs, festivals & live club vibes.' },
  { name: 'Tech', gradient: 'linear-gradient(135deg, #8EC5FC 0%, #E0C3FC 100%)', emoji: '💻', desc: 'Codeathons, keynotes & digital arts.' },
  { name: 'Art', gradient: 'linear-gradient(135deg, #FD1D1D 0%, #FCB045 100%)', emoji: '🎨', desc: 'Exhibitions, auctions & design reviews.' },
  { name: 'Food', gradient: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)', emoji: '🍹', desc: 'Pop-ups, brewery crawls & baking.' },
];

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
    paddingBottom: 100,
  },

  /* ── Blobs ── */
  blob1: {
    position: 'absolute',
    width: 600,
    height: 600,
    borderRadius: '50%',
    background: 'hsla(var(--primary) / 0.03)',
    filter: 'blur(150px)',
    top: -150,
    left: -150,
    pointerEvents: 'none',
    zIndex: 0,
  },
  blob2: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: '50%',
    background: 'hsla(var(--accent) / 0.03)',
    filter: 'blur(140px)',
    top: '30%',
    right: -100,
    pointerEvents: 'none',
    zIndex: 0,
  },
  blob3: {
    position: 'absolute',
    width: 450,
    height: 450,
    borderRadius: '50%',
    background: 'hsla(var(--secondary) / 0.02)',
    filter: 'blur(130px)',
    bottom: 100,
    left: '20%',
    pointerEvents: 'none',
    zIndex: 0,
  },

  container: {
    maxWidth: 1280,
    margin: '0 auto',
    padding: '0 24px',
    position: 'relative',
    zIndex: 1,
  },

  /* ── Hero ── */
  hero: {
    textAlign: 'center',
    paddingTop: 130,
    paddingBottom: 48,
  },
  heroTitle: {
    fontSize: '4.2rem',
    fontWeight: 900,
    lineHeight: 1.05,
    letterSpacing: '-0.05em',
    marginBottom: 18,
  },
  heroSubtitle: {
    fontSize: '1.2rem',
    color: 'hsl(var(--text-secondary))',
    maxWidth: 580,
    margin: '0 auto',
    lineHeight: 1.65,
    fontWeight: 400,
  },

  /* ── Spotlight Section ── */
  spotlightSection: {
    marginBottom: 72,
  },
  spotlightTitle: {
    fontSize: '1.6rem',
    fontWeight: 800,
    marginBottom: 24,
    letterSpacing: '-0.03em',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  spotlightCard: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 1fr',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    background: 'var(--surface-glass)',
    border: '1.5px solid hsl(var(--border))',
    boxShadow: 'var(--shadow-lg)',
  },
  spotlightVisual: {
    height: '100%',
    minHeight: 280,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  spotlightNotchTop: {
    position: 'absolute',
    width: 20,
    height: 20,
    background: 'hsl(var(--bg-primary))',
    borderRadius: '50%',
    top: -10,
    right: -10,
    borderBottom: '1px solid hsl(var(--border))',
    zIndex: 3,
  },
  spotlightNotchBottom: {
    position: 'absolute',
    width: 20,
    height: 20,
    background: 'hsl(var(--bg-primary))',
    borderRadius: '50%',
    bottom: -10,
    right: -10,
    borderTop: '1px solid hsl(var(--border))',
    zIndex: 3,
  },
  spotlightDivider: {
    position: 'absolute',
    top: 10,
    bottom: 10,
    right: -1,
    width: 1,
    borderRight: '1.5px dashed hsl(var(--border))',
    zIndex: 2,
  },
  spotlightInfo: {
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  /* ── Category Vibe Grid ── */
  vibeSection: {
    marginBottom: 80,
  },
  vibeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 20,
  },
  vibeCard: {
    padding: 24,
    borderRadius: 'var(--radius-md)',
    background: 'var(--surface-glass)',
    border: '1px solid hsl(var(--border))',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },

  /* ── All experiences ── */
  searchHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    flexWrap: 'wrap',
    gap: 20,
  },
  searchWrapper: {
    maxWidth: 400,
    width: '100%',
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: 'translateY(-50%)',
    width: 18,
    height: 18,
    color: 'hsl(var(--text-muted))',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '12px 18px 12px 46px',
    background: 'var(--surface-glass)',
    border: '1.5px solid hsl(var(--border))',
    borderRadius: 'var(--radius-md)',
    color: 'hsl(var(--text-primary))',
    fontSize: '0.92rem',
    outline: 'none',
    transition: 'all 0.25s ease',
  },

  filtersRow: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterPill: {
    padding: '7px 16px',
    borderRadius: 50,
    border: '1.5px solid hsl(var(--border))',
    background: 'transparent',
    color: 'hsl(var(--text-secondary))',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '0.8rem',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    whiteSpace: 'nowrap',
  },
  filterPillActive: {
    background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-light)) 100%)',
    borderColor: 'hsl(var(--primary))',
    color: '#fff',
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
    gap: 28,
  },

  /* ── Ticket Card Layout ── */
  card: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 380,
  },
  visualCoverText: {
    fontSize: '1.6rem',
    fontFamily: 'var(--font-display)',
    fontWeight: 900,
    letterSpacing: '0.1em',
    color: '#fff',
    textShadow: '0 2px 10px rgba(0,0,0,0.15)',
    textTransform: 'uppercase',
    opacity: 0.85,
  },
  cardInnerTop: {
    padding: '24px 28px 16px',
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column',
  },
  cardInnerBottom: {
    padding: '16px 28px 24px',
    flex: '0 0 auto',
    marginTop: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: 50,
    background: 'hsla(var(--primary) / 0.08)',
    color: 'hsl(var(--primary))',
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    border: '1px solid hsla(var(--primary) / 0.18)',
  },
  dateLabel: {
    fontSize: '0.8rem',
    color: 'hsl(var(--text-muted))',
    fontWeight: 600,
  },
  cardTitle: {
    fontSize: '1.3rem',
    fontWeight: 700,
    marginBottom: 8,
    lineHeight: 1.25,
    color: 'hsl(var(--text-primary))',
    letterSpacing: '-0.02em',
  },
  cardDescription: {
    fontSize: '0.88rem',
    color: 'hsl(var(--text-secondary))',
    lineHeight: 1.55,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  metaSection: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 12,
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: '0.82rem',
    color: 'hsl(var(--text-muted))',
    fontWeight: 500,
  },
  viewBtn: {
    width: '100%',
    textAlign: 'center',
    fontSize: '0.85rem',
    padding: '11px 20px',
    borderRadius: 'var(--radius-sm)',
    border: '1.5px solid hsl(var(--border))',
    background: 'transparent',
    color: 'hsl(var(--text-primary))',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.25s ease',
  },

  /* ── States ── */
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 340,
    gap: 20,
  },
  spinner: {
    width: 44,
    height: 44,
    border: '3px solid hsl(var(--border))',
    borderTopColor: 'hsl(var(--primary))',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
};

function Dashboard() {
  const pageRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const searchSectionRef = useRef(null);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  /* ── Fetch events ── */
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get('/events');
        setEvents(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  /* ── Hero animation ── */
  useEffect(() => {
    animateHero({
      title: titleRef.current,
      subtitle: subtitleRef.current,
    });
    animateBlobs(pageRef);
  }, []);

  /* ── Card stagger ── */
  useEffect(() => {
    if (!loading && events.length > 0) {
      requestAnimationFrame(() => {
        animateStaggerCards('.event-card', pageRef);
      });
    }
  }, [loading, events, filterCategory, searchQuery]);

  /* ── Combined filter logic ── */
  const filteredEvents = events.filter((event) => {
    const matchesCategory =
      filterCategory === 'All' || event.category === filterCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      event.title?.toLowerCase().includes(query) ||
      event.description?.toLowerCase().includes(query) ||
      event.location?.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const spotlightEvent = events.length > 0 ? events[0] : null;

  const handleVibeClick = (categoryName) => {
    setFilterCategory(categoryName);
    if (searchSectionRef.current) {
      searchSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
      <div className="glow-blob" style={styles.blob3} />

      <div style={styles.container}>
        {/* ── 1. Hero Section ── */}
        <section style={styles.hero}>
          <h1 ref={titleRef} className="gradient-text" style={styles.heroTitle}>
            Discover Premium Experiences
          </h1>
          <p ref={subtitleRef} style={styles.heroSubtitle}>
            Browse exclusive listings, book tickets instantly, and connect with creative events in Elysian.
          </p>
        </section>

        {/* ── 2. Featured Spotlight Pass ── */}
        {spotlightEvent && (
          <section style={styles.spotlightSection}>
            <h2 style={styles.spotlightTitle}>
              <span>✨</span> Spotlight Experience
            </h2>
            <div style={styles.spotlightCard}>
              <div
                style={{
                  ...styles.spotlightVisual,
                  background: getCategoryGradient(spotlightEvent.category),
                }}
              >
                <div style={styles.spotlightNotchTop} />
                <div style={styles.spotlightNotchBottom} />
                <div style={styles.spotlightDivider} />
                <span style={{ fontSize: '3rem', fontWeight: 900, color: '#fff', opacity: 0.9, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  {spotlightEvent.category || 'Spotlight'}
                </span>
              </div>
              <div style={styles.spotlightInfo}>
                <span style={{ ...styles.categoryBadge, alignSelf: 'flex-start', marginBottom: 12 }}>
                  {spotlightEvent.category || 'Featured'}
                </span>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 10, color: 'hsl(var(--text-primary))' }}>
                  {spotlightEvent.title}
                </h3>
                <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.96rem', lineHeight: 1.6, marginBottom: 20 }}>
                  {spotlightEvent.description}
                </p>
                <div style={{ display: 'flex', gap: 20, marginBottom: 24, fontSize: '0.85rem', color: 'hsl(var(--text-muted))' }}>
                  <span>📍 {spotlightEvent.location}</span>
                  <span>🗓 {formatDate(spotlightEvent.date)}</span>
                </div>
                <Link
                  to={`/event/${spotlightEvent._id}`}
                  className="btn btn-primary"
                  style={{ alignSelf: 'flex-start', fontSize: '0.88rem' }}
                >
                  Book Golden Ticket →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── 3. Explore by Vibe ── */}
        <section style={styles.vibeSection}>
          <h2 style={{ ...styles.spotlightTitle, marginBottom: 20 }}>🧭 Explore by Vibe</h2>
          <div style={styles.vibeGrid}>
            {VIBE_CATEGORIES.map((vibe) => (
              <div
                key={vibe.name}
                style={styles.vibeCard}
                onClick={() => handleVibeClick(vibe.name)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'hsl(var(--border-hover))';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'hsl(var(--border))';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: vibe.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  margin: '0 auto 14px',
                }}>
                  {vibe.emoji}
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>{vibe.name}</h4>
                <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', lineHeight: 1.4 }}>{vibe.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. Search and Grid Section ── */}
        <section ref={searchSectionRef} style={{ borderTop: '1.5px solid hsl(var(--border))', paddingTop: 60 }}>
          <div style={styles.searchHeaderRow}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              All Experiences
            </h2>

            {/* Search Input */}
            <div style={styles.searchWrapper}>
              <svg
                style={styles.searchIcon}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search location, title, pass type…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'hsl(var(--primary))'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'hsl(var(--border))'; }}
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div style={{ ...styles.filtersRow, marginBottom: 36 }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                style={{
                  ...styles.filterPill,
                  ...(filterCategory === cat ? styles.filterPillActive : {}),
                }}
                onMouseEnter={(e) => {
                  if (filterCategory !== cat) {
                    e.currentTarget.style.borderColor = 'hsl(var(--border-hover))';
                    e.currentTarget.style.background = 'hsl(var(--bg-secondary))';
                  }
                }}
                onMouseLeave={(e) => {
                  if (filterCategory !== cat) {
                    e.currentTarget.style.borderColor = 'hsl(var(--border))';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Experiences Grid */}
          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner} />
            </div>
          ) : filteredEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 24px', color: 'hsl(var(--text-muted))' }}>
              <p style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔍</p>
              <h4>No matches found</h4>
              <p style={{ fontSize: '0.9rem', marginTop: 4 }}>Try clearing search inputs or exploring other vibe categories.</p>
            </div>
          ) : (
            <div style={styles.grid}>
              {filteredEvents.map((event) => (
                <div key={event._id} className="event-card ticket-card" style={styles.card}>
                  <div
                    className="ticket-visual-header"
                    style={{ background: getCategoryGradient(event.category) }}
                  >
                    <span style={styles.visualCoverText}>{event.category || 'Pass'}</span>
                  </div>

                  <div className="ticket-divider" />

                  <div style={styles.cardInnerTop}>
                    <div style={styles.cardHeaderRow}>
                      <span style={styles.categoryBadge}>{event.category || 'Event'}</span>
                      <span style={styles.dateLabel}>{formatDate(event.date)}</span>
                    </div>
                    <h3 style={styles.cardTitle}>{event.title}</h3>
                    <p style={styles.cardDescription}>{event.description}</p>
                  </div>

                  <div style={styles.cardInnerBottom}>
                    <div style={styles.metaSection}>
                      <span style={styles.metaItem}>📍 {event.location || 'TBA'}</span>
                      <span style={styles.metaItem}>👤 {event.organizer?.name || 'Organizer'}</span>
                      <span style={styles.metaItem}>👥 {event.attendees?.length || 0} attending</span>
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
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
