import {
  Dialog,
  Input,
  Button,
  Image,
  useDisclosure,
  Portal,
  CloseButton,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
//import { ChatState } from "../../Context/ChatProvider";
import { toast } from "react-toastify";

const EditProfileModal = ({ user, onUpdate }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState(user.name);
  const [pic, setPic] = useState(user.pic);

  const handleUpdate = async () => {
    let imageUrl = user.pic;

    // If user selected a new file
    if (pic instanceof File) {
      const formData = new FormData();
      formData.append("file", pic);
      formData.append(
        "upload_preset",
        process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
      );
      formData.append(
        "cloud_name",
        process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
      );

      try {
        const res = await fetch(process.env.REACT_APP_CLOUDINARY_UPLOAD_URL, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        imageUrl = data.url.toString();
      } catch (error) {
        toast.error("Image upload failed");
        return;
      }
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/user/profile",
        { name, pic: imageUrl },
        config
      );
      onUpdate(data);
      toast.success("Profile updated");
      onClose();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  return (
    <Dialog.Root isOpen={isOpen} onClose={onClose}>
      <Dialog.Trigger asChild>
        <Button
          variant="ghost"
          onClick={onOpen}
          color={"blueviolet"}
          _hover={{ bg: "darkviolet", color: "white" }}
        >
          Edit Profile
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title color={"royalblue"}>Edit Your Profile</Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton />
              </Dialog.CloseTrigger>
            </Dialog.Header>
            <Dialog.Body display="flex" flexDirection="column" gap={4}>
              <Input
                placeholder="New Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setPic(e.target.files[0])}
              />

              <Image
                borderRadius="full"
                boxSize="100px"
                src={pic instanceof File ? URL.createObjectURL(pic) : pic}
                alt="preview"
              />
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger>
                <Button colorScheme="blue" onClick={handleUpdate}>
                  Save
                </Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default EditProfileModal;
