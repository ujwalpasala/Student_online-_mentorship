import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  HStack,
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Icon,
  Divider,
} from '@chakra-ui/react';
import { FaUserGraduate, FaChalkboardTeacher, FaBookReader } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <Container maxW="container.md" py={10}>
        <VStack spacing={6} align="center">
          <Heading>Welcome to Student Mentorship</Heading>
          <Text>Please log in or register to access the dashboard.</Text>
          <HStack spacing={4}>
            <Button colorScheme="blue" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button colorScheme="green" onClick={() => navigate('/register')}>
              Register
            </Button>
          </HStack>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>
            Welcome back, {user.name}!
          </Heading>
          <HStack>
            <Badge colorScheme={user.role === 'student' ? 'blue' : 'green'}>
              {user.role === 'student' ? 'Student' : 'Mentor'}
            </Badge>
            {user.interests && (
              <Badge colorScheme="purple">{user.interests}</Badge>
            )}
          </HStack>
        </Box>

        <StatGroup>
          <Card flex={1}>
            <CardBody>
              <Stat>
                <StatLabel>Sessions Completed</StatLabel>
                <StatNumber>0</StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card flex={1}>
            <CardBody>
              <Stat>
                <StatLabel>Hours Spent</StatLabel>
                <StatNumber>0</StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card flex={1}>
            <CardBody>
              <Stat>
                <StatLabel>Progress</StatLabel>
                <StatNumber>0%</StatNumber>
              </Stat>
            </CardBody>
          </Card>
        </StatGroup>

        <Divider />

        <Heading size="md">Quick Actions</Heading>
        <HStack spacing={4}>
          {user.role === 'student' ? (
            <>
              <Card flex={1} cursor="pointer" onClick={() => navigate('/mentors')}>
                <CardHeader>
                  <Icon as={FaChalkboardTeacher} boxSize={8} color="blue.500" />
                </CardHeader>
                <CardBody>
                  <Heading size="sm">Find Mentor</Heading>
                  <Text fontSize="sm">Browse available mentors</Text>
                </CardBody>
              </Card>
              <Card flex={1} cursor="pointer" onClick={() => navigate('/sessions')}>
                <CardHeader>
                  <Icon as={FaBookReader} boxSize={8} color="green.500" />
                </CardHeader>
                <CardBody>
                  <Heading size="sm">Book Session</Heading>
                  <Text fontSize="sm">Schedule a mentoring session</Text>
                </CardBody>
              </Card>
            </>
          ) : (
            <>
              <Card flex={1} cursor="pointer" onClick={() => navigate('/sessions')}>
                <CardHeader>
                  <Icon as={FaUserGraduate} boxSize={8} color="purple.500" />
                </CardHeader>
                <CardBody>
                  <Heading size="sm">View Requests</Heading>
                  <Text fontSize="sm">Check mentoring requests</Text>
                </CardBody>
              </Card>
              <Card flex={1} cursor="pointer" onClick={() => navigate('/schedule')}>
                <CardHeader>
                  <Icon as={FaBookReader} boxSize={8} color="orange.500" />
                </CardHeader>
                <CardBody>
                  <Heading size="sm">My Schedule</Heading>
                  <Text fontSize="sm">Manage your availability</Text>
                </CardBody>
              </Card>
            </>
          )}
        </HStack>
      </VStack>
    </Container>
  );
}