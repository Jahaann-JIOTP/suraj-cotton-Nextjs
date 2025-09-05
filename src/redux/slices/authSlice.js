import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const initialState = {
  isAuthenticated: false,
  token: null,
  role: null,
};

const isValidateToken = (token) => {
  if (!token) return false;
  try {
    const decode = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decode.exp > currentTime;
  } catch (error) {
    console.error(error.message);
    return false;
  }
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initializeAuth: (state) => {
      if (typeof window === "undefined") return;
      const token = localStorage.getItem("token");
      if (isValidateToken(token)) {
        const decoded = jwtDecode(token);
        state.token = token;
        state.isAuthenticated = true;
        state.role = decoded.role || null;
      } else {
        localStorage.removeItem("token");
        state.token = null;
        state.isAuthenticated = false;
        state.role = null;
      }
    },
    login: (state, action) => {
      localStorage.setItem("token", action.payload);
      const decoded = jwtDecode(action.payload);
      state.token = action.payload;
      state.isAuthenticated = true;
      state.role = decoded.role || null;
    },
    logout: (state) => {
      localStorage.removeItem("token");
      state.token = null;
      state.isAuthenticated = false;
      state.role = null;
    },
  },
});
export const { login, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
