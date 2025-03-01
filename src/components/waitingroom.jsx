import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'; // Icon for waiting
import CheckInIcon from '@mui/icons-material/MeetingRoom'; // Icon for check-in
import { keyframes } from '@emotion/react';

// Define a fade-in animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

function Waitingroom() {
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
        <HourglassEmptyIcon
          sx={{
            fontSize: '4rem',
            color: '#2C3E50',
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
          Waiting Page
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: '#34495E',
            marginBottom: '2rem',
          }}
        >
          You are not allocated a room. Please check in to access the services.
        </Typography>
      </Container>
    </Box>
  );
}

export default Waitingroom;