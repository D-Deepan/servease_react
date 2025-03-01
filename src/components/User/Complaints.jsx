import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosprivate';
import useAuth from '../../hooks/useAuth';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Grid
} from '@mui/material';


const Complaints = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth(); // Get logged-in user info
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.post("/complaints/create", { roomNo: auth?.roomNo , subject, details },{
        headers: {
          'Content-Type': 'application/json',
           Authorization: `Bearer ${auth.accessToken}`         
        },
        withCredentials: true,
      });

      setMessage('your complaint has been submitted successfully');
      setSubject("");
      setDetails("");
    } catch (error) {
      console.error("Error submitting complaint:", error);
      setMessage("Failed to submit complaint");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ 
        fontWeight: 'bold', 
        color: 'primary.main', 
        mb: 3 
      }}>
        Post a Complaint
      </Typography>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-start',
        maxWidth: 600,
        mx: 'auto',
        ml: '0%'
      }}>
        <Paper elevation={3} sx={{ 
          p: 3, 
          borderRadius: 2, 
          width: '100%',
          mb: 4
        }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3} direction="column">
              {message && (
                <Grid item xs={12}>
                  <Alert 
                    severity={message.includes('success') ? 'success' : 'error'}
                    onClose={() => setMessage('')}
                  >
                    {message}
                  </Alert>
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  variant="outlined"
                  required
                  multiline
                  rows={2}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  variant="outlined"
                  required
                  multiline
                  rows={4}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    mt: 2,
                    display: 'block',
                    marginLeft: 'auto'
                  }}
                >
                  Submit Complaint
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default Complaints;
