import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import useLocalStorage from '../hooks/useLocalStorage';

const AuthContext = createContext({});

// Simulated user database with pre-defined users
const mockUsers = new Map([
  // Student accounts
  ['student1@example.com', {
    id: 1,
    email: 'student1@example.com',
    password: 'Student123!',
    name: 'John Student',
    role: 'student',
    interests: 'webdev',
    phone: '+1-555-1001',
    createdAt: '2025-11-06T00:00:00.000Z'
  }],
  ['student2@example.com', {
    id: 2,
    email: 'student2@example.com',
    password: 'Student123!',
    name: 'Sarah Student',
    role: 'student',
    interests: 'datascience',
    phone: '+1-555-1002',
    createdAt: '2025-11-06T00:00:00.000Z'
  }],
  // Mentor accounts
  ['mentor1@example.com', {
    id: 3,
    email: 'mentor1@example.com',
    password: 'Mentor123!',
    name: 'Dr. James Mentor',
    role: 'mentor',
    interests: 'webdev',
    expertise: 'React, Node.js',
    phone: '+1-555-2001',
    createdAt: '2025-11-06T00:00:00.000Z'
  }],
  ['mentor2@example.com', {
    id: 4,
    email: 'mentor2@example.com',
    password: 'Mentor123!',
    name: 'Prof. Lisa Mentor',
    role: 'mentor',
    interests: 'datascience',
    expertise: 'Python, Machine Learning',
    phone: '+1-555-2002',
    createdAt: '2025-11-06T00:00:00.000Z'
  }],
  // Admin account
  ['admin@example.com', {
    id: 5,
    email: 'admin@example.com',
    password: 'Admin123!',
    name: 'Admin User',
    role: 'admin',
    createdAt: '2025-11-06T00:00:00.000Z',
    phone: '+1-555-9000'
  }]
]);

// Function to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Function to validate password strength
const isStrongPassword = (password) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar
  );
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Use the localStorage hook to persist session
  const [storedSession, setStoredSession] = useLocalStorage('session', null);

  useEffect(() => {
    // restore session if present
    if (storedSession) {
      setUser(storedSession);
      setIsAuthenticated(true);
      // ensure mockUsers contains this session (helps routing/role checks)
      try {
        if (storedSession.email) mockUsers.set(storedSession.email.toLowerCase().trim(), storedSession);
      } catch (err) {
        // no-op
      }
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedSession]);

  const login = async (credentials) => {
    try {
      let { email, password, rememberMe } = credentials || {};

      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // normalize email to avoid case/whitespace mismatches
      email = String(email).toLowerCase().trim();

      // Validate email format
      if (!isValidEmail(email)) {
        throw new Error('Invalid email format');
      }

      // Check if user exists
      const existingUser = mockUsers.get(email);
      if (!existingUser) {
        throw new Error('User not found. Please register first.');
      }

      // Validate password (in a real app, you'd hash and compare)
      if (existingUser.password !== password) {
        throw new Error('Invalid password');
      }

      // Create session
      const session = {
        id: existingUser.id,
        name: existingUser.name || email.split('@')[0],
        email: existingUser.email,
        role: existingUser.role,
        interests: existingUser.interests,
        phone: existingUser.phone || null,
      };

      // Store session if rememberMe is true (centralized by hook)
      if (rememberMe) {
        setStoredSession(session);
      } else {
        setStoredSession(null);
      }
      setUser(session);
      setIsAuthenticated(true);

      toast({
        title: 'Welcome back!',
        description: `Logged in as ${session.name}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

  // return session object for caller to decide navigation
  return session;
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
  return null;
    }
  };

  const register = async (userData) => {
    try {
      // Support either { firstName, lastName } OR a single `name` field
      const {
        email,
        password,
        firstName,
        lastName,
        name: providedName,
        phone,
        role,
        interests,
      } = userData;

      // Validate email format
      if (!isValidEmail(email)) {
        throw new Error('Invalid email format');
      }

      // Check if email is already registered
      if (mockUsers.has(email)) {
        throw new Error('Email is already registered');
      }

      // Validate password strength
      if (!isStrongPassword(password)) {
        throw new Error('Password does not meet security requirements');
      }

      // Build display name
      const displayName = providedName
        ? providedName
        : `${firstName || ''} ${lastName || ''}`.trim() || email.split('@')[0];

      // Create new user
      const newUser = {
        id: Date.now(),
        email,
        password, // In a real app, this would be hashed
        name: displayName,
        role,
        interests,
        phone,
        createdAt: new Date().toISOString(),
      };

  // Store in mock database (normalize email key)
  mockUsers.set(String(email).toLowerCase().trim(), newUser);

      // Create session
      const session = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        interests: newUser.interests,
        phone: newUser.phone || null,
      };

  // Store session
  setStoredSession(session);
      setUser(session);
      setIsAuthenticated(true);

      toast({
        title: 'Registration successful',
        description: `Welcome, ${newUser.name}!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      return true;
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return false;
    }
  };

  const logout = () => {
    // use the storage hook to clear session
    try {
      setStoredSession(null);
    } catch (err) {
      // fallback
      localStorage.removeItem('session');
    }
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