import React, { useRef } from 'react';
import { Box, Typography, Container, Grid, IconButton } from '@mui/material';
import { keyframes } from '@emotion/react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import r1 from '../assets/Screenshot 2025-03-01 112703.png';
import r2 from '../assets/Screenshot 2025-03-01 112721.png';
import r3 from '../assets/Screenshot 2025-03-01 112737.png';
import r4 from '../assets/Screenshot 2025-03-01 112841.png';
import r6 from '../assets/Screenshot 2025-03-01 112947.png';
import r7 from '../assets/Screenshot 2025-03-01 113107.png';

const slideIn = keyframes`
  0% { opacity: 0; transform: translateX(-100px); }
  100% { opacity: 1; transform: translateX(0); }
`;

const galleryImages = [
  {
    id: 1,
    src: r1,
    alt: 'Hotel Room',
    title: 'Deluxe Suite'
  },
  {
    id: 2,
    src: r2,
    alt: 'Premium Room',
    title: 'Executive Room'
  },
  {
    id: 3,
    src: r3,
    alt: 'Luxury Suite',
    title: 'Presidential Suite'
  },
  {
    id: 4,
    src: r4,
    alt: 'Restaurant',
    title: 'Fine Dining'
  },
  {
    id: 5,
    src: r7,
    alt: 'Lounge',
    title: 'Executive Lounge'
  },
  {
    id: 6,
    src: r6,
    alt: 'Pool',
    title: 'Infinity Pool'
  }
];

const fadeUp = keyframes`
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
`;

const Home = () => {
  const galleryRef = useRef(null);

  const scrollGallery = (direction) => {
    if (galleryRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      galleryRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: { xs: '2rem 0', md: '4rem 0' }, // Responsive padding
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            textAlign: 'center',
            animation: `${slideIn} 1.5s ease-out`,
            marginBottom: { xs: '3rem', md: '6rem' }, // Responsive margin
            position: 'relative',
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '5rem' }, // Responsive font size
              fontWeight: '900',
              color: '#2C3E50',
              textShadow: '3px 3px 6px rgba(0,0,0,0.2)',
              animation: `${pulse} 3s infinite ease-in-out`,
            }}
          >
            Welcome to Servease
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: '1.25rem', md: '2rem' }, // Responsive font size
              color: '#2C3E50',
              marginTop: '1rem',
              fontWeight: '300',
              letterSpacing: '4px',
            }}
          >
            Luxury Redefined
          </Typography>
        </Box>

        {/* First Grid Section */}
        <Grid container spacing={{ xs: 6, md: 3 }}> {/* Responsive spacing for all screen sizes */}
          {['Culinary Excellence', 'Luxury in place', 'World-Class Amenities'].map((title, index) => (
            <Grid item xs={12} md={4} key={title} sx={{ marginBottom: { xs: 2, md: 0 } }}> {/* Add marginBottom for smaller screens */}
              <Box
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '20px',
                  padding: { xs: '1.5rem', md: '2rem' }, // Responsive padding
                  height: '100%',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  transition: 'all 0.3s ease',
                  animation: `${fadeUp} 1s ease-out ${index * 0.2}s`,
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 15px 45px rgba(31, 38, 135, 0.2)',
                  },
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: { xs: '1.75rem', md: '2rem' }, // Responsive font size
                    fontWeight: '700',
                    color: '#2C3E50',
                    marginBottom: '1.5rem',
                    borderBottom: '2px solid #4ECDC4',
                    paddingBottom: '0.5rem',
                  }}
                >
                  {title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '1rem', md: '1.1rem' }, // Responsive font size
                    color: '#34495E',
                    lineHeight: '1.8',
                  }}
                >
                  {getContentForSection(title)}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Special Offers Section */}
        <Box
          sx={{
            marginTop: { xs: '4rem', md: '8rem' }, // Responsive margin
            padding: { xs: '1.5rem', md: '3rem' }, // Responsive padding
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
            borderRadius: '20px',
            animation: `${fadeUp} 1.5s ease-out`,
            boxShadow: '0 15px 45px rgba(31, 38, 135, 0.1)',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              color: '#2C3E50',
              marginBottom: { xs: '1.5rem', md: '2rem' }, // Responsive margin
              fontWeight: '700',
              fontSize: { xs: '2rem', md: '3rem' }, // Responsive font size
            }}
          >
            Special Offers
          </Typography>
          <Grid container spacing={{ xs: 2, md: 3 }}> {/* Responsive spacing */}
            {['Romantic Getaway', 'Family Package', 'Business Travel'].map((offer, index) => (
              <Grid item xs={12} md={4} key={offer}>
                <Box
                  sx={{
                    padding: { xs: '1rem', md: '1.5rem' }, // Responsive padding
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '15px',
                    animation: `${fadeUp} 1s ease-out ${index * 0.2}s`,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <Typography variant="h5" gutterBottom>
                    {offer}
                  </Typography>
                  <Typography variant="body1">
                    {getOfferDescription(offer)}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Gallery Section */}
        <Box
          sx={{
            marginTop: { xs: '4rem', md: '8rem' }, // Responsive margin
            position: 'relative',
            padding: { xs: '1rem 0', md: '2rem 0' }, // Responsive padding
          }}
        >
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              color: '#2C3E50',
              marginBottom: { xs: '1.5rem', md: '2rem' }, // Responsive margin
              fontWeight: '700',
              fontSize: { xs: '2rem', md: '3rem' }, // Responsive font size
            }}
          >
            Our Gallery
          </Typography>
          
          <Box
            ref={galleryRef}
            sx={{
              display: 'flex',
              gap: { xs: '0.5rem', md: '1rem' }, // Responsive gap
              overflowX: 'auto',
              padding: { xs: '1rem 0', md: '2rem 0' }, // Responsive padding
              scrollBehavior: 'smooth',
              '&::-webkit-scrollbar': {
                display: 'none'
              },
              '-ms-overflow-style': 'none',
              'scrollbar-width': 'none',
            }}
          >
            {galleryImages.map((image) => (
              <Box
                key={image.id}
                sx={{
                  position: 'relative',
                  minWidth: { xs: '200px', md: '300px' }, // Responsive minWidth
                  height: { xs: '150px', md: '200px' }, // Responsive height
                  borderRadius: '15px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    '& .image-overlay': {
                      opacity: 1
                    }
                  }
                }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <Box
                  className="image-overlay"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: '1rem',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  }}
                >
                  <Typography variant="subtitle1">
                    {image.title}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
          
          <IconButton
            onClick={() => scrollGallery('left')}
            sx={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255,255,255,0.8)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.9)',
              },
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>
          
          <IconButton
            onClick={() => scrollGallery('right')}
            sx={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255,255,255,0.8)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.9)',
              },
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
};

const getContentForSection = (title) => {
  const content = {
    'Culinary Excellence': 'Experience world-class dining with our international cuisine selection, prepared by award-winning chefs.',
    'Luxury in place': 'Choose from our carefully designed rooms and suites, each offering unique views and premium amenities.',
    'World-Class Amenities': 'Enjoy our spa, fitness center, infinity pool, and exclusive services designed for your comfort.',
  };
  return content[title];
};

const getOfferDescription = (offer) => {
  const descriptions = {
    'Romantic Getaway': 'Perfect for couples seeking a memorable escape with special dining and spa experiences.',
    'Family Package': 'Create lasting memories with family-friendly activities and special kids programs.',
    'Business Travel': 'Streamlined check-in, premium WiFi, and dedicated workspace for professionals.',
  };
  return descriptions[offer];
};

export default Home;