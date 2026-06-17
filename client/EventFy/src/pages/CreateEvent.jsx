import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Tag, AlignLeft, Users, Type, AlertCircle, ArrowRight } from 'lucide-react';
import InputField from '../components/InputField.jsx';

const CreateEvent = ({ user }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: 'Other',
    capacity: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 100px)', padding: '20px' }}>
      <div className="auth-card" style={{ width: '100%', maxWidth: '500px', padding: '40px 32px' }}>
        <h2 className="auth-title" style={{ textAlign: 'center', marginBottom: '8px' }}>Host an Event</h2>
        <p className="auth-subtitle" style={{ textAlign: 'center', marginBottom: '28px' }}>Fill details to list your experience</p>

        {error && (
          <div className="error-banner">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Form elements will go here */}
      </div>
    </div>
  );
};

export default CreateEvent;
