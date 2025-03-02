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

const fetchusersurl = '/admin/allusers';
const deleteuserurl = '/admin/deleteuser'; // Endpoint to delete a user
const createuserurl = '/admin/createuser';
function Manageusers() {
  const axiosprivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  // Fetch all users
  const fetchAllUsers = async () => {
    try {
      const response = await axiosprivate.get(fetchusersurl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth?.accessToken}`,
        },
        withCredentials: true,
      });

      console.log('Users fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Fetch error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  };

  const createUser = async () => {
    try {
      const response = await axiosprivate.post(
        createuserurl,
        { ...newUser },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.accessToken}`,
          },
          withCredentials: true,
        }
      );

      console.log('User created successfully:', response.data);

      // Update state with the new user
      setUsers((prevUsers) => [...prevUsers, response.data.user]);

      // Reset form fields
      setNewUser({ name: '', email: '', password: '', role: '' });
    } catch (error) {
      console.error('Create user error:', error);
      setError(error.response?.data?.message || 'Failed to create user');
    }
  };
  
  // Delete a user
  const deleteUser = async (userId) => {
    try {
      await axiosprivate.delete(deleteuserurl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.accessToken}`,
        },
        data: { userId },
        withCredentials: true,
      });

      // Remove the deleted user from the state
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      console.log('User deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      setError(error.response?.data?.message || 'Failed to delete user');
    }
  };

  useEffect(() => {
    const getUsers = async () => {
      try {
        console.log("effect here ");
        const fetchedUsers = await fetchAllUsers();
        setUsers(Array.isArray(fetchedUsers) ? fetchedUsers : fetchedUsers.users || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
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
        User Management
      </Typography>

      {/* Create User Form */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2,maxWidth:600 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
          Create New User
        </Typography>
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            createUser();
          }}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            fullWidth
            label="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            required
          />
          <Select
            fullWidth
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            displayEmpty
            required
          >
            <MenuItem value="" disabled>Select Role</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
            <MenuItem value="customer">Customer</MenuItem>
          </Select>
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Create User
          </Button>
        </Box>
      </Paper>

      {/* User List */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        User List
      </Typography>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Room No</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color={user.role === 'manager' ? 'primary' : 'secondary'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  {user.roomNo ? (
                    <Chip label={user.roomNo} color="success" variant="outlined" />
                  ) : (
                    <Chip label="Not allocated" color="error" variant="outlined" />
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => deleteUser(user._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Manageusers;