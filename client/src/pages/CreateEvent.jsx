import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const CreateEvent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/events', {
        title,
        description,
        date,
        location,
        category,
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event. Make sure all fields are filled.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Decorative Blur Blobs */}
      <div className="glow-blob" style={{ ...styles.blob, top: '20%', left: '10%', width: '400px', height: '400px', background: 'hsl(var(--primary))' }}></div>
      <div className="glow-blob" style={{ ...styles.blob, bottom: '20%', right: '10%', width: '350px', height: '350px', background: 'hsl(var(--secondary))' }}></div>

      <div className="glass-panel" style={styles.card}>
        <h2 style={styles.title}>Create <span className="gradient-text">New Event</span></h2>
        <p style={styles.subtitle}>Fill in details to host and organize an event</p>

        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Event Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Design Hackathon"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              style={styles.textarea}
              placeholder="What is this event about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div style={styles.row}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Date & Time</label>
              <input
                type="datetime-local"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Category</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Tech, Music, Sports"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '32px' }}>
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. San Francisco, CA or Online (Zoom)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div style={styles.actions}>
            <button type="button" onClick={() => navigate('/')} className="btn btn-secondary" style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={styles.submitBtn} disabled={loading}>
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '85vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px 24px',
    position: 'relative',
  },
  blob: {
    opacity: 0.08,
  },
  card: {
    width: '100%',
    maxWidth: '650px',
    padding: '40px 32px',
    background: 'rgba(15, 20, 35, 0.55)',
  },
  title: {
    fontSize: '2.2rem',
    marginBottom: '8px',
    textAlign: 'center',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    color: 'hsl(var(--text-secondary))',
    fontSize: '0.95rem',
    marginBottom: '32px',
    textAlign: 'center',
  },
  errorAlert: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid hsl(var(--error))',
    color: 'hsl(var(--error))',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '0.9rem',
    marginBottom: '24px',
  },
  row: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  textarea: {
    minHeight: '120px',
    resize: 'vertical',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '16px',
  },
  cancelBtn: {
    padding: '12px 24px',
  },
  submitBtn: {
    padding: '12px 28px',
  },
};

export default CreateEvent;
