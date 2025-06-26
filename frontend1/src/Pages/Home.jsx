import { Container, Box, Text, Tabs } from "@chakra-ui/react";
import Login from "../../../frontend1/src/Components/Login";
import Signup from "../../../frontend1/src/Components/Signup";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) {
      navigate("/chats");
    }
  }, [navigate]);
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text
          fontSize="4xl"
          fontFamily="Work sans"
          color="black"
          textAlign="center"
        >
          Talkify
        </Text>
      </Box>
      <Box
        bg="white"
        w="100%"
        p={4}
        borderRadius="lg"
        borderWidth="1px"
        color="black"
      >
        <Tabs.Root variant="enclosed" maxW="md" fitted defaultValue={"login"}>
          <Tabs.List rounded="l3" p="1" bg="transparent">
            <Tabs.Trigger value="login">Login</Tabs.Trigger>
            <Tabs.Trigger value="signup">Signup</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="login">
            <Login />
          </Tabs.Content>
          <Tabs.Content value="signup">
            <Signup />
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Container>
  );
};

export default Home;

// import { Container, Box, Text, Tabs } from "@chakra-ui/react";
// import Login from "../../../frontend1/src/Components/Login";
// import Signup from "../../../frontend1/src/Components/Signup";
// import { useNavigate } from "react-router-dom";
// import { useEffect } from "react";

// const Home = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("userInfo"));

//     if (user) {
//       navigate("/chats");
//     }
//   }, [navigate]);

//   return (
//     <Box
//       minH="100vh"
//       bgGradient="linear(to-r, blue.100, purple.200)"
//       display="flex"
//       alignItems="center"
//       justifyContent="center"
//       py={12}
//     >
//       <Container maxW="md" centerContent>
//         <Box
//           backdropFilter="blur(10px)"
//           bg="whiteAlpha.800"
//           boxShadow="lg"
//           p={6}
//           borderRadius="2xl"
//           borderWidth="1px"
//           w="100%"
//         >
//           <Text
//             fontSize="5xl"
//             fontWeight="bold"
//             fontFamily="'Poppins', sans-serif"
//             color="purple.700"
//             textAlign="center"
//             mb={4}
//             letterSpacing={1}
//           >
//             🚀 Talkify
//           </Text>

//           <Tabs.Root fitted variant="enclosed-colored" colorScheme="purple"  defaultValue={"login"}>
//             <Tabs.List mb={4} >
//               <Tabs.Trigger
//                 value="login"
//                 _selected={{ bg: "purple.500", color: "white" }}
//                 _hover={{ bg: "purple.400", color: "white" }}
//                 px={6}
//                 py={2}
//                 borderRadius="xl"
//               >
//                 Login
//               </Tabs.Trigger>
//               <Tabs.Trigger
//                 value="signup"
//                 _selected={{ bg: "purple.500", color: "white" }}
//                 _hover={{ bg: "purple.400", color: "white" }}
//                 px={6}
//                 py={2}
//                 borderRadius="xl"
//               >
//                 Signup
//               </Tabs.Trigger>
//             </Tabs.List>
//             <Tabs.Content value="login">
//               <Login />
//             </Tabs.Content>
//             <Tabs.Content value="signup">
//               <Signup />
//             </Tabs.Content>
//           </Tabs.Root>
//         </Box>
//       </Container>
//     </Box>
//   );
// };

// export default Home;
