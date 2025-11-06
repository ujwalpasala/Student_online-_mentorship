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
  Select,
  Divider,
  HStack,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';

const RegisterSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]*$/, 'First name can only contain letters')
    .required('First name is required')
    .trim(),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]*$/, 'Last name can only contain letters')
    .required('Last name is required')
    .trim(),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required')
    .trim()
    .test('unique-email', 'This email is already registered', 
      // In a real app, this would check against your backend
      (value) => true
    ),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password must be less than 50 characters')
    .matches(/[a-z]/, 'Password must include at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must include at least one uppercase letter')
    .matches(/[0-9]/, 'Password must include at least one number')
    .matches(/[^a-zA-Z0-9]/, 'Password must include at least one special character')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  role: Yup.string()
    .oneOf(['student', 'mentor'], 'Please select a valid role')
    .required('Please select your role'),
  interests: Yup.string()
    .oneOf([
      'webdev',
      'mobiledev',
      'datascience',
      'ai',
      'cybersecurity',
      'devops'
    ], 'Please select a valid area of interest')
    .required('Please select your area of interest'),
  terms: Yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions')
    .required('You must accept the terms and conditions')
});

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleSubmit = async (values, actions) => {
    try {
      const userData = {
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        password: values.password,
        role: values.role,
        interests: values.interests
      };
      
      const success = await register(userData);
      if (success) {
        navigate('/');
      }
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
      <Stack spacing="8">
        <Stack spacing="6" textAlign="center">
          <Heading size={{ base: 'xs', md: 'sm' }}>
            Create your account
          </Heading>
          <Text color="muted">
            Join our mentorship platform and start your learning journey
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
            <Formik
              initialValues={{
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
                role: '',
                interests: ''
              }}
              validationSchema={RegisterSchema}
              onSubmit={handleSubmit}
            >
              {(props) => (
                <Form>
                  <Stack spacing="5">
                    <HStack spacing={4}>
                      <Field name="firstName">
                        {({ field, form }) => (
                          <FormControl isInvalid={form.errors.firstName && form.touched.firstName}>
                            <FormLabel>First Name</FormLabel>
                            <Input {...field} placeholder="First name" />
                            <FormErrorMessage>{form.errors.firstName}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      
                      <Field name="lastName">
                        {({ field, form }) => (
                          <FormControl isInvalid={form.errors.lastName && form.touched.lastName}>
                            <FormLabel>Last Name</FormLabel>
                            <Input {...field} placeholder="Last name" />
                            <FormErrorMessage>{form.errors.lastName}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </HStack>

                    <Field name="email">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.email && form.touched.email}>
                          <FormLabel>Email</FormLabel>
                          <Input {...field} type="email" placeholder="Enter your email" />
                          <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="password">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.password && form.touched.password}>
                          <FormLabel>Password</FormLabel>
                          <InputGroup>
                            <Input
                              {...field}
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Create a password"
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

                    <Field name="confirmPassword">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.confirmPassword && form.touched.confirmPassword}>
                          <FormLabel>Confirm Password</FormLabel>
                          <InputGroup>
                            <Input
                              {...field}
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder="Confirm your password"
                            />
                            <InputRightElement>
                              <IconButton
                                variant="ghost"
                                icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                              />
                            </InputRightElement>
                          </InputGroup>
                          <FormErrorMessage>{form.errors.confirmPassword}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="role">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.role && form.touched.role}>
                          <FormLabel>I want to be a</FormLabel>
                          <Select {...field} placeholder="Select your role">
                            <option value="student">Student (Looking for mentorship)</option>
                            <option value="mentor">Mentor (Offering mentorship)</option>
                          </Select>
                          <FormErrorMessage>{form.errors.role}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="interests">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.interests && form.touched.interests}>
                          <FormLabel>Area of Interest</FormLabel>
                          <Select {...field} placeholder="Select your interest">
                            <option value="webdev">Web Development</option>
                            <option value="mobiledev">Mobile Development</option>
                            <option value="datascience">Data Science</option>
                            <option value="ai">Artificial Intelligence</option>
                            <option value="cybersecurity">Cybersecurity</option>
                            <option value="devops">DevOps</option>
                          </Select>
                          <FormErrorMessage>{form.errors.interests}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="terms">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.terms && form.touched.terms}>
                          <Checkbox {...field}>
                            I agree to the{' '}
                            <Link color="blue.500" href="#" onClick={(e) => {
                              e.preventDefault();
                              toast({
                                title: 'Terms and Conditions',
                                description: 'Terms and conditions will be displayed here',
                                status: 'info',
                                duration: 3000
                              });
                            }}>
                              Terms and Conditions
                            </Link>
                          </Checkbox>
                          <FormErrorMessage>{form.errors.terms}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Button
                      mt={4}
                      type="submit"
                      colorScheme="blue"
                      size="lg"
                      fontSize="md"
                      isLoading={props.isSubmitting}
                      loadingText="Creating Account..."
                    >
                      Create Account
                    </Button>
                  </Stack>
                </Form>
              )}
            </Formik>

            <Stack spacing="6">
              <Divider />
              
              <Stack spacing="3">
                <Button
                  variant="outline"
                  leftIcon={<FaGoogle />}
                  onClick={() => toast({
                    title: 'Not implemented',
                    description: 'Google sign-up coming soon!',
                    status: 'info'
                  })}
                >
                  Sign up with Google
                </Button>
                <Button
                  variant="outline"
                  leftIcon={<FaGithub />}
                  onClick={() => toast({
                    title: 'Not implemented',
                    description: 'GitHub sign-up coming soon!',
                    status: 'info'
                  })}
                >
                  Sign up with GitHub
                </Button>
              </Stack>

              <Text textAlign="center">
                Already have an account?{' '}
                <Link as={RouterLink} to="/login" color="blue.500">
                  Sign in
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}