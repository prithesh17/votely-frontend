import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Alert,
  Paper,
  IconButton,
  InputAdornment,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff, EmailOutlined, LockOutlined } from '@mui/icons-material';
import axios from 'axios';
import Cookies from 'js-cookie';

const apiUrl = import.meta.env.VITE_API_URL;

const LoginPage = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/admin/login`, {
        email,
        password,
      });
      
      if (response.data.success) {
        const { accessToken } = response.data.data;
        Cookies.set('accessToken', accessToken, { expires: 1 });
        setSuccessMessage(`${response.data.message}, Navigating to Home Page. Please wait !!`);
        setErrorMessage('');
        
        setTimeout(() => {
          navigate('/admin-dashboard');
        }, 3000);
      }
    } catch (error) {
      setErrorMessage('Login unsuccessful. Please try again.');
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}
    >
      <Paper 
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          width: '100%',
          background: `linear-gradient(to bottom, ${theme.palette.background.paper}, ${theme.palette.background.default})`
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            color: theme.palette.primary.main,
            mb: 3
          }}
        >
          Login to Your Account
        </Typography>

        {errorMessage && (
          <Alert 
            severity="error" 
            sx={{ mb: 2, borderRadius: 1 }}
          >
            {errorMessage}
          </Alert>
        )}
        
        {successMessage && (
          <Alert 
            severity="success"
            sx={{ mb: 2, borderRadius: 1 }}
          >
            {successMessage}
          </Alert>
        )}

        <Box 
          component="form" 
          onSubmit={handleLogin}
          sx={{
            '& .MuiTextField-root': { mb: 2 },
          }}
        >
          <TextField 
            label="Email" 
            type="email"
            variant="outlined" 
            fullWidth 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />

          <TextField 
            label="Password" 
            type={showPassword ? 'text' : 'password'}
            variant="outlined" 
            fullWidth 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />

          <Button 
            variant="contained" 
            color="primary" 
            fullWidth
            type="submit"
            disabled={loading}
            sx={{
              mt: 2,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem',
              '&:hover': {
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s'
              }
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;