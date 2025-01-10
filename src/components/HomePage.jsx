import React from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Paper,
  Stack,
  useTheme
} from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const theme = useTheme();

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
          textAlign: 'center',
          background: `linear-gradient(to bottom, ${theme.palette.background.paper}, ${theme.palette.background.default})`
        }}
      >
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: theme.palette.primary.main,
            mb: 3
          }}
        >
          Welcome to Online Voting
        </Typography>

        <Typography 
          variant="h6" 
          component="p" 
          gutterBottom
          sx={{
            mb: 4,
            color: theme.palette.text.secondary
          }}
        >
          Participate in secure and easy online voting!
        </Typography>

        <Stack 
          direction="row" 
          spacing={2} 
          justifyContent="center"
          sx={{ mt: 2 }}
        >
          <Button 
            variant="contained" 
            color="primary" 
            component={Link} 
            to="/login"
            size="large"
            sx={{
              px: 4,
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
            Login
          </Button>

          <Button 
            variant="outlined" 
            color="primary" 
            component={Link} 
            to="/register"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem',
              '&:hover': {
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s',
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.common.white
              }
            }}
          >
            Register
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default HomePage;