import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get('/events');
      setEvents(data);
    } catch (err) {
      setError('Could not retrieve events from the database.');
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (eventId) => {
    if (!user) {
      alert('You must be logged in to RSVP to an event.');
      return;
    }

    try {
      const { data } = await api.post(`/events/${eventId}/rsvp`);
      
      // Update local state for immediate feedback
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event._id === eventId
            ? { ...event, attendees: data.attendees }
            : event
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update RSVP.');
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await api.delete(`/events/${eventId}`);
      setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete event.');
    }
  };

  // Extract all categories to build the filter bar
  const categories = ['All', ...new Set(events.map(event => event.category))];

  // Filter events based on selected category
  const filteredEvents = filterCategory === 'All'
    ? events
    : events.filter(event => event.category === filterCategory);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.heroTitle}>Discover Amazing <span className="gradient-text">Events</span></h1>
        <p style={styles.heroSubtitle}>Browse gatherings or sign in to create and host your own events.</p>
      </header>

      {/* Filter bar */}
      <div style={styles.filterSection}>
        <span style={styles.filterLabel}>Filter by Category:</span>
        <div style={styles.filterButtons}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className="btn btn-secondary"
              style={{
                ...styles.filterBtn,
                backgroundColor: filterCategory === category ? 'hsl(var(--primary))' : 'hsl(var(--bg-tertiary))',
                borderColor: filterCategory === category ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                color: filterCategory === category ? '#fff' : 'hsl(var(--text-secondary))',
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {error && <div style={styles.errorAlert}>{error}</div>}

      {/* Grid of Events */}
      {filteredEvents.length === 0 ? (
        <div className="glass-panel" style={styles.emptyState}>
          <h3>No events found</h3>
          <p>There are no events registered under this category. Feel free to create one!</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredEvents.map(event => {
            const isAttendee = user && event.attendees?.some(id => id === user._id);
            const isOrganizer = user && event.organizer && (event.organizer._id === user._id || event.organizer === user._id);

            return (
              <div key={event._id} className="glass-panel" style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.categoryBadge}>{event.category}</span>
                  <span style={styles.dateLabel}>{formatDate(event.date)}</span>
                </div>

                <h3 style={styles.cardTitle}>{event.title}</h3>
                <p style={styles.cardDesc}>{event.description}</p>

                <div style={styles.metaSection}>
                  <div><strong>Location:</strong> {event.location}</div>
                  <div>
                    <strong>Hosted by:</strong> {event.organizer?.name || 'Unknown User'}
                  </div>
                  <div style={styles.attendeesCount}>
                    <strong>Attendees:</strong> {event.attendees?.length || 0}
                  </div>
                </div>

                <div style={styles.cardFooter}>
                  {/* Join/Leave Button */}
                  {user ? (
                    <button
                      onClick={() => handleRSVP(event._id)}
                      className={`btn ${isAttendee ? 'btn-secondary' : 'btn-primary'}`}
                      style={styles.actionBtn}
                    >
                      {isAttendee ? 'Leave Event' : 'Join Event'}
                    </button>
                  ) : (
                    <span style={styles.loginToJoin}>Log in to RSVP</span>
                  )}

                  {/* Organizer Controls */}
                  {isOrganizer && (
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="btn"
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 24px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(255, 255, 255, 0.1)',
    borderTop: '4px solid hsl(var(--primary))',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  header: {
    textAlign: 'center',
    marginBottom: '48px',
  },
  heroTitle: {
    fontSize: '3rem',
    marginBottom: '12px',
    letterSpacing: '-0.03em',
  },
  heroSubtitle: {
    color: 'hsl(var(--text-secondary))',
    fontSize: '1.1rem',
    maxWidth: '600px',
    margin: '0 auto',
  },
  filterSection: {
    marginBottom: '32px',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  },
  filterLabel: {
    fontWeight: '600',
    color: 'hsl(var(--text-secondary))',
  },
  filterButtons: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  filterBtn: {
    padding: '8px 16px',
    fontSize: '0.85rem',
    borderRadius: '20px',
  },
  errorAlert: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid hsl(var(--error))',
    color: 'hsl(var(--error))',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '24px',
  },
  emptyState: {
    padding: '48px',
    textAlign: 'center',
    background: 'rgba(15, 20, 35, 0.3)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '30px',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    padding: '24px',
    height: '100%',
    background: 'rgba(15, 20, 35, 0.45)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  categoryBadge: {
    backgroundColor: 'hsl(var(--primary-glow))',
    color: 'hsl(var(--primary))',
    fontSize: '0.8rem',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '20px',
    border: '1px solid hsl(var(--primary) / 0.2)',
  },
  dateLabel: {
    color: 'hsl(var(--text-muted))',
    fontSize: '0.8rem',
  },
  cardTitle: {
    fontSize: '1.4rem',
    marginBottom: '10px',
  },
  cardDesc: {
    color: 'hsl(var(--text-secondary))',
    fontSize: '0.95rem',
    marginBottom: '20px',
    flexGrow: 1,
  },
  metaSection: {
    borderTop: '1px solid hsl(var(--border))',
    paddingTop: '16px',
    marginBottom: '20px',
    fontSize: '0.85rem',
    color: 'hsl(var(--text-secondary))',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  attendeesCount: {
    color: 'hsl(var(--secondary))',
    fontWeight: '600',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  actionBtn: {
    flexGrow: 1,
    padding: '10px 18px',
    fontSize: '0.85rem',
  },
  deleteBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid hsl(var(--error) / 0.3)',
    color: 'hsl(var(--error))',
    marginLeft: '12px',
    padding: '10px 18px',
    fontSize: '0.85rem',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  loginToJoin: {
    color: 'hsl(var(--text-muted))',
    fontSize: '0.85rem',
    textAlign: 'center',
    width: '100%',
    padding: '10px 0',
  },
};

export default Dashboard;
