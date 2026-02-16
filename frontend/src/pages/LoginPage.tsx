import { Box, Button, TextField, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { loginRequest } from '../authConfig';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';

export default function LoginPage() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest);
  };

  
  return (
    <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper sx={{ p: 4, width: 320 }}>
        <Typography variant="h6" gutterBottom>IVECO Login</Typography>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleLogin}>
          Login with Microsoft</Button>
      </Paper>
    </Box>
  );
}