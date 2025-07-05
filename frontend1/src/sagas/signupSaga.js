import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  signupRequest,
  signupSuccess,
  signupFailure,
} from "../slices/signupSlice";
import { toast } from "react-toastify";
import { SIGNUP_TRIGGER } from "./signupActions";

// Signup handler
function* handleSignup(action) {
  const { name, email, password, confirmpassword, pic, navigate } =
    action.payload;

  yield put(signupRequest());

  // Field validations
  if (!name || !email || !password || !confirmpassword) {
    toast.warning("Please fill all the fields");
    yield put(signupFailure("All fields required"));
    return;
  }

  if (password !== confirmpassword) {
    toast.warning("Passwords do not match");
    yield put(signupFailure("Password mismatch"));
    return;
  }

  // Set default profile picture if none provided
  const imageUrl =
    pic ||
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

  try {
    const config = {
      headers: {
        "Content-Type": "application/json", // FIX: Key should be in quotes
      },
    };

    // API call to register user
    const { data } = yield call(
      axios.post,
      "/api/user",
      {
        name,
        email,
        password,
        pic: imageUrl,
      },
      config
    );

    // Store user and navigate
    toast.success("Registration Successful");
    localStorage.setItem("userInfo", JSON.stringify(data));
    yield put(signupSuccess(data));

    //  Navigate to chats page  this will trigger fetching user's chats
    navigate("/chats");
  } catch (error) {
    toast.error("Signup Failed");
    yield put(signupFailure(error.response?.data?.message || "Signup failed"));
  }
}

// Watcher
function* signupSaga() {
  yield takeLatest(SIGNUP_TRIGGER, handleSignup);
}

export default signupSaga;
