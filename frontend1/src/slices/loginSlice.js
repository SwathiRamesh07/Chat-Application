import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: '',
  password: '',
  loading: false,
  userInfo: null,
  error: null,
};

const loginSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setEmail,
  setPassword,
  loginRequest,
  loginSuccess,
  loginFailure,
} = loginSlice.actions;

export default loginSlice.reducer;
