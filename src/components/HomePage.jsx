import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#e0f7fa',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Typography 
        variant="h2" 
        component="h1" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold', 
          textAlign: 'center',
          color: '#00796b'
        }}
      >
        Welcome to Online Voting
      </Typography>
      <Typography 
        variant="h6" 
        component="p" 
        gutterBottom 
        sx={{ 
          textAlign: 'center',
          color: '#004d40',
          marginBottom: '30px'
        }}
      >
        Participate in secure and easy online voting!
      </Typography>
      <Box sx={{ display: 'flex', gap: '20px' }}>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/login"
          sx={{ 
            padding: '10px 30px', 
            backgroundColor: '#00796b',
            '&:hover': {
              backgroundColor: '#004d40',
            }
          }}
        >
          Login
        </Button>
        <Button 
          variant="outlined" 
          color="primary" 
          component={Link} 
          to="/register"
          sx={{ 
            padding: '10px 30px', 
            color: '#00796b', 
            borderColor: '#00796b',
            '&:hover': {
              backgroundColor: '#b2dfdb',
              borderColor: '#004d40',
              color: '#004d40'
            }
          }}
        >
          Register
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;
