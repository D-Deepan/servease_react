import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useAxiosPrivate from '../../hooks/useAxiosprivate';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';

const Managecomplaints = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth(); // Get user role
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch unchecked complaints
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get("complaints/getcomplaints",{
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth?.accessToken}`,
          },
          withCredentials: true,       
      });
      setComplaints(response.data.complaints);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setMessage("Failed to fetch complaints.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Mark complaint as checked
  const markAsChecked = async (complaintId) => {
    if (!window.confirm(`Are you sure you want to mark as reviewed`)) {
        return;
      }    
    try {
      await axiosPrivate.put("complaints/markcomplaint", { complaintId },{
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth?.accessToken}`,
          },
          withCredentials: true,
      });
      setMessage("Complaint marked as reviewed.");
      fetchComplaints(); // Refresh the list after marking as checked
    } catch (error) {
      console.error("Error updating complaint:", error);
      setMessage("Failed to update complaint.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Pending Complaints
      </Typography>

      {message && (
        <Alert severity={message.includes("reviewed") ? "success" : "error"} sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : complaints.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No pending complaints.
          </Typography>
        </Paper>
      ) : (
        <List sx={{ width: '100%', maxWidth:900 }}>
          {complaints.map((complaint) => (
            <React.Fragment key={complaint._id}>
              <Paper elevation={3} sx={{ mb: 2, p: 2, borderRadius: 2 }}>
                <ListItem alignItems="flex-start" sx={{ flexDirection: 'column' }}>
                  <Box sx={{ width: '100%', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Room: {complaint.roomNo}
                    </Typography>
                  </Box>
                  <Box sx={{ width: '100%', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Subject:</strong> {complaint.subject}
                    </Typography>
                  </Box>
                  <Box sx={{ width: '100%', mb: 1 }}>
                    <Typography variant="body1">
                      <strong>Details:</strong> {complaint.details}
                    </Typography>
                  </Box>
                  <Box sx={{ width: '100%', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Requested Time: {new Date(complaint.requestedTime).toLocaleString()}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => markAsChecked(complaint._id)}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    Mark as Reviewed
                  </Button>
                </ListItem>
              </Paper>
              <Divider sx={{ my: 2 }} />
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

export default Managecomplaints;
