import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Avatar,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import axios from "axios";

const DashboardPage = () => {
  const toast = useToast();
  const bg = useColorModeValue("gray.50", "gray.800");
  const color = useColorModeValue("gray.600", "gray.400");
  const [mySlots, setMySlot] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  const { logout, user } = useContext(UserContext);

  const profile = {
    name: user.username,
    avatar: "https://via.placeholder.com/50",
  };

  async function bookSlot(slotId) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
  
      const response = await axios.post(
        "http://localhost:5000/api/slots/book-slot",
        { slotId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.success) {
        toast({
          title: response.data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        console.log('hi')
        toast({
          title: response.data.message,
          status: "error", 
          duration: 3000,
          isClosable: true,
        });
      }
      renderPage();
    } catch (error) {
        console.log('hi2')
      toast({
        title: "An error occurred while booking",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  async function cancelSlot(slotId) {
    console.log(slotId)
    try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }
    
        const response = await axios.post(
          "http://localhost:5000/api/slots/cancel-slot",
          { slotId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        if (response.data.success) {
          toast({
            title: response.data.message,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          
        } else {
          console.log('hi')
          toast({
            title: response.data.message,
            status: "error", 
            duration: 3000,
            isClosable: true,
          });
        }
        renderPage();
      } catch (error) {
          console.log('hi2')
        toast({
          title: "An error occurred while booking",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
  }

  async function getMySlots() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.get(
        "http://localhost:5000/api/users/my-slots",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setMySlot(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching slots:", error);
      throw error;
    }
  }

  async function getAllSlots() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.get("http://localhost:5000/api/slots", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setAvailableSlots(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching slots:", error);
      throw error;
    }
  }

  useEffect(() => {
    renderPage();
  }, []);

  function renderPage() {
    getMySlots();
    getAllSlots();
  }

  return (
    <Box bg={bg} color={color} p={4} minH="100vh">
      <Flex justify="space-between" align="center" mb={4}>
        <HStack spacing={4}>
          <Avatar src={profile.avatar} size="md" />
          <VStack align="start">
            <Text fontSize="lg" fontWeight="bold">
              {profile.name}
            </Text>
          </VStack>
        </HStack>
        <Button onClick={logout} colorScheme="blue" size="sm">
          Logout
        </Button>
      </Flex>
      <Box height="250px" mb={4}>
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          My Slots
        </Text>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Room</Th>
              <Th>Slot</Th>
              <Th>Options</Th>
            </Tr>
          </Thead>
          <Tbody>
            {mySlots.map((slot) => (
              <Tr key={slot._id}>
                <Td>{slot.date.split("T")[0]}</Td>
                <Td>{slot.room}</Td>
                <Td>{slot.slot}</Td>
                <Td>
                  <Button
                    onClick={() => cancelSlot(slot._id)}
                    colorScheme="red"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Box maxH="400px" overflowY="auto">
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          Available Slots (Next 7 Days)
        </Text>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Room</Th>
              <Th>Slot</Th>
              <Th>Options</Th>
            </Tr>
          </Thead>
          <Tbody>
            {availableSlots.map((slot) => (
              <Tr key={slot._id}>
                <Td>{slot.date.split("T")[0]}</Td>
                <Td>{slot.room}</Td>
                <Td>{slot.slot}</Td>
                <Td>
                  <Button isDisabled={slot.isBooked}
                    onClick={() => {
                      bookSlot(slot._id);
                    }}
                    colorScheme="blue"
                    size="sm"
                  >
                    Book
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default DashboardPage;
