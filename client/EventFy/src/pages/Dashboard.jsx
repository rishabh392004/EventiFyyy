import React, { useState, useEffect } from 'react';
import EventCard from '../components/EventCard.jsx';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  //now we fetch the data
  useEffect(() => {
    // 1. Create a function to fetch data
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();
        
        // 2. Save the data to our state
        setEvents(data);
        setLoading(false);
      } catch (err) {
        // 3. Handle errors
        setError('Failed to fetch events');
        setLoading(false);
      }
    };

    // 4. Run the function
    fetchEvents();
  }, []); 

  // 1. If we are currently loading, return the loading screen
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
        <p>Loading events...</p>
      </div>
    );
  }

  // 2. If there was an error, show the error banner
  if (error) {
    return (
      <div className="error-banner" style={{ margin: '20px auto', maxWidth: '600px' }}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="fade-in-up">
      <h1 style={{ marginBottom: '24px', fontSize: '2rem' }}>Discover Events</h1>

      {events.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          <p>No events found. Be the first to create one!</p>
        </div>
      ) : (
        <div className="event-grid">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
