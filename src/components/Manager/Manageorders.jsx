import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosprivate';
import useAuth from '../../hooks/useAuth';
import {
    Box,
    Paper,
    Typography,
    Button,
    Chip,
    Alert
  } from '@mui/material';

function Manageorders() {
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const [orders, setOrders] = useState([]);

    const getStatusColor = (status) => {
        switch(status.toLowerCase()) {
          case 'queued': return 'warning.main';
          case 'preparing': return 'info.main';
          case 'served': return 'success.main';
          default: return 'primary.main';
        }
      };
    const fetchOrders = async () => {
        try {
            const response = await axiosPrivate.get('orders/fetchall', {
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`,
                },
                withCredentials: true,
            });

            setOrders(response.data.orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    // Function to update order status
    const updateOrderStatus = async (orderId, currentStatus) => {
        let newStatus;
        if (currentStatus === 'queued') newStatus = 'preparing';
        else if (currentStatus === 'preparing') newStatus = 'served';
        else return;

        try {
            await axiosPrivate.put('orders/update', 
                { orderid: orderId, status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${auth.accessToken}`,
                    },
                    withCredentials: true,
                }
            );

            fetchOrders(); // Refresh orders after update
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <Box sx={{ p: 3, maxWidth: 1100, ml: 0 }}>
          <Typography variant="h4" gutterBottom sx={{ 
            fontWeight: 'bold', 
            color: 'primary.main', 
            mb: 3 
          }}>
            Manage Food Orders
          </Typography>
    
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {orders.length === 0 ? (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No orders available
                </Typography>
              </Paper>
            ) : (
              orders.map((order) => (
                <Paper 
                  key={order._id}
                  elevation={3} 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    position: 'relative',
                    minHeight: 150
                  }}
                >
                  {/* Status Chip - Top Right */}
                  <Box sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16
                  }}>
                    <Chip 
                      label={order.status}
                      sx={{ 
                        backgroundColor: getStatusColor(order.status),
                        color: 'white',
                        fontWeight: 500,
                        fontSize: '0.9rem',
                        padding: '4px 12px'
                      }}
                    />
                  </Box>
    
                  {/* Order Details */}
                  <Box sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    pr: 12,
                    mb: 6
                  }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Room Number
                      </Typography>
                      <Typography variant="h6">{order.roomNo}</Typography>
                    </Box>
    
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Food Item
                      </Typography>
                      <Typography variant="h6">{order.foodId.name}</Typography>
                    </Box>
    
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Quantity
                      </Typography>
                      <Typography variant="body1">{order.quantity}</Typography>
                    </Box>
                  </Box>
    
                  {/* Action Button - Bottom Right */}
                  {order.status !== 'served' && (
                    <Box sx={{
                      position: 'absolute',
                      bottom: 16,
                      right: 16
                    }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="medium"
                        onClick={() => updateOrderStatus(order._id, order.status)}
                        sx={{ 
                          whiteSpace: 'nowrap',
                          fontSize: '0.875rem',
                          px: 3,
                          py: 1
                        }}
                      >
                        {order.status === 'queued' ? 'Mark as Preparing' : 'Mark as Served'}
                      </Button>
                    </Box>
                  )}
                </Paper>
              ))
            )}
          </Box>
        </Box>
      );
}


export default Manageorders;