// import { createContext, useContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const ChatContext = createContext();

// const ChatProvider = ({ children }) => {
//   const navigate = useNavigate();

//   const [user, setUser] = useState();
//   const [selectedChat, setSelectedChat] = useState();
//   const [notification, setNotification] = useState([]);
//   const [chats, setChats] = useState([]);

//   useEffect(() => {
//     const userInfo = JSON.parse(localStorage.getItem("userInfo"));
//     setUser(userInfo);

//     if (!userInfo) {
//       navigate("/");
//     }
//   }, [navigate]);

//   return (
//     <ChatContext.Provider
//       value={{
//         user,
//         setUser,
//         selectedChat,
//         setSelectedChat,
//         notification,
//         setNotification,
//         chats,
//         setChats,
//       }}
//     >
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const ChatState = () => {
//   return useContext(ChatContext);
// };

// export default ChatProvider;

import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const ChatContext = createContext();

const ENDPOINT = "http://localhost:5000";
let socket;

const ChatProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) {
      navigate("/");
    } else {
      socket = io(ENDPOINT);
      socket.emit("setup", userInfo);

      socket.on("connected", () => {
        console.log("Socket connected");
      });

      socket.on("group-chat-created", (newGroupChat) => {
        setChats((prevChats) => {
          const exists = prevChats.find(
            (chat) => chat._id === newGroupChat._id
          );
          return exists ? prevChats : [newGroupChat, ...prevChats];
        });
      });
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        notification,
        setNotification,
        chats,
        setChats,
        socket,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => useContext(ChatContext);
export default ChatProvider;
