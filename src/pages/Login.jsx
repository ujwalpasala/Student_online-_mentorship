import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  FormErrorMessage,
  useColorModeValue,
  Container,
  Link,
  Checkbox,
  Divider,
  HStack,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import TestAccounts from '../components/TestAccounts';
import useLocalStorage from '../hooks/useLocalStorage';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required')
    .trim(),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
    .trim(),
  rememberMe: Yup.boolean()
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  
  const from = location.state?.from?.pathname || '/';
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const [rememberedEmail, setRememberedEmail] = useLocalStorage('rememberedEmail', '');

  const handleSubmit = async (values, actions) => {
    try {
      actions.setSubmitting(true);
      const session = await login(values);

      if (session) {
        toast({
          title: 'Welcome back!',
          description: `You have successfully logged in as ${session.name}.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        if (values.rememberMe) {
          setRememberedEmail(values.email);
        } else {
          setRememberedEmail('');
        }

        // Route based on role. Mentors go to sessions (booking) page; students go to mentors list.
        if (session.role === 'mentor') {
          navigate('/sessions');
        } else if (session.role === 'admin') {
          navigate('/admin');
        } else {
          // default student / other
          navigate(from || '/mentors');
        }
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error.message || 'Please check your credentials and try again',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      
      // Clear password field on error
      actions.setFieldValue('password', '', false);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
      <Stack spacing="8">
        <Stack spacing="6" textAlign="center">
          <Heading size={{ base: 'xs', md: 'sm' }}>
            Log in to your account
          </Heading>
          <Text color="muted">
            Welcome back! Please enter your details.
          </Text>
        </Stack>
        <Box
          py={{ base: '0', sm: '8' }}
          px={{ base: '4', sm: '10' }}
          bg={bgColor}
          boxShadow={{ base: 'none', sm: 'md' }}
          borderRadius={{ base: 'none', sm: 'xl' }}
          borderWidth={1}
          borderColor={borderColor}
        >
          <Stack spacing="6">
            <Stack spacing="5">
              <Formik
                initialValues={{ email: rememberedEmail || '', password: '', rememberMe: false }}
                validationSchema={LoginSchema}
                onSubmit={handleSubmit}
              >
                {(props) => (
                  <Form>
                    <Stack spacing="5">
                      <Field name="email">
                        {({ field, form }) => (
                          <FormControl isInvalid={form.errors.email && form.touched.email}>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <Input
                              {...field}
                              type="email"
                              placeholder="Enter your email"
                            />
                            <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      
                      <Field name="password">
                        {({ field, form }) => (
                          <FormControl isInvalid={form.errors.password && form.touched.password}>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <InputGroup>
                              <Input
                                {...field}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                              />
                              <InputRightElement>
                                <IconButton
                                  variant="ghost"
                                  icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                  onClick={() => setShowPassword(!showPassword)}
                                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                                />
                              </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </Stack>

                    <Stack spacing="6" mt="4">
                      <HStack justify="space-between">
                        <Field name="rememberMe">
                          {({ field }) => (
                            <Checkbox {...field}>Remember me</Checkbox>
                          )}
                        </Field>
                        <Button variant="link" colorScheme="blue" size="sm">
                          Forgot password?
                        </Button>
                      </HStack>
                      
                      <Button
                        type="submit"
                        colorScheme="blue"
                        size="lg"
                        fontSize="md"
                        isLoading={props.isSubmitting}
                      >
                        Sign in
                      </Button>
                    </Stack>
                  </Form>
                )}
              </Formik>
              <Divider />
              
              <Stack spacing="3">
                <Button
                  variant="outline"
                  leftIcon={<FaGoogle />}
                  onClick={() => toast({
                    title: 'Not implemented',
                    description: 'Google sign-in coming soon!',
                    status: 'info'
                  })}
                >
                  Continue with Google
                </Button>
                <Button
                  variant="outline"
                  leftIcon={<FaGithub />}
                  onClick={() => toast({
                    title: 'Not implemented',
                    description: 'GitHub sign-in coming soon!',
                    status: 'info'
                  })}
                >
                  Continue with GitHub
                </Button>
              </Stack>

              {/* Sign up prompt removed */}
            </Stack>
          </Stack>
        </Box>

        {/* Test Accounts Component */}
        <Box mt={4}>
          <TestAccounts />
        </Box>
      </Stack>
    </Container>
  );
}