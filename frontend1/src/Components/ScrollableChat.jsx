import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../Config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import { Avatar, IconButton, Box, Menu, Portal } from "@chakra-ui/react";
import { Tooltip } from "./ui/tooltip";
import { useId } from "react";
import { TiDelete } from "react-icons/ti";
import { MdEdit } from "react-icons/md";
import decryptMessage from "../utils/decryptMessage";

const ScrollableChat = ({ messages, onDeleteMessage }) => {
  const { user } = ChatState();
  const id = useId();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => {
          const isOwnMessage = m.sender._id === user._id;

          return (
            <div
              // style={{
              //   display: "flex",
              //   justifyContent: isOwnMessage ? "flex-end" : "flex-start",
              //   overflowX: "hidden",
              // }}
              // key={m._id}
              style={{
                display: "flex",
                justifyContent: isOwnMessage ? "flex-end" : "flex-start",
                paddingLeft: 10,
                paddingRight: 10,
                marginTop: 2,
              }}
              key={m._id}
            >
              {!isOwnMessage &&
                (isSameSender(messages, m, i, user._id) ||
                  isLastMessage(messages, i, user._id)) && (
                  <Tooltip
                    ids={{ trigger: id }}
                    content={m.sender.name}
                    positioning={{ offset: { mainAxis: 4, crossAxis: 4 } }}
                    hasArrow
                  >
                    <Avatar.Root
                      ids={{ root: id }}
                      marginTop={"7px"}
                      marginRight={1}
                      size={"sm"}
                      cursor={"pointer"}
                    >
                      <Avatar.Fallback name={m.sender.name} />
                      <Avatar.Image src={m.sender.pic} />
                    </Avatar.Root>
                  </Tooltip>
                )}
              <Box
                bg={isOwnMessage ? "#BEE3F8" : "#B9F5D0"}
                marginLeft={isSameSenderMargin(messages, m, i, user._id)}
                marginTop={isSameUser(messages, m, i) ? 1 : 3}
                borderRadius="20px"
                paddingX={4}
                paddingY={2}
                maxW="75%"
                alignSelf={isOwnMessage ? "flex-end" : "flex-start"}
                position="relative"
                cursor="pointer"
                display="inline-block"
              >
                <Menu.Root>
                  <Menu.Trigger w="100%" textAlign="left">
                    {decryptMessage(m.content)}
                  </Menu.Trigger>
                  <Portal>
                    <Menu.Positioner>
                      <Menu.Content>
                        <Menu.Item
                          color="red"
                          onClick={() => onDeleteMessage(m._id)}
                        >
                          Delete
                          <TiDelete />
                        </Menu.Item>
                        <Menu.Item
                          onClick={() => alert("Update message logic here")}
                        >
                          Edit
                          <MdEdit />
                        </Menu.Item>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
              </Box>

              {/* <span
                style={{
                  backgroundColor: isOwnMessage ? "#BEE3F8" : "#B9F5D0",
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i) ? 3 : 10,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  alignSelf: isOwnMessage ? "flex-end" : "flex-start",
                  display: "inline-block",
                  position: "relative",
                }}
              >
                {decryptMessage(m.content)}
                {isOwnMessage && onDeleteMessage && (
                  <IconButton
                    onClick={() => onDeleteMessage(m._id)}
                    style={{
                      position: "absolute",
                      top: "-17px",
                      right: "-10px",
                      background: "none",
                      border: "none",
                      color: "red",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                  >
                    <TiDelete />
                  </IconButton>
                )}
              </span> */}

              {/* <Tooltip
                content={
                  isOwnMessage && onDeleteMessage ? (
                    <IconButton
                      size="xs"
                      variant="ghost"
                      colorScheme="red"
                      aria-label="Delete message"
                    >
                      <TiDelete
                        color="red"
                        onClick={() => onDeleteMessage(m._id)}
                      />
                    </IconButton>
                  ) : null
                }
                placement="top"
                hasArrow
                shouldWrapChildren
                bg="transparent"
              >
                <Box
                  bg={isOwnMessage ? "#BEE3F8" : "#B9F5D0"}
                  ml={isSameSenderMargin(messages, m, i, user._id)}
                  mt={isSameUser(messages, m, i) ? 3 : 10}
                  borderRadius="20px"
                  px={3}
                  py={2}
                  maxW="75%"
                  position="relative"
                >
                  {decryptMessage(m.content)}
                </Box>
              </Tooltip> */}
            </div>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
