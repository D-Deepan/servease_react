import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosprivate';
import useAuth from '../../hooks/useAuth';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


function Food() {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  const [foodItems, setFoodItems] = useState([]);
  const [orderMessage, setOrderMessage] = useState("");
  const [quantities, setQuantities] = useState({});

  // Fetch available food items
  const fetchFoodItems = async () => {
    try {
      const response = await axiosPrivate.get("food/fetch", {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.accessToken}`,
        },
        withCredentials: true,
      });

      const availableFoods = response.data.foods.filter(food => food.availability);
      setFoodItems(availableFoods);

      // Initialize quantity state to 0
      const initialQuantities = {};
      availableFoods.forEach(food => {
        initialQuantities[food._id] = 0;
      });
      setQuantities(initialQuantities);
    } catch (error) {
      console.error("Error fetching food items:", error);
    }
  };

  useEffect(() => {
    fetchFoodItems();
  }, []);

  // Increment quantity
  const incrementQuantity = (foodId) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [foodId]: prevQuantities[foodId] + 1,
    }));
  };

  // Decrement quantity (stays at 0)
  const decrementQuantity = (foodId) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [foodId]: Math.max(0, prevQuantities[foodId] - 1),
    }));
  };

  // Place order
  const placeOrder = async (foodId) => {
    if (quantities[foodId] === 0) return; // Prevent ordering 0 quantity

    try {
      const quantity = quantities[foodId];
      await axiosPrivate.post(
        "orders/place",
        { foodId, roomNo: auth.roomNo, quantity },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.accessToken}`,
          },
          withCredentials: true,
        }
      );

      setOrderMessage(`Order placed successfully for ${quantity} ${quantity > 1 ? "items" : "item"}!`);
      
      // Reset quantity to 0 after ordering
      setQuantities(prevQuantities => ({
        ...prevQuantities,
        [foodId]: 0,
      }));

      setTimeout(() => setOrderMessage(""), 3000); // Clear message after 3 seconds
    } catch (error) {
      console.error("Error placing order:", error);
      setOrderMessage("Failed to place order.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Food Menu
      </Typography>
      
      {orderMessage && (
        <Typography variant="body1" sx={{ mb: 2, color: 'success.main' }}>
          {orderMessage}
        </Typography>
      )}

      <Grid container spacing={3}>
        {foodItems.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="body1">No food items available.</Typography>
          </Grid>
        ) : (
          foodItems.map((food) => (
            <Grid item xs={12} md={6} key={food._id}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center'
                }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: '600' }}>
                      {food.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      ₹{food.price}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      onClick={() => decrementQuantity(food._id)}
                      sx={{ minWidth: '32px' }}
                    >
                      -
                    </Button>
                    
                    <Typography variant="body1" sx={{ mx: 1 }}>
                      {quantities[food._id]}
                    </Typography>
                    
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      onClick={() => incrementQuantity(food._id)}
                      sx={{ minWidth: '32px' }}
                    >
                      +
                    </Button>
                    
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => placeOrder(food._id)}
                      disabled={quantities[food._id] === 0}
                      sx={{ ml: 2 }}
                    >
                      Order
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}


export default Food;