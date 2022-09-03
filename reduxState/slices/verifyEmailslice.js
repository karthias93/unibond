import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  verify: {
    show: false,
    email: ''
  }
};

export const verifyEmailSlice = createSlice({
  name: "verifyEmailState",
  initialState,
  reducers: {
    toggleState: (state, action) => {
      state.verify = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const { toggleState } = verifyEmailSlice.actions;

export default verifyEmailSlice.reducer;
