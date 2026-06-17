import React from 'react';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  // Format date to be human readable (e.g., "Jun 25, 2026")
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="glass-interactive" style={{ 
      padding: '24px', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '16px',
      height: '100%',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* 1. Category Badge */}
        <span style={{
          alignSelf: 'flex-start',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '0.72rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          background: 'rgba(139, 92, 246, 0.12)',
          color: 'var(--primary-hover)',
          border: '1px solid rgba(139, 92, 246, 0.2)'
        }}>
          {event.category}
        </span>

        {/* 2. Title and Description */}
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
            {event.title}
          </h3>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '0.88rem', 
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {event.description}
          </p>
        </div>
      </div>

      {/* 3. Metadata (Date, Location, RSVPs) */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '10px', 
        borderTop: '1px solid rgba(255, 255, 255, 0.05)', 
        paddingTop: '16px' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <Calendar size={15} style={{ color: 'var(--primary-color)' }} />
          <span>{formattedDate}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <MapPin size={15} style={{ color: 'var(--secondary-color)' }} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {event.location}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <Users size={15} style={{ color: 'var(--accent-color)' }} />
          <span>{event.attendees ? event.attendees.length : 0} attending</span>
        </div>
      </div>

      {/* 4. Action Button */}
      <Link to={`/events/${event._id}`} className="btn btn-secondary" style={{ 
        display: 'flex',
        justifyContent: 'space-between', 
        fontSize: '0.82rem', 
        padding: '10px 14px', 
        borderRadius: '10px',
        marginTop: '8px'
      }}>
        <span>View Details</span>
        <ArrowRight size={15} />
      </Link>
    </div>
  );
};

export default EventCard;
