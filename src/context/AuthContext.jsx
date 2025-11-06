import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';

const AuthContext = createContext({});

const API_URL = 'https://api.example.com'; // Replace with your actual API URL

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    // Check for stored token on app load
    const token = localStorage.getItem('token');
    if (token) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      setUser(storedUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      // In a real app, replace this with actual API call
      // const response = await axios.post(`${API_URL}/auth/login`, credentials);
      // const { token, user } = response.data;
      
      // Simulated response for demo
      const mockUser = {
        id: 1,
        name: credentials.email.split('@')[0],
        email: credentials.email,
        role: 'student'
      };
      const mockToken = 'mock-jwt-token';

      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      toast({
        title: 'Login successful',
        description: `Welcome back, ${mockUser.name}!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      return true;
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || 'An error occurred during login',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  };

  const register = async (userData) => {
    try {
      // In a real app, replace this with actual API call
      // const response = await axios.post(`${API_URL}/auth/register`, userData);
      // const { token, user } = response.data;
      
      // Simulated response for demo
      const mockUser = {
        id: Date.now(),
        ...userData,
        role: 'student'
      };
      const mockToken = 'mock-jwt-token';

      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      toast({
        title: 'Registration successful',
        description: 'Your account has been created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      return true;
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error.response?.data?.message || 'An error occurred during registration',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      register, 
      logout,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);