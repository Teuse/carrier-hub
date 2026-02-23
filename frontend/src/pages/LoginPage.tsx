import { Box, Button, Paper, Typography } from '@mui/material';
import { useAuth } from 'react-oidc-context';
import { handleSignin } from '../auth';

export default function LoginPage() {
  const auth = useAuth();

  return (
    <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper sx={{ p: 4, width: 320 }}>
        <Typography variant="h6" gutterBottom>IVECO Login</Typography>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }} onClick={() => handleSignin(auth)}>
          Login
        </Button>
      </Paper>
    </Box>
  );
}