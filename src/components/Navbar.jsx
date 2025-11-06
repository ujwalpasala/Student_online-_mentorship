import { Box, Flex, Button, Stack, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  
  return (
    <Box bg={useColorModeValue('gray.800', 'gray.900')} px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <RouterLink to="/">
          <Box color="white" fontWeight="bold">Online Mentorship</Box>
        </RouterLink>

        <Flex alignItems={'center'}>
          <Stack direction={'row'} spacing={4}>
            <RouterLink to="/mentors">
              <Button colorScheme="whiteAlpha" variant="ghost">Mentors</Button>
            </RouterLink>
            <RouterLink to="/sessions">
              <Button colorScheme="whiteAlpha" variant="ghost">Sessions</Button>
            </RouterLink>
            <RouterLink to="/progress">
              <Button colorScheme="whiteAlpha" variant="ghost">Progress</Button>
            </RouterLink>
            {isAuthenticated ? (
              <>
                <RouterLink to="/admin">
                  <Button colorScheme="whiteAlpha" variant="ghost">Admin</Button>
                </RouterLink>
                <Button colorScheme="red" variant="solid" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <RouterLink to="/login">
                  <Button colorScheme="blue" variant="solid">Login</Button>
                </RouterLink>
                <RouterLink to="/register">
                  <Button colorScheme="green" variant="solid">Register</Button>
                </RouterLink>
              </>
            )}
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
}