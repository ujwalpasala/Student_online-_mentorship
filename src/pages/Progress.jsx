import {
  Box,
  Container,
  Heading,
  VStack,
  Button,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Textarea,
  FormControl,
  List,
  ListItem,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

export default function Progress() {
  const [progressEntries, setProgressEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    // In a real app, this would be an API call to get progress entries
    const mockEntries = [
      { id: 1, date: '2025-11-01', note: 'Completed React fundamentals course' },
      { id: 2, date: '2025-11-03', note: 'Built first component library' },
    ];
    setProgressEntries(mockEntries);
  }, []);

  const handleSubmit = () => {
    if (!newEntry.trim()) return;

    const entry = {
      id: progressEntries.length + 1,
      date: new Date().toISOString().split('T')[0],
      note: newEntry,
    };

    setProgressEntries([...progressEntries, entry]);
    setNewEntry('');
    onClose();
  };

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8} align="stretch">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Heading>Your Progress</Heading>
          <Button colorScheme="blue" onClick={onOpen}>
            Add Progress Update
          </Button>
        </Box>

        <List spacing={4}>
          {progressEntries.map((entry) => (
            <ListItem
              key={entry.id}
              p={4}
              border="1px"
              borderColor="gray.200"
              borderRadius="md"
            >
              <Text fontWeight="bold">{entry.date}</Text>
              <Text mt={2}>{entry.note}</Text>
            </ListItem>
          ))}
        </List>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Progress Update</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <Textarea
                  value={newEntry}
                  onChange={(e) => setNewEntry(e.target.value)}
                  placeholder="What did you accomplish?"
                  rows={4}
                />
              </FormControl>
              <Button
                mt={4}
                colorScheme="blue"
                mr={3}
                onClick={handleSubmit}
                isDisabled={!newEntry.trim()}
              >
                Save
              </Button>
              <Button mt={4} onClick={onClose}>
                Cancel
              </Button>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
}