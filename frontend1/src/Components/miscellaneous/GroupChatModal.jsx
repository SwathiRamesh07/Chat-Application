import {
  useDisclosure,
  Button,
  CloseButton,
  Dialog,
  Portal,
  Field,
  Fieldset,
  Input,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import { toast } from "react-toastify";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

const GroupChatModal = ({ children, props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
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
      setSearchResult(data);
    } catch (error) {
      toast.error("Failed to Load the Search Results");
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast.warning("Please fill all the fields");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      if (props?.onChatCreated) {
        props.onChatCreated(data); // <-- This line triggers update in MyChats
      }

      toast.success("New Group Chat Created!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to Create the Chat!"
      );
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast.warning("User already added");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  return (
    <>
      <Dialog.Root open={isOpen} onClose={onClose} placement={"center"}>
        <Dialog.Trigger asChild>
          <span onClick={onOpen}>{children}</span>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title
                  fontSize={"35px"}
                  fontFamily={"Work sans"}
                  display={"flex"}
                  justifyContent={"center"}
                >
                  Create Group Chat
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body
                display={"flex"}
                flexDir={"column"}
                alignItems={"center"}
              >
                <Fieldset.Root size="lg" maxW="md" marginLeft={3}>
                  <Fieldset.Content>
                    <Field.Root required>
                      {/* <Field.Label>
                        Email
                        <Field.RequiredIndicator />
                      </Field.Label> */}
                      <Input
                        placeholder="Chat Name"
                        marginBottom={3}
                        onChange={(e) => setGroupChatName(e.target.value)}
                      />
                    </Field.Root>

                    <Field.Root required>
                      <Input
                        placeholder="Add Users eg: Swathi,Durga,Shivani"
                        marginBottom={1}
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                    </Field.Root>
                  </Fieldset.Content>
                </Fieldset.Root>
                <Box width={"100%"} display={"flex"} flexWrap={"wrap"}>
                  {selectedUsers.map((u) => (
                    <UserBadgeItem
                      key={u._id}
                      user={u}
                      handleFunction={() => handleDelete(u)}
                    />
                  ))}
                </Box>
                {loading ? (
                  // <ChatLoading />
                  <div>Loading...</div>
                ) : (
                  searchResult
                    ?.slice(0, 4)
                    .map((user) => (
                      <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={() => handleGroup(user)}
                      />
                    ))
                )}
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button
                    variant="outline"
                    bg="blue.500"
                    onClick={handleSubmit}
                  >
                    Create Chat
                  </Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default GroupChatModal;
