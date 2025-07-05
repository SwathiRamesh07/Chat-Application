import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../Config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import { Avatar, Box, Menu, Portal } from "@chakra-ui/react";
import { Tooltip } from "./ui/tooltip";
import { useId } from "react";
import { TiDelete } from "react-icons/ti";
import { MdEdit } from "react-icons/md";
import decryptMessage from "../utils/decryptMessage";

const ScrollableChat = ({ messages, onDeleteMessage, onStartEdit }) => {
  const { user } = ChatState();
  const id = useId();

  const renderMessageContent = (m) => {
    if (m.fileUrl) {
      const isImage = m.fileType.startsWith("image");

      return isImage ? (
        <img
          src={m.fileUrl}
          alt="uploaded"
          style={{ maxWidth: "200px", borderRadius: "8px" }}
        />
      ) : (
        <a
          href={m.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "blue", textDecoration: "underline" }}
        >
          📎 File
        </a>
      );
    } else {
      return decryptMessage(m.content);
    }
  };

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => {
          const isOwnMessage = m.sender._id === user._id;

          return (
            <div
              key={m._id}
              style={{
                display: "flex",
                justifyContent: isOwnMessage ? "flex-end" : "flex-start",
                paddingLeft: 10,
                paddingRight: 10,
                marginTop: 2,
              }}
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
                {isOwnMessage ? (
                  <Menu.Root>
                    <Menu.Trigger
                      w="100%"
                      textAlign="left"
                      _focus={{ outline: "none" }}
                    >
                      {renderMessageContent(m)}
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

                          {!m.file && (
                            <Menu.Item onClick={() => onStartEdit(m)}>
                              Edit
                              <MdEdit />
                            </Menu.Item>
                          )}
                        </Menu.Content>
                      </Menu.Positioner>
                    </Portal>
                  </Menu.Root>
                ) : (
                  <Box w="100%" textAlign="left">
                    {renderMessageContent(m)}
                  </Box>
                )}
              </Box>
            </div>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
