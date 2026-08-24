// src/pages/login/Login.jsx
import React, { useState } from 'react';
import logo    from './images/Vodafone-Logo.png';
import bgimage from './images/img.jpg';
import {
  Box, Paper, Typography, TextField, Button,
  Alert, CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { loginUser } from '../../api/mockApi';
import './login.scss';

const BackgroundBox = styled(Box)(() => ({
  backgroundImage:    `url(${bgimage})`,
  backgroundSize:     'cover',
  backgroundPosition: 'center',
  backgroundRepeat:   'no-repeat',
  minHeight:          '100vh',
  display:            'flex',
  justifyContent:     'center',
  alignItems:         'center',
}));

const LoginCard = styled(Paper)(({ theme }) => ({
  maxWidth:     420,
  width:        '90%',
  borderRadius: 16,
  overflow:     'hidden',
  boxShadow:    theme.shadows[10],
}));

const RightPanel = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  padding:         theme.spacing(5),
  display:         'flex',
  flexDirection:   'column',
  justifyContent:  'center',
}));

export default function Login() {
  const navigate = useNavigate();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const result = await loginUser({ email, password });
      // Store token so ProtectedRoute can verify authentication
      localStorage.setItem('vfort_token', result.data.token);
      navigate('/admin/users');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundBox>
      <LoginCard>
        <RightPanel>
          <Box textAlign="center" mb={3}>
            <img src={logo} height="60px" alt="Vodafone logo" />
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box>
            <TextField
              label="Email address"
              fullWidth
              margin="normal"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
              inputProps={{ 'aria-label': 'Email address' }}
            />
            <TextField
              label="Password"
              fullWidth
              margin="normal"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              disabled={loading}
              inputProps={{ 'aria-label': 'Password' }}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2, backgroundColor: '#2d2d2d', '&:hover': { backgroundColor: '#e00000' } }}
              onClick={handleLogin}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
            >
              {loading ? 'Signing in…' : 'LOGIN'}
            </Button>
          </Box>

          <Box mt={2} textAlign="center">
            <Typography
              component="button"
              variant="body2"
              sx={{ color: '#808080', background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => {/* TODO: implement password reset */}}
            >
              Forgot password?
            </Typography>
          </Box>

          <Box mt={4} textAlign="center">
            <Typography variant="caption" color="text.secondary">
              Terms of use &nbsp;·&nbsp; Privacy policy
            </Typography>
          </Box>
        </RightPanel>
      </LoginCard>
    </BackgroundBox>
  );
}
