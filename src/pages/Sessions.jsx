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
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const location = useLocation();
  const toast = useToast();

  useEffect(() => {
    // Set selected mentor if passed through navigation
    if (location.state?.mentorId) {
      setSelectedMentor(location.state.mentorId);
    }
    
    // In a real app, this would be an API call to get user's sessions
    const mockSessions = [
      { id: 1, mentor: 'John Doe', date: '2025-11-10', time: '10:00 AM' },
      { id: 2, mentor: 'Jane Smith', date: '2025-11-15', time: '2:00 PM' },
    ];
    setSessions(mockSessions);
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, this would be an API call
    const newSession = {
      id: sessions.length + 1,
      mentor: selectedMentor,
      date: sessionDate,
      time: sessionTime,
    };
    
    setSessions([...sessions, newSession]);
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

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8}>
        <Box w="100%">
          <Heading mb={6}>Book a Session</Heading>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Select Mentor</FormLabel>
                <Select
                  placeholder="Choose a mentor"
                  value={selectedMentor}
                  onChange={(e) => setSelectedMentor(e.target.value)}
                >
                  <option value="John Doe">John Doe</option>
                  <option value="Jane Smith">Jane Smith</option>
                  <option value="Mike Johnson">Mike Johnson</option>
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
        </Box>

        <Box w="100%">
          <Heading size="md" mb={4}>Your Scheduled Sessions</Heading>
          <List spacing={3}>
            {sessions.map((session) => (
              <ListItem
                key={session.id}
                p={4}
                border="1px"
                borderColor="gray.200"
                borderRadius="md"
              >
                <Text fontWeight="bold">{session.mentor}</Text>
                <Text>Date: {session.date}</Text>
                <Text>Time: {session.time}</Text>
              </ListItem>
            ))}
          </List>
        </Box>
      </VStack>
    </Container>
  );
}