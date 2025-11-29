import {
  Box,
  Container,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
  Select,
  List,
  ListItem,
  Text,
  SimpleGrid,
  Avatar,
  Stack,
  Badge,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

export default function Sessions() {
  // stored bookings (persisted in localStorage) – each booking: {id, mentorId, mentorName, studentEmail, studentName, date, time, status}
  const [bookings, setBookings] = useLocalStorage('bookings', []);
  const [sessions, setSessions] = useState([]); // local view used for display
  const [selectedMentor, setSelectedMentor] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const location = useLocation();
  const toast = useToast();
  const { user } = useAuth();

  // Available mentors for booking (client-side sample)
  const mockMentors = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Mike Johnson' },
    { id: 4, name: 'Dr. James Mentor' },
    { id: 5, name: 'Prof. Lisa Mentor' },
  ];

  useEffect(() => {
    // Set selected mentor if passed through navigation
    if (location.state?.mentorId) {
      setSelectedMentor(location.state.mentorId);
    }

    // If the current user is a mentor, attempt to preselect the mentor matching their name
    if (user?.role === 'mentor' && !location.state?.mentorId) {
      const found = mockMentors.find((m) => m.name === user.name);
      if (found) setSelectedMentor(found.id);
    }
    
    // In a real app, this would be an API call to get user's sessions / bookings
    // If there are saved bookings in localStorage, load them; otherwise seed a small list.
    if (!bookings || bookings.length === 0) {
      const seed = [
        { id: 1, mentorId: 1, mentorName: 'John Doe', studentEmail: 'student1@example.com', studentName: 'John Student', date: '2025-11-10', time: '10:00 AM', status: 'confirmed' },
        { id: 2, mentorId: 2, mentorName: 'Jane Smith', studentEmail: 'student2@example.com', studentName: 'Sarah Student', date: '2025-11-15', time: '2:00 PM', status: 'pending' },
      ];
      setBookings(seed);
      setSessions(seed);
    } else {
      setSessions(bookings);
    }
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, this would be an API call
    // Students can create bookings; mentors manage requests (they shouldn't create bookings here)
    if (user?.role === 'mentor') {
      toast({
        title: 'Not allowed',
        description: 'Mentors cannot create bookings here — they can manage requests instead.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!selectedMentor) {
      toast({
        title: 'No mentor selected',
        description: 'Please choose a mentor before booking a session.',
        status: 'warning',
        duration: 2500,
        isClosable: true,
      });
      return;
    }

    const mentorObj = mockMentors.find((m) => String(m.id) === String(selectedMentor));
    const newSession = {
      id: Date.now(),
      mentorId: mentorObj?.id || null,
      mentorName: mentorObj?.name || selectedMentor,
      studentEmail: user?.email || 'unknown',
      studentName: user?.name || 'Guest',
      date: sessionDate,
      time: sessionTime,
      status: 'pending',
    };

    const updated = [...bookings, newSession];
    setBookings(updated);
    setSessions(updated);
    toast({
      title: 'Session Booked',
      description: "Your mentoring session has been scheduled successfully.",
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    
    // Reset form
    setSelectedMentor('');
    setSessionDate('');
    setSessionTime('');
  };

  // mentor functions - accept or decline a request
  const updateBookingStatus = (id, status) => {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status } : b));
    setBookings(updated);
    setSessions(updated);
    toast({
      title: status === 'confirmed' ? 'Booking confirmed' : 'Booking rejected',
      description: `Booking ${status}.`,
      status: status === 'confirmed' ? 'success' : 'warning',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.lg" py={10}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} alignItems="start">
        <VStack spacing={8} align="stretch">
          <Box w="100%">
          <Heading mb={6}>Book a Session</Heading>
          {user?.role === 'mentor' ? (
            <Text mb={4} color="gray.600">You are signed in as a mentor — manage incoming booking requests on the right.</Text>
          ) : (
            <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Select Mentor</FormLabel>
                <Select
                  placeholder="Choose a mentor"
                  value={selectedMentor}
                  onChange={(e) => setSelectedMentor(e.target.value)}
                >
                  {mockMentors.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Date</FormLabel>
                <Input
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Time</FormLabel>
                <Input
                  type="time"
                  value={sessionTime}
                  onChange={(e) => setSessionTime(e.target.value)}
                />
              </FormControl>
              
              <Button type="submit" colorScheme="blue" w="100%">
                Book Session
              </Button>
            </VStack>
          </form>
          )}
        </Box>

          <Box w="100%">
          <Heading size="md" mb={4}>Your Sessions</Heading>
          <List spacing={3}>
            {sessions
              .filter((s) => {
                if (!user) return true;
                // show mentor's bookings to mentors, student's own bookings to students
                if (user.role === 'mentor') return s.mentorName === user.name;
                return s.studentEmail === user.email;
              })
              .map((session) => (
              <ListItem
                key={session.id}
                p={4}
                border="1px"
                borderColor="gray.200"
                borderRadius="md"
              >
                <Text fontWeight="bold">Mentor: {session.mentorName}</Text>
                <Text fontSize="sm" color="gray.600">Student: {session.studentName} — {session.studentEmail}</Text>
                <Text>Date: {session.date}</Text>
                <Text>Time: {session.time}</Text>
                <Text mt={2}>Status: {session.status}</Text>
                {user?.role === 'mentor' && session.status === 'pending' && (
                  <Stack direction="row" spacing={2} mt={3}>
                    <Button size="sm" colorScheme="green" onClick={() => updateBookingStatus(session.id, 'confirmed')}>Accept</Button>
                    <Button size="sm" colorScheme="red" onClick={() => updateBookingStatus(session.id, 'rejected')}>Decline</Button>
                  </Stack>
                )}
              </ListItem>
            ))}
          </List>
          </Box>
        </VStack>

        <Box bg="white" p={6} borderRadius="md" boxShadow="sm">
          <Stack spacing={4} align="start">
            <Avatar name={user?.name} size="lg" />
            <Heading size="md">{user ? `Welcome, ${user.name}` : 'Welcome'}</Heading>
            {user?.role && (
              <Badge colorScheme={user.role === 'mentor' ? 'green' : 'blue'}>
                {user.role}
              </Badge>
            )}
            <Text color="gray.600">{user?.email}</Text>
            <Text fontSize="sm">Phone: {user?.phone || 'Not provided'}</Text>
            <Text mt={2} color="gray.700">
              Use this page to book sessions or manage your schedule. Mentor users can see booking requests here.
            </Text>
          </Stack>
        </Box>
      </SimpleGrid>
    </Container>
  );
}