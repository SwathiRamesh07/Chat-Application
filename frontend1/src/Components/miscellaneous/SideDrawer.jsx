import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Box,
  Button,
  Text,
  Menu,
  IconButton,
  Avatar,
  Portal,
  Drawer,
  useDisclosure,
  CloseButton,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { Tooltip } from "../ui/tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FaBell } from "react-icons/fa";
import { RxCaretDown } from "react-icons/rx";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal.jsx";
import { toast } from "react-toastify";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem.jsx";
import { getSender } from "../../Config/ChatLogics.jsx";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import EditProfileModal from "./EditProfileModal.jsx";
const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast.warning("Please Enter something in search");
      return;
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      toast.error("Error Occured!");
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chat", { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast.error("Error fetching the chat");
    }
  };
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        width="100%"
        padding="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Drawer.Root open={isOpen} onClose={onClose} placement="start">
          <Drawer.Trigger>
            <Tooltip
              content="Search User to chat"
              hasArrow
              positioning={{ placement: "bottom-end" }}
            >
              <Button variant="surface" onClick={onOpen}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                <Text display={{ base: "none", md: "flex" }} paddingX={4}>
                  Search User
                </Text>
              </Button>
            </Tooltip>
          </Drawer.Trigger>
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content>
                <Drawer.Header borderBottomWidth="1px">
                  <Drawer.Title>Search Users</Drawer.Title>
                  <Drawer.CloseTrigger asChild>
                    <CloseButton position="absolute" right="8px" top="8px" />
                  </Drawer.CloseTrigger>
                </Drawer.Header>
                <Drawer.Body>
                  <Box display="flex" paddingBottom="2px">
                    <Input
                      placeholder="Search by name or email"
                      marginRight="2px"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button onClick={handleSearch}>GO</Button>
                  </Box>

                  {loading ? (
                    <ChatLoading />
                  ) : (
                    searchResults?.map((user) => (
                      <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={() => accessChat(user._id)}
                      />
                    ))
                  )}
                  {loadingChat && <Spinner marginLeft="auto" display="flex" />}
                </Drawer.Body>
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>

        <Text fontSize="3xl" fontFamily="Work sans" color="black">
          Talkify
        </Text>
        <div>
          <Menu.Root>
            {/* <Menu.Trigger asChild>
              <IconButton>
                   <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
                right="-28px"
              />
                <FaBell  />
              </IconButton>
            </Menu.Trigger> */}
            <Menu.Trigger asChild>
              <IconButton>
                <div style={{ position: "relative" }}>
                  <FaBell />
                  {notification.length > 0 && (
                    <NotificationBadge
                      count={notification.length}
                      effect={Effect.SCALE}
                      style={{
                        position: "absolute",
                        top: "-30px",
                        right: "-8px",
                        zIndex: 1,
                      }}
                    />
                  )}
                </div>
              </IconButton>
            </Menu.Trigger>

            <Portal>
              <Menu.Positioner>
                <Menu.Content pl={2}>
                  {!notification.length && "No New Messages"}
                  {notification.map((notif) => (
                    <Menu.Item
                      key={notif._id}
                      onClick={() => {
                        setSelectedChat(notif.chat);
                        setNotification(
                          notification.filter((n) => n !== notif)
                        );
                      }}
                    >
                      {notif.chat.isGroupChat
                        ? `New Message in ${notif.chat.chatName}`
                        : `New Message from ${getSender(
                            user,
                            notif.chat.users
                          )}`}
                    </Menu.Item>
                  ))}
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
          <Menu.Root>
            <Menu.Trigger as={Button}>
              <Avatar.Root size={"sm"} cursor={"pointer"}>
                <Avatar.Fallback name={user.name} />
                <Avatar.Image src={user.pic} />
              </Avatar.Root>
              <RxCaretDown />
            </Menu.Trigger>

            <Portal>
              <Menu.Positioner>
                <Menu.Content bgColor={"white"}>
                  <ProfileModal user={user}>
                    <Box
                      px={4}
                      py={2}
                      _hover={{ bg: "gray.100" }}
                      cursor="pointer"
                      color={"black"}
                    >
                      My Profile
                    </Box>
                  </ProfileModal>

                  <EditProfileModal
                    user={user}
                    onUpdate={(updateduser) => {
                      localStorage.setItem(
                        "userInfo",
                        JSON.stringify(updateduser)
                      );
                      window.location.reload(); // reload to reflect changes in avatar etc.
                    }}
                  ></EditProfileModal>

                  <Menu.Item
                    onClick={logoutHandler}
                    px={4}
                    py={2}
                    _hover={{ bg: "gray.100" }}
                    cursor="pointer"
                    color={"black"}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </div>
      </Box>
    </>
  );
};

export default SideDrawer;
