import { createSlice } from "@reduxjs/toolkit";

const breadcrumbSlice = createSlice({
  name: "breadcrumb",
  initialState: { crumbs: [] },
  reducers: {
    addCrumb: (state, action) => {
      state.crumbs = [action.payload]; // overwrite with latest
    },
    clearCrumbs: (state) => {
      state.crumbs = [];
    },
  },
});

export const { addCrumb, clearCrumbs } = breadcrumbSlice.actions;
export default breadcrumbSlice.reducer;
