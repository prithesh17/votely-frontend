import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;  

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/admin/register`, {
        fullName,
        email,
        password,
      });

      if (response.data.success) {
        setSuccessMessage(`${response.data.message}, Navigating to Home Page. Please wait !!`);
        setErrorMessage('');
        
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (error) {
      setErrorMessage('Registration unsuccessful. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#e0f7fa',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Register an Account
      </Typography>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      <Box 
        component="form"
        sx={{ mt: 3, width: '100%' }}
        onSubmit={handleRegister}
      >
        <TextField 
          label="Full Name" 
          variant="outlined" 
          fullWidth 
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          sx={{ marginBottom: '20px' }} 
        />
        <TextField 
          label="Email" 
          type="email"
          variant="outlined" 
          fullWidth 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ marginBottom: '20px' }} 
        />
        <TextField 
          label="Password" 
          type="password" 
          variant="outlined" 
          fullWidth 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ marginBottom: '20px' }} 
        />
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth
          type="submit"
          sx={{ padding: '10px 0' }}
        >
          Register
        </Button>
      </Box>
    </Container>
  );
};

export default RegisterPage;
