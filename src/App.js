import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import "./components/Homebar.jsx"
import Homebar from './components/Homebar.jsx';
import Services from './components/User/Services.jsx';  
import Food from './components/User/Food.jsx';
import Orders from './components/User/Orders.jsx';
import Complaints from './components/User/Complaints.jsx';
import Home from './components/Home';
import Dashboard from './components/User/Dashboard.jsx'
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import RequireAuth from './components/RequireAuth.jsx';
import Unauthorised from './components/unauthorised.jsx';
import Manageusers from './components/Admin/Manageusers.jsx';
import PersistLogin from './components/PersistLogin.jsx';
import Managerooms from './components/Admin/Managerooms.jsx';
import Roomallocation from './components/Manager/Roomallocation.jsx';
import Waitingroom from './components/waitingroom.jsx';
import Manageservices from './components/Manager/Manageservices.jsx';
import Managecomplaints from './components/Admin/Managecomplaints.jsx';
import Managefood from './components/Manager/Managefood.jsx';
import Manageorders from './components/Manager/Manageorders.jsx';

const Roles = {
    'user': 'customer',
    'manager':'manager',
    'admin':'admin'
}
function App() {
  return (
    <Router>
      <Homebar/>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorised" element={<Unauthorised />} />
        <Route element={<PersistLogin />}>
        <Route path="/" element={<Home />} />
        <Route element={<RequireAuth allowedroles={[Roles.user]}/>}>
           <Route path="/services" element={<Services />} />
           <Route path="/dashboard" element={<Dashboard />} />
           <Route path="/food" element={<Food />} />
           <Route path="/orders" element={<Orders />} />
           <Route path="/complaints" element={<Complaints />} />
        </Route>
        <Route element={<RequireAuth allowedroles={[Roles.admin]}/>}>
           <Route path="/Managecomplaints" element={<Managecomplaints />} />
           <Route path="/Manageusers" element={<Manageusers />} />
           <Route path="/Managerooms" element={<Managerooms />} />
        </Route>
        <Route element={<RequireAuth allowedroles={[Roles.manager]}/>}>
           <Route path="/Roomallocation" element={<Roomallocation />} />
           <Route path="/Manageservices" element={<Manageservices />} />
           <Route path="/Managefood" element={<Managefood />} />
           <Route path="/Manageorders" element={<Manageorders />} />
        </Route>
        <Route path="/waitingroom" element={<Waitingroom />} />
        </Route>
      </Routes>
    </Router>
    
  )
}

export default App;
