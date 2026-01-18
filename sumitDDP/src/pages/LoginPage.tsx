import { Box, Button, TextField, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login } from '../auth';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    login(String(data.get('email') ?? ''));
    navigate('/');
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper sx={{ p: 4, width: 320 }}>
        <Typography variant="h6" gutterBottom>IVECO Login</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField name="email" label="Email" fullWidth margin="normal" />
          <TextField name="password" label="Password" type="password" fullWidth margin="normal" />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>Login</Button>
        </Box>
      </Paper>
    </Box>
  );
}