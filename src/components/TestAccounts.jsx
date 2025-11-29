import {
  Box,
  VStack,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useClipboard,
  IconButton,
  useToast,
  Heading,
  Badge,
} from '@chakra-ui/react';
import { CopyIcon, CheckIcon } from '@chakra-ui/icons';

const TEST_ACCOUNTS = [
  {
    type: 'Student 1',
    email: 'student1@example.com',
    password: 'Student123!',
    role: 'student',
    interests: 'Web Development'
    ,
    phone: '+1-555-1001'
  },
  {
    type: 'Student 2',
    email: 'student2@example.com',
    password: 'Student123!',
    role: 'student',
    interests: 'Data Science'
    ,
    phone: '+1-555-1002'
  },
  {
    type: 'Mentor 1',
    email: 'mentor1@example.com',
    password: 'Mentor123!',
    role: 'mentor',
    expertise: 'React, Node.js'
    ,
    phone: '+1-555-2001'
  },
  {
    type: 'Mentor 2',
    email: 'mentor2@example.com',
    password: 'Mentor123!',
    role: 'mentor',
    expertise: 'Python, Machine Learning'
    ,
    phone: '+1-555-2002'
  },
  {
    type: 'Admin',
    email: 'admin@example.com',
    password: 'Admin123!',
    role: 'admin'
    ,
    phone: '+1-555-9000'
  }
];

export default function TestAccounts() {
  const toast = useToast();
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      status: 'success',
      duration: 2000,
    });
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" bg="white" shadow="sm">
      <VStack spacing={4} align="stretch">
        <Heading size="md">Test Accounts</Heading>
        <Text fontSize="sm" color="gray.600">
          Use these accounts to test different user roles. Click the copy icon to copy credentials.
        </Text>
        
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Type</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Password</Th>
              <Th>Role</Th>
              <Th>Details</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {TEST_ACCOUNTS.map((account) => (
              <Tr key={account.email}>
                <Td>{account.type}</Td>
                <Td>
                  <Text fontSize="sm">{account.email}</Text>
                </Td>
                <Td>
                  <Text fontSize="sm">{account.phone || '-'}</Text>
                </Td>
                <Td>
                  <Text fontSize="sm">{account.password}</Text>
                </Td>
                <Td>
                  <Badge
                    colorScheme={
                      account.role === 'admin'
                        ? 'red'
                        : account.role === 'mentor'
                        ? 'green'
                        : 'blue'
                    }
                  >
                    {account.role}
                  </Badge>
                </Td>
                <Td>
                  {account.interests && (
                    <Badge colorScheme="purple" mr={2}>
                      {account.interests}
                    </Badge>
                  )}
                  {account.expertise && (
                    <Badge colorScheme="orange" mr={2}>
                      {account.expertise}
                    </Badge>
                  )}
                </Td>
                <Td>
                  <IconButton
                    aria-label="Copy credentials"
                    icon={<CopyIcon />}
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                        copyToClipboard(
                        `Email: ${account.email}\nPhone: ${account.phone || '-'}\nPassword: ${account.password}`
                      )
                    }
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>
    </Box>
  );
}