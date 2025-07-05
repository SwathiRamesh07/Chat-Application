import { createSlice } from "@reduxjs/toolkit";

const signupSlice = createSlice({
  name: "signup",
  initialState: {
    loading: false,
    user: null,
    error: null,
  },
  reducers: {
    signupRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    signupSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    signupFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearSignupState: (state) => {
      state.loading = false;
      state.user = null;
      state.error = null;
    },
  },
});

export const { signupRequest, signupSuccess, signupFailure, clearSignupState } =
  signupSlice.actions;

export default signupSlice.reducer;
