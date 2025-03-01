import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Drawer } from '@mui/material';
import List from '@mui/material/List';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useLogout from '../hooks/useLogout';

export default function Homebar() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();  // Hook from react-router-dom
  const { auth } = useAuth();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

const logout = useLogout();

const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        <ListItem key="Home" disablePadding>
          <ListItemButton component={Link} to="/">
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        {auth?.role === 'admin' && (
          <>
            <ListItem key="Users" disablePadding>
              <ListItemButton component={Link} to="/Manageusers">
                <ListItemText primary="Manage Users" />
              </ListItemButton>
            </ListItem>
            <ListItem key="Rooms" disablePadding>
              <ListItemButton component={Link} to="/Managerooms">
                <ListItemText primary="Manage Rooms" />
              </ListItemButton>
            </ListItem>            
            <ListItem key="Complaints" disablePadding>
              <ListItemButton component={Link} to="/Managecomplaints">
                <ListItemText primary="Complaints" />
              </ListItemButton>
            </ListItem>
           </>
        )}
        {auth?.role === 'customer'  && (
          <>
            <ListItem key="Dashboard" disablePadding>
              <ListItemButton component={Link} to="/dashboard">
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            <ListItem key="Food" disablePadding>
              <ListItemButton component={Link} to="/food">
                <ListItemText primary="Food" />
              </ListItemButton>
            </ListItem>
            <ListItem key="Orders" disablePadding>
              <ListItemButton component={Link} to="/orders">
                <ListItemText primary="Orders" />
              </ListItemButton>
            </ListItem>
            <ListItem key="Services" disablePadding>
              <ListItemButton component={Link} to="/services">
                <ListItemText primary="Services" />
              </ListItemButton>
            </ListItem>
            <ListItem key="Complaints" disablePadding>
              <ListItemButton component={Link} to="/complaints">
                <ListItemText primary="Complaints" />
              </ListItemButton>
            </ListItem>
          </>
        )}
        {auth?.role === 'manager' && (
          <>
            <ListItem key="Manageservices" disablePadding>
              <ListItemButton component={Link} to="/Manageservices">
                <ListItemText primary="Manage services" />
              </ListItemButton>
            </ListItem>
            <ListItem key="Managefood" disablePadding>
              <ListItemButton component={Link} to="/Managefood">
                <ListItemText primary="Manage food" />
              </ListItemButton>
            </ListItem>
            <ListItem key="Manageorders" disablePadding>
              <ListItemButton component={Link} to="/Manageorders">
                <ListItemText primary="Manage orders" />
              </ListItemButton>
            </ListItem>
            <ListItem key="Allocation" disablePadding>
              <ListItemButton component={Link} to="/Roomallocation">
                <ListItemText primary="Roomallocation" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  const handleLoginClick = () => {
    navigate('/login');  // This will navigate to the login route
  };

  const handleregisterClick = () => {
    navigate('/register');
  }
  
  const handleLogoutClick = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
          >
            ServEase
          </Typography>
          {!auth?.role ? (<Button color="inherit" onClick={handleLoginClick}>Login</Button>)
                : (<Button color="inherit" onClick={handleLogoutClick}>Logout</Button>)}
        </Toolbar>
      </AppBar>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <Typography variant="h6" sx={{ p: 2, backgroundColor: "lightgrey" }}>ServEase</Typography>
        {DrawerList}
      </Drawer>
    </Box>
  );
}
