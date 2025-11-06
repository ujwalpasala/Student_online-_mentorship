import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '@chakra-ui/react';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const toast = useToast();

  if (!isAuthenticated) {
    toast({
      title: 'Access denied',
      description: 'Please login to access this page',
      status: 'warning',
      duration: 3000,
      isClosable: true,
    });
    
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}