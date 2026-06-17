import React, { useState } from 'react';

const InputField = ({ 
  label, 
  type = 'text', 
  name, 
  required = true, 
  placeholder, 
  value, 
  onChange, 
  icon: Icon 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="form-group" style={{ marginBottom: 0 }}>
      {label && (
        <label 
          htmlFor={name} 
          style={{
            color: isFocused ? 'var(--primary-hover)' : 'var(--text-secondary)',
            transition: 'all 0.3s ease',
            transform: isFocused ? 'translateX(2px)' : 'translateX(0)',
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon 
            size={18} 
            style={{ 
              position: 'absolute', 
              left: '14px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: isFocused ? 'var(--primary-color)' : 'var(--text-muted)',
              transition: 'all 0.3s ease',
              filter: isFocused ? 'drop-shadow(0 0 6px rgba(139, 92, 246, 0.4))' : 'none',
            }} 
          />
        )}
        <input 
          type={type} 
          id={name} 
          name={name} 
          required={required} 
          placeholder={placeholder} 
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="input-field"
          style={{ 
            width: '100%', 
            paddingLeft: Icon ? '44px' : '16px',
          }}
        />
      </div>
    </div>
  );
};

export default InputField;
