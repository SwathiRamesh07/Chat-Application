import { put, call, takeLatest } from "redux-saga/effects";
import axios from "axios";
import { loginRequest, loginSuccess, loginFailure } from "../slices/loginSlice";
import { toast } from "react-toastify";

function* handleLogin(action) {
  const { email, password } = action.payload;

  try {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    const { data } = yield call(
      axios.post,
      "/api/user/login",
      { email, password },
      config
    );

    yield put(loginSuccess(data));
    localStorage.setItem("userInfo", JSON.stringify(data));

    toast.success("Login Successful", { position: "bottom-center" });
  } catch (error) {
    toast.error("Error Occurred!", { position: "bottom-center" });
    yield put(loginFailure(error.message));
  }
}

function* loginSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
}

export default loginSaga;
