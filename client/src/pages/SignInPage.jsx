import {
    Box,
    VStack,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Button,
    Text,
    useToast,
  } from "@chakra-ui/react";
  import { useContext, useState } from "react";
  import { FaEye, FaEyeSlash } from "react-icons/fa";
  import axios from "axios"; // Ensure axios is imported
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
  
  const SignInPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const toast = useToast();
    const navigate = useNavigate();

    const { setUser,fetchUser } = useContext(UserContext);
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      if (!email || !password) {
        setError("Please fill in both email and password.");
        return;
      }
      try {
        const response = await axios.post(
          "http://localhost:5000/api/users/login",
          {
            username: email,
            password,
          }
        );
  
        if (response.data.success) {
          toast({
            title: "Signed in successfully",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          console.log(response.data.token)
          localStorage.setItem('token', response.data.token);
          setEmail("");
          setPassword("");
          setError(null);
          fetchUser();
          navigate('/dashboard');
        } else {
          toast({
            title: response.data.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        toast({
          title: error.response?.data?.message || "An error occurred",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };
  
    const handleEmailChange = (event) => {
      setEmail(event.target.value);
    };
  
    const handlePasswordChange = (event) => {
      setPassword(event.target.value);
    };
  
    const handleShowPassword = () => {
      setShowPassword(!showPassword);
    };
  
    return (
      <Box
        w="100%"
        h="100vh"
        bg="gray.50"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <VStack w="md" p={4} bg="white" borderRadius="md" boxShadow="md">
          <Text fontSize="lg" fontWeight="bold">
            Sign In
          </Text>
          {error && (
            <Text color="red.500" fontSize="sm">
              {error}
            </Text>
          )}
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
              />
              <InputRightElement>
                <Button size="sm" onClick={handleShowPassword}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Button colorScheme="blue" w="100%" onClick={handleSubmit}>
            Sign In
          </Button>
          <Text fontSize="sm" color="gray.500">
            Don't have an account? Contact Admin!
          </Text>
        </VStack>
      </Box>
    );
  };
  
  export default SignInPage;
  