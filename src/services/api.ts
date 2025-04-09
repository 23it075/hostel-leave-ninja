
import axios from 'axios';
import { UserRole } from '../contexts/AuthContext';

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

// Mock data for development (remove in production)
const mockUsers = [
  { id: '1', name: 'Student User', email: 'student@example.com', role: 'student' },
  { id: '2', name: 'Parent User', email: 'parent@example.com', role: 'parent' },
  { id: '3', name: 'Admin User', email: 'admin@example.com', role: 'admin' }
];

// Auth services
export const loginUser = async (email: string, password: string) => {
  try {
    // Try the actual API call first
    return await API.post('/auth/login', { email, password });
  } catch (error) {
    console.log('Using mock login due to API error');
    // Mock implementation for development
    const user = mockUsers.find(u => u.email === email);
    if (user && password.length > 5) {
      return {
        data: {
          token: 'mock-token-' + user.id,
          user
        }
      };
    }
    throw new Error('Invalid credentials');
  }
};

export const registerUser = async (name: string, email: string, password: string, role: UserRole) => {
  try {
    // Try the actual API call first
    return await API.post('/auth/register', { name, email, password, role });
  } catch (error) {
    console.log('Using mock registration due to API error');
    // Mock implementation for development
    const newId = (mockUsers.length + 1).toString();
    const newUser = { id: newId, name, email, role };
    mockUsers.push(newUser);
    
    return {
      data: {
        token: 'mock-token-' + newId,
        user: newUser
      }
    };
  }
};

export const getCurrentUser = async () => {
  try {
    // Try the actual API call first
    return await API.get('/auth/me');
  } catch (error) {
    console.log('Using mock user data due to API error');
    // Mock implementation for development
    const token = localStorage.getItem('token');
    if (token && token.startsWith('mock-token-')) {
      const userId = token.replace('mock-token-', '');
      const user = mockUsers.find(u => u.id === userId);
      if (user) {
        return { data: user };
      }
    }
    throw new Error('Not authenticated');
  }
};

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
