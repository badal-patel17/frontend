// src/api/apiConfig.js
// Central API configuration — swap BASE_URL for your real backend.

export const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.vfort.internal/v1';

export const ENDPOINTS = {
  ORDERS: `${BASE_URL}/orders`,
  USERS:  `${BASE_URL}/users`,
  AUDIT:  `${BASE_URL}/audit-logs`,
  STATS:  `${BASE_URL}/stats`,
  FLOWS:  `${BASE_URL}/flows`,
};

// Returns headers including the auth token stored by Login.jsx
export const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  ...(localStorage.getItem('vfort_token')
    ? { Authorization: `Bearer ${localStorage.getItem('vfort_token')}` }
    : {}),
});
