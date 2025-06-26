import { FaEye } from "react-icons/fa";
import {
  Button,
  IconButton,
  Image,
  Text,
  Dialog,
  CloseButton,
  Portal,
  useDisclosure,
} from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Dialog.Root
      placement={"center"}
      motionPreset="slide-in-bottom"
      onClose={onClose}
      isOpen={isOpen}
    >
      <Dialog.Trigger asChild>
        {children ? (
          <span onClick={onOpen}>{children}</span>
        ) : (
          <IconButton
            aria-label="View Profile"
            display={{ base: "flex" }}
            onClick={onOpen}
          >
            <FaEye />
          </IconButton>
        )}
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title
                fontSize="2xl"
                fontFamily="Work sans"
                textAlign="center"
              >
                {user.name}
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              gap={4}
            >
              <Image
                borderRadius="full"
                boxSize="150px"
                src={user.pic}
                alt={user.name}
              />
              <Text fontSize={{ base: "lg", md: "xl" }} fontFamily="Work sans">
                Email: {user.email}
              </Text>
            </Dialog.Body>

            <Dialog.Footer justifyContent="center">
              <Dialog.ActionTrigger>
                <Button onClick={() => document.activeElement?.blur()}>
                  Close
                </Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size={"sm"} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ProfileModal;
