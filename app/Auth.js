'use client'

import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const StyledBox = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundImage: 'url("/pantry_bg.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.shape.borderRadius,
  width: '100%',
  maxWidth: 400,
}));

export default function Auth({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const auth = getAuth();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onLogin();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <StyledBox>
      <Container maxWidth="sm">
        <GlassCard>
          <CardContent>
            <Typography variant="h4" align="center" gutterBottom>
              {isSignUp ? 'Sign Up' : 'Log In'}
            </Typography>
            <form onSubmit={handleAuth}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                {isSignUp ? 'Sign Up' : 'Log In'}
              </Button>
            </form>
            <Button
              fullWidth
              variant="text"
              onClick={() => setIsSignUp(!isSignUp)}
              sx={{ mt: 2 }}
            >
              {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
            </Button>
            {error && (
              <Typography color="error" align="center" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </CardContent>
        </GlassCard>
      </Container>
    </StyledBox>
  );
}