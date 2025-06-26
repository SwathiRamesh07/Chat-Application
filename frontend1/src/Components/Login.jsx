import { Field, Fieldset, Input, Button, InputGroup } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { setEmail, setPassword, loginRequest } from "../slices/loginSlice";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email, password, loading, userInfo } = useSelector(
    (state) => state.auth
  );

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning("Please fill all the fields", {
        position: "bottom-center",
        autoClose: 3000,
      });
      return;
    }

    dispatch(loginRequest({ email, password }));
  };
  useEffect(() => {
    if (userInfo) {
      dispatch(setEmail(""));
      dispatch(setPassword(""));
      navigate("/chats");
    }
  }, [userInfo, navigate, dispatch]);
  return (
    <Fieldset.Root size="lg" maxW="md" marginLeft={3}>
      <Fieldset.Content>
        <Field.Root id="email" required>
          <Field.Label>
            Email
            <Field.RequiredIndicator />
          </Field.Label>
          <Input
            value={email}
            type="email"
            placeholder="Enter your email"
            onChange={(e) => dispatch(setEmail(e.target.value))}
          />
        </Field.Root>

        <Field.Root id="password" required>
          <Field.Label>
            Password
            <Field.RequiredIndicator />
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
              onChange={(e) => dispatch(setPassword(e.target.value))}
            />
          </InputGroup>
        </Field.Root>
      </Fieldset.Content>

      <Button
        size="md"
        variant="outline"
        color={"black"}
        _hover={{ color: "white" }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>

      {/* <Button
        size="md"
        variant="solid"
        bgColor="blackAlpha.400"
        onClick={() => {
          dispatch(setEmail("guestuserexample@gmail.com"));
          dispatch(setPassword("123456"));
        }}
      >
        Get Guest User Credentials
      </Button> */}
    </Fieldset.Root>
  );
};

export default Login;
