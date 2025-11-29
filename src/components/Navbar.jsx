import {
  Box,
  Flex,
  Button,
  Stack,
  useColorModeValue,
  IconButton,
  useDisclosure,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  Text,
  VStack,
  useToast,
  Container,
  Collapse,
  Icon,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: 'Logged out successfully',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const isCurrentPath = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { name: 'Mentors', path: '/mentors', requireAuth: true },
    { name: 'Sessions', path: '/sessions', requireAuth: true },
    { name: 'Progress', path: '/progress', requireAuth: true },
  ];

  return (
    <Box>
      <Container maxW="8xl">
        <Flex
          bg={useColorModeValue('white', 'gray.800')}
          color={useColorModeValue('gray.600', 'white')}
          minH={'60px'}
          py={{ base: 2 }}
          px={{ base: 4 }}
          borderBottom={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.900')}
          align={'center'}>
          <Flex
            flex={{ base: 1, md: 'auto' }}
            ml={{ base: -2 }}
            display={{ base: 'flex', md: 'none' }}>
            <IconButton
              onClick={onToggle}
              icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
              variant={'ghost'}
              aria-label={'Toggle Navigation'}
            />
          </Flex>
          
          <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
            <RouterLink to="/">
              <Text
                textAlign={{ base: 'center', md: 'left' }}
                fontFamily={'heading'}
                color={useColorModeValue('gray.800', 'white')}
                fontWeight="bold"
                fontSize="xl">
                Online Mentorship
              </Text>
            </RouterLink>

            <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
              <HStack spacing={4}>
                {menuItems.map((item) => (
                  !item.requireAuth || isAuthenticated ? (
                    <RouterLink key={item.path} to={item.path}>
                      <Button
                        variant={isCurrentPath(item.path) ? 'solid' : 'ghost'}
                        colorScheme={isCurrentPath(item.path) ? 'blue' : 'gray'}
                        size="sm">
                        {item.name}
                      </Button>
                    </RouterLink>
                  ) : null
                ))}
              </HStack>
            </Flex>
          </Flex>

          <Stack
            flex={{ base: 1, md: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={6}>
            {isAuthenticated ? (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}>
                  <HStack>
                    <Avatar
                      size={'sm'}
                      name={user?.name || 'User'}
                      src={user?.avatar}
                    />
                    <VStack
                      display={{ base: 'none', md: 'flex' }}
                      alignItems="flex-start"
                      spacing="1px"
                      ml="2">
                      <Text fontSize="sm">{user?.name || 'User'}</Text>
                      <Text fontSize="xs" color="gray.600">
                        {user?.role === 'mentor' ? 'Mentor' : 'Student'}
                      </Text>
                    </VStack>
                    <Box display={{ base: 'none', md: 'flex' }}>
                      <ChevronDownIcon />
                    </Box>
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuItem as={RouterLink} to="/profile">Profile</MenuItem>
                  {user?.role === 'admin' && (
                    <MenuItem as={RouterLink} to="/admin">Admin Panel</MenuItem>
                  )}
                  <MenuDivider />
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <>
                <Button
                  as={RouterLink}
                  to="/login"
                  fontSize={'sm'}
                  fontWeight={400}
                  variant={'link'}
                  color={'blue.500'}>
                  Sign In
                </Button>
                {/* Sign up removed as requested */}
              </>
            )}
          </Stack>
        </Flex>

        <Collapse in={isOpen} animateOpacity>
          <Box
            pb={4}
            display={{ md: 'none' }}
            bg={useColorModeValue('white', 'gray.800')}>
            <Stack as={'nav'} spacing={4}>
              {menuItems.map((item) => (
                !item.requireAuth || isAuthenticated ? (
                  <RouterLink key={item.path} to={item.path}>
                    <Button
                      w="full"
                      variant={isCurrentPath(item.path) ? 'solid' : 'ghost'}
                      colorScheme={isCurrentPath(item.path) ? 'blue' : 'gray'}
                      justifyContent="flex-start">
                      {item.name}
                    </Button>
                  </RouterLink>
                ) : null
              ))}
              {/* Sign up removed from mobile menu as requested */}
            </Stack>
          </Box>
        </Collapse>
      </Container>
    </Box>
  );
}