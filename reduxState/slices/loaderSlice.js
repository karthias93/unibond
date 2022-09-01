import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  show: false,
};

export const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    toggleState: (state, action) => {
      state.show = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { toggleState } = loaderSlice.actions;

export default loaderSlice.reducer;
