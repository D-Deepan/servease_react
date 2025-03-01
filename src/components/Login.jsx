import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import Link from '@mui/material/Link';
import { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth'
import axios from '../api/axios'
const Loginurl = "/users/login"


function Login() {
  const { setauth, auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/" ;
  const userRef = useRef();
  const errRef = useRef();
  const [user, setuser] = useState('');
  const [pwd, setpwd] = useState('');
  const [err, seterr] = useState('');
  const handlesubmit = async(e) =>{
      e.preventDefault();
      try {
        const response = await axios.post (Loginurl, JSON.stringify({email: user, password: pwd}),
      {
        headers: {'content-Type':'application/json'},
        withCredentials: true
      });
      console.log(JSON.stringify(response?.data));
      const accessToken = response?.data?.accessToken;
      const role = response?.data?.role;
      setauth({ role, accessToken, roomNo: response.data.roomNo || null}); 
      setuser('');
      setpwd('');
      navigate(from ,{replace : true});
      } catch (error) { if (error.response) {
        // The server responded with a status other than 2xx
        console.error('Server responded with an error:', error.response.data);
        seterr(`Error: ${error.response.data.message || 'Something went wrong on the server'}`);
      } else if (error.request) {
        // No response was received from the server
        console.error('No response from server:', error.request);
        seterr('No response from server. Please try again later.');
      } else {
        // Something else caused the error
        console.error('Error in request setup:', error.message);
        seterr(`Error: ${error.message}`);
      }

  }}
  
  useEffect(() =>{
    userRef.current.focus();
  },[])
  useEffect(() =>{
    seterr('');
  },[pwd,user])
  return (
    <> 
    <Box
      sx={{
        minHeight: 'calc(100vh - 80px)',  // Full height minus the AppBar height (assuming AppBar height is 64px)
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',  // Light background for the login area
        overflow: 'hidden',  // Prevent scrolling
      }}
    >
      <Box         
        sx={{
          width: '400px',
          padding: '40px',
          backgroundColor: '#fff',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <AccountCircleSharpIcon 
          color="primary" 
          sx={{ margin: '10px', fontSize: 60 }} 
        />         
        <TextField 
          sx={{ p: 0, mt: 1 }} 
          fullWidth 
          label="email id" 
          id="email" 
          inputRef={userRef}
          value={user}
          onChange={(e)=> setuser(e.target.value)}
          required
        />
        <TextField 
          sx={{ p: 0, mt: 1 }} 
          fullWidth 
          label="Password" 
          id="Password" 
          value={pwd}
          onChange={(e)=>setpwd(e.target.value)}
          required
        />
        
        {/* Links Container */}
        <Box 
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            mt: 1,
            mb: 2,
          }}
        >
          <Link href="#" sx={{ textDecoration: 'none', color: 'primary.main' }}>
            Forgot Password
          </Link>
          <Link href="/register" sx={{ textDecoration: 'none', color: 'primary.main' }}>
          Register here
          </Link>
        </Box>
        
        <Button 
          sx={{ mt: 1, width: '100%' }} 
          variant="contained"
          type="submit"
          onClick={handlesubmit}
        >
          Login
        </Button>
      </Box>
    </Box>
  </>)
}

export default Login;
