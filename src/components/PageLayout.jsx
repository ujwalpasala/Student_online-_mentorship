import { Box, Container } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export default function PageLayout({ children }) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxW="container.xl" py={{ base: 4, md: 8 }}>
        <Box
          bg="white"
          borderRadius="xl"
          boxShadow="sm"
          p={{ base: 4, md: 6 }}
          overflow="hidden"
        >
          {children}
        </Box>
      </Container>
    </MotionBox>
  );
}