import {
  Box,
  Container,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const [mentors, setMentors] = useState([]);
  const [newMentor, setNewMentor] = useState({
    name: '',
    expertise: '',
    email: '',
  });
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // In a real app, this would be an API call
    const mockMentors = [
      { id: 1, name: 'John Doe', expertise: 'Web Development', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', expertise: 'Data Science', email: 'jane@example.com' },
    ];
    setMentors(mockMentors);
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const mentor = {
      id: mentors.length + 1,
      ...newMentor,
    };

    setMentors([...mentors, mentor]);
    setNewMentor({ name: '', expertise: '', email: '' });
    
    toast({
      title: 'Mentor Added',
      status: 'success',
      duration: 3000,
    });
  };

  const handleDelete = (id) => {
    setMentors(mentors.filter(mentor => mentor.id !== id));
    toast({
      title: 'Mentor Removed',
      status: 'info',
      duration: 3000,
    });
  };

  return (
    <Container maxW="container.lg" py={10}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading mb={6}>Manage Mentors</Heading>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  value={newMentor.name}
                  onChange={(e) => setNewMentor({ ...newMentor, name: e.target.value })}
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Expertise</FormLabel>
                <Input
                  value={newMentor.expertise}
                  onChange={(e) => setNewMentor({ ...newMentor, expertise: e.target.value })}
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={newMentor.email}
                  onChange={(e) => setNewMentor({ ...newMentor, email: e.target.value })}
                />
              </FormControl>
              
              <Button type="submit" colorScheme="blue">
                Add Mentor
              </Button>
            </VStack>
          </form>
        </Box>

        <Box>
          <Heading size="md" mb={4}>Current Mentors</Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Expertise</Th>
                <Th>Email</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {mentors.map((mentor) => (
                <Tr key={mentor.id}>
                  <Td>{mentor.name}</Td>
                  <Td>{mentor.expertise}</Td>
                  <Td>{mentor.email}</Td>
                  <Td>
                    <IconButton
                      aria-label="Delete mentor"
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      onClick={() => handleDelete(mentor.id)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Container>
  );
}