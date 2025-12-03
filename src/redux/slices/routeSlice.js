import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  returnUrl: "",
};
const routeSlice = createSlice({
  name: "route",
  initialState,
  reducers: {
    setReturnUrl: (state, action) => {
      state.returnUrl = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("returnUrl", action.payload);
      }
    },
    clearReturnUrl: (state) => {
      state.returnUrl = "";
      if (typeof window !== "undefined") {
        localStorage.removeItem("returnUrl");
      }
    },
    loadReturnUrlFromStorage: (state) => {
      if (typeof window !== "undefined") {
        state.returnUrl = localStorage.getItem(returnUrl) || "";
      }
    },
  },
});
export const { setReturnUrl, clearReturnUrl, loadReturnUrlFromStorage } =
  routeSlice.actions;
export default routeSlice.reducer;
