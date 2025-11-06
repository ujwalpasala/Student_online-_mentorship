import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Container maxW={'3xl'}>
      <Stack
        as={Box}
        textAlign={'center'}
        spacing={{ base: 8, md: 14 }}
        py={{ base: 20, md: 36 }}>
        <Heading
          fontWeight={600}
          fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
          lineHeight={'110%'}>
          Online Mentorship & <br />
          <Text as={'span'} color={'blue.400'}>
            Coaching Platform
          </Text>
        </Heading>
        <Text color={'gray.500'}>
          Connect with experienced mentors, schedule coaching sessions, and track your development journey.
          Our platform makes it easy to find the right mentor and achieve your goals.
        </Text>
        <Stack
          direction={'column'}
          spacing={3}
          align={'center'}
          alignSelf={'center'}
          position={'relative'}>
          {!isAuthenticated ? (
            <>
              <RouterLink to="/register">
                <Button
                  colorScheme={'green'}
                  bg={'green.400'}
                  rounded={'full'}
                  px={6}
                  _hover={{
                    bg: 'green.500',
                  }}>
                  Get Started
                </Button>
              </RouterLink>
              <RouterLink to="/login">
                <Button variant={'link'} colorScheme={'blue'} size={'sm'}>
                  Already have an account? Login
                </Button>
              </RouterLink>
            </>
          ) : (
            <RouterLink to="/mentors">
              <Button
                colorScheme={'blue'}
                bg={'blue.400'}
                rounded={'full'}
                px={6}
                _hover={{
                  bg: 'blue.500',
                }}>
                Find a Mentor
              </Button>
            </RouterLink>
          )}
        </Stack>
      </Stack>
    </Container>
  );
}