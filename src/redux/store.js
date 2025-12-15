import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/slices/authSlice";
import breadcrumbReducer from "@/redux/slices/breadcrumbSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    breadcrumb: breadcrumbReducer,
  },
});
