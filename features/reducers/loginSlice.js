import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: {},
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    userLogin: (state, action) => {
      state.currentUser = action.payload;
    },
  },
});

export const { userLogin } = loginSlice.actions;
export default loginSlice.reducer;
