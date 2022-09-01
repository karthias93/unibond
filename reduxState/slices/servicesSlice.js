import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    services: [],
};

export const servicesSlice = createSlice({
    name: "servicesState",
    initialState,
    reducers: {
        servicesState: (state, action) => {
            state.services = action.payload.services;
        },
    },
});

// Action creators are generated for each case reducer function
export const { servicesState } = servicesSlice.actions;

export default servicesSlice.reducer;
