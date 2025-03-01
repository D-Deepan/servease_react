import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock'; // Icon for unauthorized access
import HomeIcon from '@mui/icons-material/Home'; // Icon for home navigation
import { keyframes } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
// Define a fade-in animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

function Unauthorised() {
  const navigate = useNavigate();  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '2rem',
        textAlign: 'center',
        animation: `${fadeIn} 1s ease-out`,
      }}
    >
      <Container maxWidth="sm">
        <LockIcon
          sx={{
            fontSize: '4rem',
            color: '#d32f2f', // Red color for emphasis
            marginBottom: '1rem',
          }}
        />
        <Typography
          variant="h3"
          sx={{
            fontWeight: '700',
            color: '#2C3E50',
            marginBottom: '1rem',
          }}
        >
          Unauthorised Access!
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: '#34495E',
            marginBottom: '2rem',
          }}
        >
          You do not have permission to access this page. Please contact the administrator or return to the home page.
        </Typography>
        <Button
          variant="contained"
          onClick={()=>navigate('/')}
          startIcon={<HomeIcon />}
          sx={{
            backgroundColor: '#2196F3',
            color: 'white',
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            fontWeight: '600',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#1976D2',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
            },
          }}
        >
          Go to Home
        </Button>
      </Container>
    </Box>
  );
}

export default Unauthorised;