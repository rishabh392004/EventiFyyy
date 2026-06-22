import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { animateFormEntrance } from '../utils/gsapAnimations';

const CATEGORIES_LIST = [
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

const TEMPLATE_SUGGESTIONS = {
  music: ['Acoustic Sunset Symphony', 'Elysian Jazz Night', 'Midnight Beats Festival'],
  tech: ['Code & Champagne Hackathon', 'AI & Design Symposium', 'Future Tech Round Table'],
  art: ['Obsidian Pearl Gallery Exhibition', 'Modern Sculpting Masterclass', 'Creative Sketch Showcase'],
  food: ['Wine Tasting Pop-Up', 'Gourmet Pastry Workshop', 'Chef Spotlight Supper Club'],
  other: ['Elysian Private Gathering', 'Luxury Networking Hour', 'Elysian VIP Lounge Session'],
};

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: '120px 24px 80px',
  },
  blobOne: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, hsla(var(--primary), 0.04) 0%, transparent 70%)',
    top: '-160px',
    left: '50%',
    transform: 'translateX(-50%)',
    filter: 'blur(100px)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  blobTwo: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, hsla(var(--accent), 0.04) 0%, transparent 70%)',
    bottom: '-120px',
    right: '-100px',
    filter: 'blur(90px)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  card: {
    width: '100%',
    maxWidth: '680px',
    position: 'relative',
    zIndex: 1,
  },
  cardInner: {
    background: 'var(--surface-glass)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1.5px solid hsl(var(--border))',
    borderRadius: 'var(--radius-lg)',
    padding: '3rem 2.5rem 2.5rem',
    boxShadow: 'var(--shadow-lg)',
  },
  title: {
    fontSize: '2.2rem',
    fontWeight: 800,
    color: 'hsl(var(--text-primary))',
    marginBottom: '0.5rem',
    letterSpacing: '-0.03em',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: 'hsl(var(--text-muted))',
    marginBottom: '2.5rem',
    lineHeight: 1.5,
    textAlign: 'center',
  },
  errorBox: {
    background: 'hsla(var(--error) / 0.08)',
    border: '1px solid hsla(var(--error) / 0.2)',
    borderRadius: 'var(--radius-md)',
    padding: '0.85rem 1rem',
    marginBottom: '1.5rem',
    color: 'hsl(var(--error))',
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.25rem',
  },
  textarea: {
    resize: 'vertical',
    minHeight: '110px',
    lineHeight: 1.6,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
    marginTop: '0.5rem',
  },
  submitBtn: {
    minWidth: '160px',
  },
  
  /* ── Suggestions Dropdown ── */
  suggestionContainer: {
    position: 'relative',
  },
  suggestionsList: {
    position: 'absolute',
    top: '105%',
    left: 0,
    right: 0,
    background: 'var(--bg-elevated)',
    border: '1px solid hsl(var(--border))',
    borderRadius: 'var(--radius-sm)',
    boxShadow: 'var(--shadow-md)',
    zIndex: 10,
    maxHeight: 180,
    overflowY: 'auto',
    padding: '6px 0',
  },
  suggestionItem: {
    padding: '10px 16px',
    fontSize: '0.88rem',
    color: 'hsl(var(--text-secondary))',
    cursor: 'pointer',
    transition: 'background var(--transition-fast)',
  },
  
  /* ── Template Helper Box ── */
  templateBox: {
    background: 'hsla(var(--primary) / 0.03)',
    border: '1px dashed hsl(var(--border))',
    borderRadius: 'var(--radius-md)',
    padding: '16px 20px',
    marginTop: 10,
  },
  templateTitle: {
    fontSize: '0.78rem',
    fontWeight: 700,
    color: 'hsl(var(--primary))',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: 8,
  },
  templateTags: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  templatePill: {
    padding: '4px 10px',
    borderRadius: 50,
    border: '1px solid hsl(var(--border))',
    fontSize: '0.78rem',
    color: 'hsl(var(--text-secondary))',
    cursor: 'pointer',
    background: 'var(--bg-elevated)',
    transition: 'all 0.2s',
  },
};

function CreateEvent() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);

  const formRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (formRef.current) {
      animateFormEntrance(formRef.current);
    }
  }, []);

  /* ── Category suggestion filtering ── */
  useEffect(() => {
    if (!category) {
      setFilteredCategories(CATEGORIES_LIST);
      return;
    }
    const matches = CATEGORIES_LIST.filter((c) =>
      c.toLowerCase().includes(category.toLowerCase())
    );
    setFilteredCategories(matches);
  }, [category]);

  const selectCategory = (cat) => {
    setCategory(cat);
    setShowCategorySuggestions(false);
  };

  /* ── Get templates based on selected category ── */
  const getTemplates = () => {
    const key = category.toLowerCase();
    if (key.includes('music')) return TEMPLATE_SUGGESTIONS.music;
    if (key.includes('tech')) return TEMPLATE_SUGGESTIONS.tech;
    if (key.includes('art')) return TEMPLATE_SUGGESTIONS.art;
    if (key.includes('food')) return TEMPLATE_SUGGESTIONS.food;
    return TEMPLATE_SUGGESTIONS.other;
  };

  const selectTemplateTitle = (tplTitle) => {
    setTitle(tplTitle);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/events', {
        title,
        description,
        date,
        category,
        location,
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.blobOne} />
      <div style={styles.blobTwo} />

      <div style={styles.card} ref={formRef}>
        <div style={styles.cardInner}>
          <h2 style={styles.title}>Create New Experience</h2>
          <p style={styles.subtitle}>Host and publish an exclusive pass ticket on Elysian</p>

          {error && <div style={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Title */}
            <div className="form-group">
              <label className="form-label">Event Title</label>
              <input
                type="text"
                placeholder="e.g., Elysian Symphony Concert"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
                required
              />
              
              {/* Event Name Suggestions Panel */}
              <div style={styles.templateBox}>
                <div style={styles.templateTitle}>💡 Event Title Suggestions</div>
                <div style={styles.templateTags}>
                  {getTemplates().map((tpl) => (
                    <span
                      key={tpl}
                      onClick={() => selectTemplateTitle(tpl)}
                      style={styles.templatePill}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'hsl(var(--primary))';
                        e.currentTarget.style.color = 'hsl(var(--primary))';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'hsl(var(--border))';
                        e.currentTarget.style.color = 'hsl(var(--text-secondary))';
                      }}
                    >
                      {tpl}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                placeholder="Detail the experience, amenities, dress code, VIP tickets, schedule..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-input"
                style={styles.textarea}
                required
              />
            </div>

            {/* Date & Category Row */}
            <div style={styles.row}>
              <div className="form-group">
                <label className="form-label">Date & Time</label>
                <input
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              {/* Category with Autocomplete Dropdown */}
              <div className="form-group" style={styles.suggestionContainer}>
                <label className="form-label">Category</label>
                <input
                  type="text"
                  placeholder="e.g., Music, Tech, Food..."
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setShowCategorySuggestions(true);
                  }}
                  onFocus={() => setShowCategorySuggestions(true)}
                  onBlur={() => setTimeout(() => setShowCategorySuggestions(false), 200)}
                  className="form-input"
                  required
                />
                
                {showCategorySuggestions && filteredCategories.length > 0 && (
                  <div style={styles.suggestionsList}>
                    {filteredCategories.map((cat) => (
                      <div
                        key={cat}
                        onClick={() => selectCategory(cat)}
                        style={styles.suggestionItem}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'hsl(var(--bg-secondary))'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        {cat}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label">Location / Platform</label>
              <input
                type="text"
                placeholder="e.g., Lincoln Center, NY or online (Zoom)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="form-input"
                required
              />
            </div>

            {/* Actions */}
            <div style={styles.actions}>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={styles.submitBtn}
                disabled={loading}
              >
                {loading ? 'Publishing...' : 'Publish Experience'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateEvent;
