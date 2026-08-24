// src/components/common/LoadingSpinner.jsx
import React from 'react';
import './LoadingSpinner.scss';

const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="loading-spinner-wrapper" role="status" aria-live="polite">
    <div className="spinner" />
    <span className="spinner-message">{message}</span>
  </div>
);

export default LoadingSpinner;
