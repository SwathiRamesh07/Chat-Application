import { useState } from "react";
import {
  Field,
  Fieldset,
  Input,
  Button,
  InputGroup,
  Text,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signupTrigger } from "../sagas/signupActions";
import { toast } from "react-toastify";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [pic, setPic] = useState(null);

  const { loading, error } = useSelector((state) => state.signup);

  const submitHandler = async () => {
    if (!name || !email || !password || !confirmpassword) {
      toast.warning("Please fill all the fields");
      return;
    }

    if (password !== confirmpassword) {
      toast.warning("Passwords do not match");
      return;
    }

    let imageUrl;

    if (pic instanceof File) {
      const formData = new FormData();
      formData.append("file", pic);
      formData.append("upload_preset", "Chat-app");
      formData.append("cloud_name", "dvuo1pg4j");

      try {
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dvuo1pg4j/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();
        imageUrl = data.url.toString(); //  Get URL from Cloudinary
      } catch (err) {
        toast.error("Image Upload Failed");
        return;
      }
    }

    //  Dispatch only serializable values (no File objects)
    dispatch(
      signupTrigger({
        name,
        email,
        password,
        confirmpassword,
        pic: imageUrl,
        navigate,
      })
    );
    setName("");
    setEmail("");
    setPassword("");
    setConfirmpassword("");
    setPic(null);
  };

  return (
    <Fieldset.Root size="lg" maxW="md" marginLeft={3}>
      {/* <Fieldset.Legend>
        <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={4}>
          Create an Account
        </Text>
      </Fieldset.Legend> */}

      {error && (
        <Text color="red.500" fontSize="sm" mb={4} textAlign="center">
          {error}
        </Text>
      )}

      <Fieldset.Content>
        <Field.Root id="name" required>
          <Field.Label>
            Name <Field.RequiredIndicator />
          </Field.Label>
          <Input
            value={name}
            type="text"
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
          />
        </Field.Root>

        <Field.Root id="email" required>
          <Field.Label>
            Email address <Field.RequiredIndicator />
          </Field.Label>
          <Input
            value={email}
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field.Root>

        <Field.Root id="password" required>
          <Field.Label>
            Password <Field.RequiredIndicator />
          </Field.Label>
          <InputGroup
            endAddon={
              <Button
                size="sm"
                h="1.75rem"
                onClick={handleClick}
                variant="ghost"
              >
                {show ? "Hide" : "Show"}
              </Button>
            }
          >
            <Input
              value={password}
              type={show ? "text" : "password"}
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputGroup>
        </Field.Root>

        <Field.Root id="confirmpassword" required>
          <Field.Label>
            Confirm Password <Field.RequiredIndicator />
          </Field.Label>
          <InputGroup
            endAddon={
              <Button
                size="sm"
                h="1.75rem"
                onClick={handleClick}
                variant="ghost"
              >
                {show ? "Hide" : "Show"}
              </Button>
            }
          >
            <Input
              value={confirmpassword}
              type={show ? "text" : "password"}
              placeholder="Confirm Password"
              onChange={(e) => setConfirmpassword(e.target.value)}
            />
          </InputGroup>
        </Field.Root>

        <Field.Root id="pic">
          <Field.Label>Upload your Picture</Field.Label>
          <Input
            type="file"
            p={1.5}
            accept="image/*"
            onChange={(e) => setPic(e.target.files[0])}
          />
        </Field.Root>
      </Fieldset.Content>

      <Button
        size="md"
        variant="outline"
        color={"black"}
        _hover={{ color: "white" }}
        onClick={submitHandler}
        isLoading={loading}
        mt={4}
      >
        Signup
      </Button>
    </Fieldset.Root>
  );
};

export default Signup;
