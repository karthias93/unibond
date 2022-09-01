import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    orders: [],
};

export const ordersSlice = createSlice({
    name: "ordersState",
    initialState,
    reducers: {
        ordersState: (state, action) => {
            state.orders = action.payload.orders;
        },
    },
});

// Action creators are generated for each case reducer function
export const { ordersState } = ordersSlice.actions;

export default ordersSlice.reducer;
