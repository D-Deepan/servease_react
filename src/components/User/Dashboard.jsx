import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Button, List, ListItem, ListItemText, Paper } from '@mui/material';
import useAxiosPrivate from '../../hooks/useAxiosprivate';
import useAuth from '../../hooks/useAuth';

const Dashboard = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth, setauth } = useAuth(); // Access the auth state and setAuth function
  const [orders, setOrders] = useState([]); // State for orders
  const [services, setServices] = useState([]); // State for services
  const [roomDetails, setRoomDetails] = useState(null); // State for room details
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling

  // Fetch orders, services, and room details on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch orders
        const ordersResponse = await axiosPrivate.get('orders/servedorders', {
          headers: { 'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.accessToken}`,
          },
          withCredentials: true,
        });
        setOrders(ordersResponse.data.servedorders || []); // Default to empty array if no data

        // Fetch services
        const serviceResponse = await axiosPrivate.get('services/completedservice', {
          headers: { 'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.accessToken}`,
          },
          withCredentials: true,
        });
        setServices(serviceResponse.data.completedservices || []); // Default to empty array if no data

        // Fetch room details
        const roomResponse = await axiosPrivate.get('users/dashboard', {
          headers: { 'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.accessToken}`,
          },
          withCredentials: true,
        });
        setRoomDetails(roomResponse.data.data || null); // Default to null if no data

        setLoading(false); // Data fetched successfully
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message); // Set error message
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, [auth.accessToken]); // Re-fetch data if access token changes

  // Handle checkout
  const handleCheckout = async () => {
    try {
      const response = await axiosPrivate.post(
        'users/checkout',
        {
          headers: { 'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.accessToken}`,
          },
          withCredentials: true,
        }
      );

      // Update the UI after successful checkout
      setRoomDetails(null); // Clear room details
      setOrders([]); // Clear orders
      setServices([]); // Clear services

      // Optionally, update the auth state to reflect the checkout
      setauth((prev) => ({
        ...prev,
        roomNo: null, // Clear roomNo in the auth state
      }));

      console.log('Checkout successful:', response.data);
    } catch (err) {
      console.error('Error during checkout:', err);
      setError(err.message); // Set error message
    }
  };

  // Display loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h4">Loading...</Typography>
      </Box>
    );
  }

  // Display error state
  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h4" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container rowSpacing={3} columnSpacing={3}>
        {/* First Grid - Welcome Message */}
        <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
          <Paper
            elevation={3}
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexGrow: 1,
              backgroundColor: 'primary.main',
              borderRadius: 2,
              p: 3,
              color: 'white',
            }}
          >
            <Typography variant="h2" component="div"
              sx={{
                fontSize: {
                  xs: '1.7rem', 
                  sm: '3rem',   
                  md: '3rem',   
                },
              }}>
              Hello user <br />
              Welcome to Servease!
            </Typography>
          </Paper>
        </Grid>

        {/* Second Grid - Room Details */}
        <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
          <Paper
            elevation={3}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              flexGrow: 1,
              backgroundColor: 'white',
              borderRadius: 2,
              p: 3,
            }}
          >
            <Typography variant="h5" component="div" gutterBottom>
              Room Details
            </Typography>
            {roomDetails ? (
              <>
                <Typography variant="h6">Room No: {roomDetails.roomNo}</Typography>
                <Typography variant="h6">Type: {roomDetails.roomType}</Typography>
                <Typography variant="h6">Check-in Date: {roomDetails.checkInDate}</Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  sx={{ mt: 2 }}
                  onClick={handleCheckout} // Add onClick handler
                >
                  Checkout
                </Button>
              </>
            ) : (
              <Typography variant="h6">No room details available.</Typography>
            )}
          </Paper>
        </Grid>

        {/* Third Grid - Orders and Services List */}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              backgroundColor: '#f5f5f5',
              borderRadius: 2,
              p: 3,
            }}
          >
            <Typography variant="h5" component="div" gutterBottom>
              Orders and Services
            </Typography>
            <List>
              {/* Render Orders */}
              {orders.length > 0 ? (
                orders.map((order) => (
                  <ListItem key={order._id}>
                    <ListItemText
                      primary={`Order: ${order.name}`}
                      secondary={
                        <>
                          {`Status: ${order.status}`} <br />
                          {`Requested Time: ${new Date(order.orderedAt).toLocaleString()}`}
                        </>
                      }
                    />
                  </ListItem> 
                  
                ))
              ) : (
                <Typography variant="body1">No served orders found.</Typography>
              )}

              {/* Render Services */}
              {services.length > 0 ? (
                services.map((service) => (
                  <ListItem key={service._id}>
                    <ListItemText
                      primary={`Service: ${service.type}`}
                      secondary={
                        <>
                          {`Status: ${service.status}`} <br />
                          {`Requested Time: ${new Date(service.requestedTime).toLocaleString()}`}
                        </>
                      }
                    />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body1">No provided services found.</Typography>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;