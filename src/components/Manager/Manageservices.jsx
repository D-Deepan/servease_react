import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosprivate';
import useAuth from '../../hooks/useAuth';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Alert,
  Grid,
  Divider
} from '@mui/material';

const Manageservices = () => {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [services, setServices] = useState([]);
  const [message, setMessage] = useState('');

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'requested': return 'warning.main';
      case 'pending': return 'info.main';
      case 'provided': return 'success.main';
      default: return 'primary.main';
    }
  }

  // Fetch all services
  const fetchServices = async () => {
    try {
      const response = await axiosPrivate.get('/services/fetchall', {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
        withCredentials: true,
      });
      setServices(response.data.services); // Store fetched services in state
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };
  const getNextStatus = (currentStatus) => {
    if (currentStatus === 'requested') return 'pending';
    if (currentStatus === 'pending') return 'provided';
    return 'provided';
  };
  // Update service status
  const updateStatus = async (serviceId, currentStatus) => {
    const newStatus = getNextStatus(currentStatus);
    if (!window.confirm(`Are you sure you want to update the status to ${newStatus}?`)) {
      return;
    }
    try {
      await axiosPrivate.put(
        `/services/updateservice`,
        { status: newStatus,
          serviceId: serviceId
        },
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      setMessage(`Service updated to ${newStatus}`);
      fetchServices(); // Refresh services after update
    } catch (error) {
      console.error('Error updating status:', error);
      setMessage('Failed to update status');
    }
  };

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <Box sx={{ p: 3, maxWidth: 1100, ml: 0 }}>
      <Typography variant="h4" gutterBottom sx={{ 
        fontWeight: 'bold', 
        color: 'primary.main', 
        mb: 3 
      }}>
        Service Requests
      </Typography>

      {message && (
        <Alert 
          severity={message.includes('updated') ? 'success' : 'error'} 
          sx={{ mb: 3 }}
          onClose={() => setMessage('')}
        >
          {message}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {services.map((service) => (
          <Paper 
            key={service._id}
            elevation={3} 
            sx={{ 
              p: 2, 
              borderRadius: 2,
              position: 'relative',
              minHeight: 150 // Ensure minimum height for button placement
            }}
          >
            {/* Status Chip - Top Right */}
            <Box sx={{
              position: 'absolute',
              top: 16,
              right: 16
            }}>
              <Chip 
                label={service.status}
                sx={{ 
                  backgroundColor: getStatusColor(service.status),
                  color: 'white',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  padding: '4px 12px'
                }}
              />
            </Box>

            {/* Service Details */}
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              pr: 12, // Right padding for button space
              mb: 6 // Bottom margin for button space
            }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Room Number
                </Typography>
                <Typography variant="h6">{service.roomNo}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Service Type
                </Typography>
                <Typography variant="h6">{service.type}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Comments
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontStyle: service.comments ? 'normal' : 'italic',
                    wordBreak: 'break-word', // Prevent horizontal overflow
                    whiteSpace: 'pre-wrap' // Preserve line breaks
                  }}
                >
                  {service.comments || 'No comments provided'}
                </Typography>
              </Box>
            </Box>

            {/* Action Button - Bottom Right */}
            <Box sx={{
              position: 'absolute',
              bottom: 16,
              right: 16
            }}>
              <Button
                variant="contained"
                color="primary"
                size="medium"
                onClick={() => updateStatus(service._id, service.status)}
                disabled={service.status === 'provided'}
                sx={{ 
                  whiteSpace: 'nowrap',
                  fontSize: '0.875rem',
                  px: 3,
                  py: 1
                }}
              >
                {service.status === 'requested' ? 'Mark Pending' : 
                 service.status === 'pending' ? 'Mark Provided' : 'Completed'}
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>

      {services.length === 0 && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No service requests found
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default Manageservices;
