// src/components/ProtectedRoute/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

/**
 * Wraps any route that requires authentication.
 * Reads 'vfort_token' from localStorage — set by Login on success.
 * Redirects to /login if no token is found.
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('vfort_token');
  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
