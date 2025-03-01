import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import useAxiosPrivate from '../../hooks/useAxiosprivate';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';

const Roomallocation = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [customers, setCustomers] = useState([]); // List of customers
  const [rooms, setRooms] = useState([]); // List of available rooms
  const [selectedCustomer, setSelectedCustomer] = useState(null); // Selected customer for allocation
  const [selectedRoomType, setSelectedRoomType] = useState(''); // Selected room type
  const [availableRooms, setAvailableRooms] = useState([]); // Available rooms based on type

  // Fetch all customers with role 'customer'
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axiosPrivate.get('users/getusers', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.accessToken}`,
          },
          withCredentials: true,
        });
  
        // Ensure the response is an array
        const customersArray = Array.isArray(response.data) ? response.data : response.data.customers || [];
        setCustomers(customersArray);
        console.log(customersArray);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
  
    fetchCustomers();
  }, []);

  // Fetch available rooms based on type
  useEffect(() => {
    const fetchAvailableRooms = async () => {
      if (selectedRoomType) {
        try {
          const response = await axiosPrivate.get('rooms/allrooms', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${auth.accessToken}`,
            },
            withCredentials: true,
          });         
         setAvailableRooms(response.data.rooms.filter(room => !room.isBooked && room.type === selectedRoomType));
        } catch (error) {
          console.error('Error fetching available rooms:', error);
        }
      }
    };

    fetchAvailableRooms();
  }, [selectedRoomType]);

  // Handle allocation of a room to a customer
  const handleAllocate = async (customerId, roomNo) => {
    try {
      await axiosPrivate.put('rooms/allot',
        { userId: customerId, roomNo: roomNo},{
         headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.accessToken}`,
        },
        withCredentials: true,
      });     
       const response = await axiosPrivate.get('users/getusers', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.accessToken}`,
        },
        withCredentials: true,
      });

      // Ensure the response is an array
      const customersArray = Array.isArray(response.data) ? response.data : response.data.customers || [];
      setCustomers(customersArray);
      setSelectedCustomer(null); // Reset selected customer
      setSelectedRoomType(''); // Reset selected room type
      setAvailableRooms([]); // Reset available rooms
    } catch (error) {
      console.error('Error allocating room:', error);
      alert('Failed to allocate room.');
    }
  };

  // Handle checkout of a customer
  const handleCheckout = async (customerId) => {
    try {
      await axiosPrivate.put('rooms/checkout', 
        { userId: customerId},{
          headers: {
           'Content-Type': 'application/json',
           Authorization: `Bearer ${auth.accessToken}`,
         },
         withCredentials: true,
       });   
      const response = await axiosPrivate.get('users/getusers', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.accessToken}`,
        },
        withCredentials: true,
      });

      // Ensure the response is an array
      const customersArray = Array.isArray(response.data) ? response.data : response.data.customers || [];
      setCustomers(customersArray);
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Failed to checkout.');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Room Allocation
      </Typography>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Room No</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer._id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>
                  {customer.roomNo ? (
                    <Chip 
                      label={customer.roomNo} 
                      color="success" 
                      variant="outlined"
                    />
                  ) : (
                    <Chip 
                      label="Not allocated" 
                      color="error" 
                      variant="outlined"
                    />
                  )}
                </TableCell>
                <TableCell>
                  {customer.roomNo ? (
                    <Button 
                      variant="contained" 
                      color="error"
                      onClick={() => handleCheckout(customer._id)}
                    >
                      Checkout
                    </Button>
                  ) : (
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={() => setSelectedCustomer(customer._id)}
                    >
                      Allocate
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Allocation Dialog */}
      <Dialog 
          open={Boolean(selectedCustomer)} 
          onClose={() => setSelectedCustomer(null)}
          maxWidth="sm"
          fullWidth
          sx={{
            '& .MuiDialog-paper': {
              width: window.innerWidth < 450 ? '90%' : '100%',
              maxWidth: window.innerWidth < 450 ? '300px' : '600px'
            }
          }}
        >
        <DialogTitle>Allocate Room</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Select
              fullWidth
              value={selectedRoomType}
              onChange={(e) => setSelectedRoomType(e.target.value)}
              displayEmpty
              sx={{ mb: 3 }}
            >
              <MenuItem value="" disabled>Select room type</MenuItem>
              <MenuItem value="single">Single</MenuItem>
              <MenuItem value="double">Double</MenuItem>
              <MenuItem value="suite">Suite</MenuItem>
            </Select>

            {availableRooms.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Available Rooms
                </Typography>
                <List>
                  {availableRooms.map((room) => (
                    <ListItem 
                      key={room.roomNo}
                      sx={{
                        flexDirection: window.innerWidth < 450 ? 'column' : 'row',
                        alignItems: window.innerWidth < 450 ? 'flex-start' : 'center',
                        gap: window.innerWidth < 450 ? 1 : 0
                      }}
                    >
                      <ListItemText
                        primary={`Room No: ${room.roomNo}`}
                        secondary={`Type: ${room.type} | Price: $${room.price}`}
                        sx={{
                          '& .MuiListItemText-secondary': {
                            display: 'block',
                            mt: window.innerWidth < 450 ? 0.5 : 0
                          }
                        }}
                      />
                      <Button 
                        variant="contained"
                        size={window.innerWidth < 450 ? 'small' : 'medium'}
                        onClick={() => handleAllocate(selectedCustomer, room.roomNo)}
                        sx={{
                          fontSize: window.innerWidth < 450 ? '0.7rem' : '0.875rem',
                          px: window.innerWidth < 450 ? 1 : 2,
                          py: window.innerWidth < 450 ? 0.25 : 1,
                          mt: window.innerWidth < 450 ? 1 : 0,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {window.innerWidth < 450 ? 'Allocate' : 'Allocate'}
                      </Button>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedCustomer(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Roomallocation;