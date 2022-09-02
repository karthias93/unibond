import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dashboard: {},
};

export const dashboardSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    dashboardState: (state, action) => {
      state.dashboard = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { dashboardState } = dashboardSlice.actions;

export default dashboardSlice.reducer;
