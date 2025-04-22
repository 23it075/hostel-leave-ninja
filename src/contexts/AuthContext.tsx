
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { loginUser, registerUser, getCurrentUser } from '../services/api';

export type UserRole = 'student' | 'parent' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | undefined>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<User | undefined>;
  logout: () => void;
  loading: boolean;
  isLoading: boolean; // Add this property to match usage in ProtectedRoute
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Load user from localStorage on initial render
  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        try {
          // Attempt to get the current user from the server
          const response = await getCurrentUser();
          const userData = response.data;
          
          // Set user state with the returned data
          setUser({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role
          });
          
          // Update localStorage with the latest user data
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          console.error('Error fetching current user:', error);
          // Clear invalid token and user data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginUser(email, password);
      const userData = response.data;
      
      // Create a user object with correct structure
      const user = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role
      };

      // Save the token to localStorage
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid credentials. Please try again.');
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      const response = await registerUser(name, email, password, role);
      const userData = response.data;
      
      // Create a user object with correct structure
      const user = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role
      };

      // Save the token to localStorage
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const contextValue: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
    isLoading: loading, // Add this to provide the isLoading property expected by ProtectedRoute
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
