import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosprivate';
import useAuth from '../../hooks/useAuth';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Chip,
  Alert,
  Grid,
  Divider
} from '@mui/material';


function Managefood() {
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
  
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [message, setMessage] = useState('');
    const [foodItems, setFoodItems] = useState([]);
  
    // Fetch all food items
    const fetchFoodItems = async () => {
      try {
        const response = await axiosPrivate.get('food/fetchmenu', {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
          withCredentials: true,
        });
  
        setFoodItems(response.data.foods);
      } catch (error) {
        console.error('Error fetching food items:', error);
      }
    };
  
    // Handle food item creation
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        await axiosPrivate.post( 'food/create',
          { name, price },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${auth.accessToken}`,
            },
            withCredentials: true,
          }
        );
  
        setMessage('Food item created successfully!');
        setName('');
        setPrice('');
        fetchFoodItems(); // Refresh list
      } catch (error) {
        console.error('Error creating food item:', error);
        setMessage('Failed to create food item.');
      }
    };
  
    // Toggle food availability
    const toggleAvailability = async (foodId, currentStatus) => {
      try {
        await axiosPrivate.put(`food/update`,
          { foodId, availability: !currentStatus },
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
            withCredentials: true,
          }
        );
  
        fetchFoodItems(); // Refresh list
      } catch (error) {
        console.error('Error updating availability:', error);
      }
    };
  
    // Delete food item
    const deleteFoodItem = async (foodId) => {
      if (!window.confirm('Are you sure you want to delete this food item?')) return;
  
      try {
        await axiosPrivate.delete(`/food/delete`, {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
          data:{foodId: foodId },
          withCredentials: true,
        });
        fetchFoodItems(); // Refresh list
      } catch (error) {
        console.error('Error deleting food item:', error);
      }
    };
  
    useEffect(() => {
      fetchFoodItems();
    }, []);
  
    return (
      <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ 
        fontWeight: 'bold', 
        color: 'primary.main', 
        mb: 3
      }}>
        Manage Food Items
      </Typography>

      {message && (
        <Alert 
          severity={message.includes('success') ? 'success' : 'error'} 
          sx={{ mb: 3 }}
          onClose={() => setMessage('')}
        >
          {message}
        </Alert>
      )}

      {/* Input Form */}
      <Paper elevation={3} sx={{ 
        p: 3, 
        mb: 4, 
        borderRadius: 2,
        maxWidth: 400
      }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Create New Food Item
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Food Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Price (₹)"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                variant="outlined"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                fullWidth
                sx={{ py: 1.5 }}
              >
                Create Food Item
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Food Items List */}
      <Typography variant="h5" gutterBottom sx={{ 
        fontWeight: 'bold', 
        mb: 3 
      }}>
        Existing Food Items
      </Typography>

      {foodItems.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No food items available
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3} >
          {foodItems.map((food) => (
            <Grid item xs={12} sm={6} md={4} key={food._id} sx={{ mb: 4 }}>
              <Paper elevation={3} sx={{ 
                p: 2, 
                borderRadius: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {food.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                    ₹{food.price}
                  </Typography>

                  <Chip
                    label={food.availability ? 'Available' : 'Not Available'}
                    sx={{ 
                      backgroundColor: food.availability ? 'success.main' : 'error.main',
                      color: 'white',
                      fontWeight: 500
                    }}
                  />
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  gap: 1,
                  mt: 2
                }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    onClick={() => toggleAvailability(food._id, food.availability)}
                  >
                    {food.availability ? 'Make Unavailable' : 'Make Available'}
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => deleteFoodItem(food._id)}
                  >
                    Delete
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
  };

export default Managefood;