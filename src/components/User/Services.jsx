import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosprivate';
import useAuth from '../../hooks/useAuth';
import { 
  Grid,
  Paper,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Chip,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Services = () => {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  
  // State variables
  const [type, setType] = useState('');
  const [comments, setComments] = useState('');
  const [message, setMessage] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'pending': return 'warning.main';
      case 'in progress': return 'info.main';
      case 'completed': return 'success.main';
      default: return 'primary.main';
    }
  };

  // Function to fetch all services
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get('/services/fetchservices', {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
        withCredentials: true,
      });
      const services = response.data.services;
      setServices(services.filter((service) => service.roomNo === auth.roomNo));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      setLoading(false);
    }
  };

  const deleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service request?')) {
      return;
    }

    try {
      await axiosPrivate.delete(`/services/deleteservice`,{
        data :{serviceId},
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.accessToken}`          
        },
        withCredentials: true,
      });

      setMessage('Service request deleted successfully');
      fetchServices(); // Refresh service list after deletion
    } catch (error) {
      console.error('Error deleting service:', error);
      setMessage('Failed to delete service request');
    }
  };

  // Fetch services when component mounts
  useEffect(() => {
    if (auth?.accessToken) {
      fetchServices();
    }
  }, [auth]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.post(
        '/services/createservice',
        { roomNo: auth.roomNo, type, comments },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.accessToken}`,
          },
          withCredentials: true,
        }
      );
      setMessage(response.data.message);
      setType('');
      setComments('');
      
      // Fetch updated service list after request submission
      fetchServices();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error submitting request');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
        Request a Service
      </Typography>
  
      <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Paper elevation={3} sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2, 
          width: '70%', 
          maxWidth: { xs: '100%', sm: '600px' },
          marginLeft: '0%'
        }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} direction="column">
              <Grid item xs={12}>
                <Select
                  fullWidth
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  displayEmpty
                  required
                  variant="outlined"
                  size="medium"
                  sx={{ maxWidth: 400 }}
                >
                  <MenuItem value="" disabled>Select Service Type</MenuItem>
                  <MenuItem value="Laundry">Laundry</MenuItem>
                  <MenuItem value="Amenities">Amenities</MenuItem>
                  <MenuItem value="Maintenance">Maintenance</MenuItem>
                </Select>
              </Grid>
  
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  variant="outlined"
                  multiline
                  rows={3}
                  sx={{ maxWidth: 600 }}
                />
              </Grid>
  
              <Grid item xs={12}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  sx={{
                    fontSize: { xs: '0.8rem', sm: '1rem', md: '1rem' }, // Responsive font size
                    px: { xs: 2, sm: 3, md: 4 }, // Adjust horizontal padding
                    py: { xs: 1, sm: 1.2, md: 1.5 }, // Adjust vertical padding
                    mt: 1,
                    width: { xs: '100%', sm: 'auto' }, // Full-width button on small screens
                  }}
                >
                  Submit Request
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
  

      {message && (
        <Alert 
          severity={message.includes('success') ? 'success' : 'error'} 
          sx={{ mb: 3 }}
          onClose={() => setMessage('')}
        >
          {message}
        </Alert>
      )}

      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Requested Services
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {services.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="body1">No services requested yet.</Typography>
            </Grid>
          ) : (
            services.map((service) => (
              <Grid item xs={12} key={service._id}>
                <Box sx={{ maxWidth: 900 }}>
                <Paper elevation={3} sx={{ p: 2, borderRadius: 2, position: 'relative' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {service.type}
                      </Typography>
                      <Chip
                        label={service.status}
                        sx={{
                          backgroundColor: getStatusColor(service.status),
                          color: 'white',
                          fontWeight: 500,
                          mb: 1
                        }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Comments: {service.comments || 'No comments'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Room: {service.roomNo}
                      </Typography>
                    </Box>

                    <IconButton 
                      onClick={() => deleteService(service._id)}
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
                </Paper>
                </Box>
              </Grid>
            ))
          )}
        </Grid>
      )}
    </Box>
  );
};

export default Services;
