
import axios from 'axios';

// Create an axios instance with default configs
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth services
export const loginUser = (email: string, password: string) => 
  API.post('/auth/login', { email, password });

export const registerUser = (name: string, email: string, password: string, role: string) => 
  API.post('/auth/register', { name, email, password, role });

export const getCurrentUser = () => 
  API.get('/auth/me');

// Leave services
export const getLeaveRequests = () => 
  API.get('/leave');

export const getLeaveRequestById = (id: string) => 
  API.get(`/leave/${id}`);

export const createLeaveRequest = (leaveData: any) => 
  API.post('/leave', leaveData);

export const updateLeaveRequestStatus = (id: string, status: string) => 
  API.put(`/leave/${id}`, { status });

export default API;
