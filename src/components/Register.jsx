import React, { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import Link from '@mui/material/Link';
import axios from '../api/axios';

const RegisterUrl = "/users/register";

function Register() {
  const userRef = useRef();
  const errRef = useRef();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        RegisterUrl,
        JSON.stringify({ name, email, password }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));
      setName('');
      setEmail('');
      setPassword('');
      setSuccess(true);
    } catch (error) {
      if (error.response) {
        console.error('Server responded with an error:', error.response.data);
        setErr(
          `Error: ${error.response.data.message || 'Something went wrong on the server'}`
        );
      } else if (error.request) {
        console.error('No response from server:', error.request);
        setErr('No response from server. Please try again later.');
      } else {
        console.error('Error in request setup:', error.message);
        setErr(`Error: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErr('');
  }, [name, email, password]);

  return (
    <>
      {success ? (
        <section>
          <h1>Registration Successful!</h1>
          <p>
            <Link href="/Login">Login here</Link>
          </p>
        </section>
      ) : (
        <Box
          sx={{
            minHeight: 'calc(100vh - 80px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f0f0f0',
            overflow: 'hidden',
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
            {err && (
              <p
                ref={errRef}
                style={{ color: 'red', marginBottom: '10px' }}
              >
                {err}
              </p>
            )}
            <TextField
              sx={{ p: 0, mt: 1 }}
              fullWidth
              label="Name*"
              id="name"
              inputRef={userRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              sx={{ p: 0, mt: 1 }}
              fullWidth
              label="Email*"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              sx={{ p: 0, mt: 1 }}
              fullWidth
              label="Password*"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                mt: 1,
                mb: 2,
              }}
            >
              <Link href="/login" sx={{ textDecoration: 'none', color: 'primary.main' }}>
                Login here
              </Link>
            </Box>

            <Button
              sx={{ mt: 1, width: '100%' }}
              variant="contained"
              type="submit"
              onClick={handleSubmit}
            >
              Register
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
}

export default Register;
