import axios from 'axios';

// Connects to local backend
const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Add token to requests if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const fetchAsteroids = () => API.get('/asteroids/feed');
export const loginUser = (formData) => API.post('/auth/login', formData);
export const registerUser = (formData) => API.post('/auth/register', formData);