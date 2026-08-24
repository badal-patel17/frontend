// src/components/common/ErrorMessage.jsx
import React from 'react';
import './ErrorMessage.scss';
import { ErrorOutline } from '@mui/icons-material';

const ErrorMessage = ({ message = 'Something went wrong.', onRetry }) => (
  <div className="error-message-wrapper" role="alert">
    <ErrorOutline className="error-icon" />
    <p className="error-text">{message}</p>
    {onRetry && (
      <button className="retry-btn" onClick={onRetry}>
        Retry
      </button>
    )}
  </div>
);

export default ErrorMessage;
