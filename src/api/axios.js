import axios from 'axios';
 const BASE_URL = 'https://servease-express.onrender.com';
 const URL ="http://localhost:5000";
export default axios.create({
    baseURL : BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});