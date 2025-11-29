import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Button,
  VStack,
  useColorModeValue,
  Container,
  Avatar,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Mentors() {
  const [mentors, setMentors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app, this would be an API call
    const mockMentors = [
      { id: 1, name: 'John Doe', expertise: 'Web Development', rating: 4.8 },
      { id: 2, name: 'Jane Smith', expertise: 'Data Science', rating: 4.9 },
      { id: 3, name: 'Mike Johnson', expertise: 'Mobile Development', rating: 4.7 },
      // Add more mock mentors as needed
    ];
    setMentors(mockMentors);
  }, []);

  const handleBookSession = (mentorId) => {
    const mentor = mentors.find((m) => m.id === mentorId);
    navigate('/sessions', { state: { mentorId, mentorName: mentor?.name } });
  };

  return (
    <Container maxW={'6xl'} py={10}>
      <Heading mb={8}>Available Mentors</Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
        {mentors.map((mentor) => (
          <Box
            key={mentor.id}
            bg={useColorModeValue('white', 'gray.800')}
            boxShadow={'2xl'}
            rounded={'lg'}
            p={6}
            textAlign={'center'}>
            <Avatar
              size={'xl'}
              src={`https://ui-avatars.com/api/?name=${mentor.name}`}
              mb={4}
              pos={'relative'}
            />
            <Heading fontSize={'2xl'} fontFamily={'body'}>
              {mentor.name}
            </Heading>
            <Text fontWeight={600} color={'gray.500'} mb={4}>
              {mentor.expertise}
            </Text>
            <Text textAlign={'center'} color={'gray.700'} px={3}>
              Rating: {mentor.rating} / 5.0
            </Text>
            <VStack mt={8} spacing={4}>
              <Button
                w={'full'}
                colorScheme={'blue'}
                onClick={() => handleBookSession(mentor.id)}>
                Book a Session
              </Button>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
}