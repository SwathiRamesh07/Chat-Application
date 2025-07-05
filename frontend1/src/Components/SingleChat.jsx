import {
  Box,
  IconButton,
  Text,
  Spinner,
  Field,
  Input,
  Flex,
} from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import { MdArrowBack } from "react-icons/md";
import { getSender, getSenderFull } from "../Config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ScrollableChat from "./ScrollableChat.jsx";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../Animations/typing.json";
import decryptMessage from "../utils/decryptMessage.js";
import "./styles.css";
import { IoMdSend } from "react-icons/io";
import { IoAttach } from "react-icons/io5";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const startEdit = (msg) => {
    setEditingId(msg._id);
    setNewMessage(decryptMessage(msg.content));
    socket.emit("stop typing", selectedChat._id); // no typing indicator yet
    // slight delay so the ref is mounted
    setTimeout(() => inputRef.current?.focus(), 0);
  };
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));

    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
      }
    });

    // Listen for deleted messages
    socket.on("message deleted", ({ messageId }) => {
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message._id !== messageId)
      );
    });

    // Edited message
    socket.on("message edited", (editedMsg) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === editedMsg._id ? editedMsg : m))
      );
    });

    // Clean up
    return () => {
      socket.off("message recieved");
      socket.off("message edited");
      socket.off("message deleted");
    };
  }, []);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast.error("Error Occured");
    }
  };

  const sendMessage = async (event) => {
    if (!newMessage || !newMessage.trim()) return;
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);

      if (editingId) {
        /* ---- UPDATE existing message ---- */
        try {
          const { data } = await axios.put(
            `/api/message/${editingId}`,
            {
              content: newMessage,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          setMessages((prev) =>
            prev.map((m) => (m._id === data._id ? data : m))
          );
          socket.emit("message edited", data);
          setEditingId(null);
          setNewMessage("");
        } catch (err) {
          toast.error("Edit failed");
        }
        return;
      }

      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
            fileUrl: selectedFile?.url || "",
            fileType: selectedFile?.type || "",
          },
          config
        );

        console.log(data);

        socket.emit("new message", data);

        setMessages([...messages, data]);
      } catch (error) {
        toast.error("Error Occured!");
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    //typing indicator Logic

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const deleteMessage = async (messageId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.delete(`/api/message/${messageId}`, config);

      // Update UI locally
      setMessages(messages.filter((m) => m._id !== messageId));

      toast.success("Message deleted");

      // Emit the delete event to notify other clients
      socket.emit("delete message", {
        messageId,
        chatId: selectedChat._id,
      });
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const editMessage = async (messageId, newContent) => {
    if (!newContent.trim()) return; // ignore empty edits

    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/message/${messageId}`,
        { content: newContent },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      // optimistic local update
      setMessages((prev) => prev.map((m) => (m._id === data._id ? data : m)));

      // tell everyone else
      socket.emit("message edited", data);
    } catch (err) {
      toast.error("Edit failed");
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
    ); // required

    try {
      const res = await fetch(process.env.REACT_APP_CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error.message);
      }

      return { url: data.secure_url, type: file.type };
    } catch (error) {
      toast.error("File upload failed: " + error.message);
      return null;
    }
  };

  const handleAttachClick = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "*/*";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const uploaded = await handleFileUpload(file);
      if (!uploaded) return;

      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          "/api/message",
          {
            content: "[file]",
            chatId: selectedChat._id,
            fileUrl: uploaded.url,
            fileType: uploaded.type,
          },
          config
        );

        socket.emit("new message", data);
        setMessages((prev) => [...prev, data]);
      } catch (err) {
        toast.error("Failed to send file");
      }
    };
    input.click();
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            paddingBottom={3}
            paddingX={2}
            width={"100%"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              onClick={() => setSelectedChat("")}
            >
              <MdArrowBack />
            </IconButton>

            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  // fetchMessages={fetchMessages}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir={"column"}
            justifyContent={"flex-end"}
            padding={3}
            background={"#E8E8E8"}
            width={"100%"}
            height={"100%"}
            borderRadius={"lg"}
            overflowY={"hidden"}
          >
            {loading ? (
              <Spinner
                size="xl"
                width={20}
                height={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat
                  messages={messages}
                  onDeleteMessage={deleteMessage}
                  onEditMessage={editMessage}
                  onStartEdit={startEdit}
                />
              </div>
            )}
            <Field.Root onKeyDown={sendMessage} mt={3} required>
              {isTyping && (
                <Lottie
                  options={defaultOptions}
                  height={40}
                  width={71}
                  style={{ marginBottom: 15, marginLeft: 0 }}
                />
              )}

              <Flex w="100%" gap={2} align="center">
                <Input
                  ref={inputRef}
                  flex="1"
                  variant="subtle"
                  bg="#E0E0E0"
                  placeholder={editingId ? "Edit message…" : "Enter a message…"}
                  onChange={typingHandler}
                  value={newMessage}
                  onKeyDown={sendMessage}
                />
                <IconButton onClick={handleAttachClick}>
                  <IoAttach />
                </IconButton>
                <IconButton
                  size="sm"
                  colorScheme="teal"
                  aria-label="Send"
                  isDisabled={!newMessage || !newMessage.trim()}
                  onClick={() => sendMessage({ key: "Enter" })}
                >
                  <IoMdSend />
                </IconButton>
              </Flex>
            </Field.Root>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems={"center"}
          justifyContent={"center"}
          height={"100%"}
        >
          <Text fontSize={"3xl"} paddingBottom={3} fontFamily={"Work sans"}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
