import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/slices/authSlice";
import breadcrumbReducer from "@/redux/slices/breadcrumbSlice";
import routeReducer from "@/redux/slices/routeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    breadcrumb: breadcrumbReducer,
    route: routeReducer,
  },
});
