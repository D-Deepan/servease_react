import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosprivate';
import useAuth from '../../hooks/useAuth';
import { 
  Grid, 
  Paper, 
  Box, 
  Typography, 
  Button, 
  Chip,
  IconButton 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
function Orders() {
const axiosPrivate = useAxiosPrivate();
const { auth } = useAuth();

const [orders, setOrders] = useState([]);
const [message, setMessage] = useState("");

// Fetch customer's orders
const getStatusColor = (status) => {
  switch(status.toLowerCase()) {
    case 'preparing': return 'warning.main';
    case 'ready': return 'success.main';
    case 'delivered': return 'text.secondary';
    default: return 'primary.main';
  }
};
const fetchOrders = async () => {
  try {
    const response = await axiosPrivate.get("orders/fetch", {
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
      },
      withCredentials: true,
    });
    const orders = response.data.orders;
    setOrders(orders.filter((order) => order.roomNo === auth?.roomNo));
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

useEffect(() => {
  fetchOrders();
}, []);

// Delete order
const deleteOrder = async (orderId) => {
  try {
    await axiosPrivate.delete(`orders/delete`, {
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
      },
      data: { orderid: orderId },
      withCredentials: true,
    });

    setMessage("Order deleted successfully!");
    fetchOrders(); // Refresh orders list
    setTimeout(() => setMessage(""), 3000);
  } catch (error) {
    console.error("Error deleting order:", error);
    setMessage("Failed to delete order.");
  }
};

return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        My Orders
      </Typography>

      {message && (
        <Box sx={{ 
          backgroundColor: message.includes('success') ? 'success.light' : 'error.light',
          p: 2,
          mb: 2,
          borderRadius: 1
        }}>
          <Typography variant="body1" sx={{ color: message.includes('success') ? 'success.dark' : 'error.dark' }}>
            {message}
          </Typography>
        </Box>
      )}

      <Grid container spacing={3}>
        {orders.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="body1">No orders found.</Typography>
          </Grid>
        ) : (
          orders.map((order) => (
            <Grid item xs={12}  key={order._id} >
              <Box sx={{ maxWidth: 900 }}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 2, position: 'relative' }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start'
                }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {order.foodId.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                      Quantity: {order.quantity}
                    </Typography>
                    <Chip 
                      label={order.status}
                      sx={{ 
                        backgroundColor: getStatusColor(order.status),
                        color: 'white',
                        fontWeight: 500
                      }}
                    />
                  </Box>

                  <IconButton 
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this order?")) {
                        deleteOrder(order._id);
                      }
                    }}
                    color="error"
                    sx={{ 
                      '&:hover': { 
                        backgroundColor: 'error.light' 
                      } 
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ 
                    display: 'block', 
                    mt: 1,
                    fontStyle: 'italic'
                  }}
                >
                  Order ID: {order._id}
                </Typography>
              </Paper>
              </Box>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}


export default Orders;