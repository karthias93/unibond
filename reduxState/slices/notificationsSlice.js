import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notifications: [],
};

export const notificationsSlice = createSlice({
    name: "notificationsState",
    initialState,
    reducers: {
        notificationsState: (state, action) => {
            state.notifications = action.payload.notifications;
        },
    },
});

// Action creators are generated for each case reducer function
export const { notificationsState } = notificationsSlice.actions;

export default notificationsSlice.reducer;
