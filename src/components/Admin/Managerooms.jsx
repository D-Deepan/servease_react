import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useAxiosPrivate from '../../hooks/useAxiosprivate';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';

const fetchroomsurl = '/admin/allrooms';
const deleteroomsurl = '/admin/deleteroom'; 
const createroomurl = '/admin/createroom';

function ManageRooms() {
    const { auth } = useAuth();
    const axiosprivate = useAxiosPrivate();
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [newRoom, setNewRoom] = useState({
      roomNo: '',
      type: '',
      price: '',
    });
  
    // Fetch all rooms
    const fetchAllRooms = async (accessToken) => {
      try {
        const response = await axiosprivate.get(fetchroomsurl, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        });
  
        console.log('Rooms fetched successfully:', response.data);
        return response.data.rooms || [];
      } catch (error) {
        console.error('Fetch error:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch rooms');
      }
    };
  
    // Create a new room
    const createRoom = async () => {
      try {
        const response = await axiosprivate.post(
          createroomurl,
          { ...newRoom },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${auth.accessToken}`,
            },
            withCredentials: true,
          }
        );
  
        console.log('Room created successfully:', response.data);
  
        // Update state with the new room
        setRooms((prevRooms) => [...prevRooms, response.data.room]);
  
        // Reset form fields
        setNewRoom({ roomNo: '', type: '', price: '' });
      } catch (error) {
        console.error('Create room error:', error);
        setError(error.response?.data?.message || 'Failed to create room');
      }
    };
  
    // Delete a room
    const deleteRoom = async (roomNo) => {
      try {
        
        await axiosprivate.delete(deleteroomsurl, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.accessToken}`,
          },
          data:{ roomNo},
          withCredentials: true,
        });
  
        // Remove the deleted room from the state
        setRooms((prevRooms) => prevRooms.filter((room) => room.roomNo !== roomNo));
        console.log('Room deleted successfully');
      } catch (error) {
        console.error('Delete error:', error);
        setError(error.response?.data?.message || 'Failed to delete room');
      }
    };
  
    useEffect(() => {
      const getRooms = async () => {
        try {
          const fetchedRooms = await fetchAllRooms(auth.accessToken);
          setRooms(fetchedRooms);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      getRooms();
    }, [auth.accessToken]);
  
    if (error) {
      return <Alert severity="error">{error}</Alert>;
    }
  
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      );
    }
  
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Room Management
        </Typography>
  
        {/* Create Room Form */}
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2,maxWidth:600 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
            Create New Room
          </Typography>
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              createRoom();
            }}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              fullWidth
              label="Room Number"
              value={newRoom.roomNo}
              onChange={(e) => setNewRoom({ ...newRoom, roomNo: e.target.value })}
              required
            />
            <Select
              fullWidth
              value={newRoom.type}
              onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
              displayEmpty
              required
            >
              <MenuItem value="" disabled>Select Room Type</MenuItem>
              <MenuItem value="single">Single</MenuItem>
              <MenuItem value="double">Double</MenuItem>
              <MenuItem value="suite">Suite</MenuItem>
            </Select>
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={newRoom.price}
              onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
              required
            />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              Create Room
            </Button>
          </Box>
        </Paper>
  
        {/* Room List */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Room List
        </Typography>
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Room Number</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.roomNo}>
                  <TableCell>{room.roomNo}</TableCell>
                  <TableCell>
                    <Chip
                      label={room.type}
                      color={
                        room.type === 'single' ? 'primary' :
                        room.type === 'double' ? 'secondary' : 'info'
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={room.isBooked ? 'Occupied' : 'Available'}
                      color={room.isBooked ? 'error' : 'success'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {!room.isBooked && ( // Only render the button if the room is not booked
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => deleteRoom(room.roomNo)}
                      >
                        Delete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  
  }
  
  export default ManageRooms;