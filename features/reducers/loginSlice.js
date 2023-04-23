import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: {},
  expoPushToken: "",
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    userLogin: (state, action) => {
      state.currentUser = action.payload;
    },
    expoToken: (state, action) => {
      state.expoPushToken = action.payload;
    },
  },
});

export const { userLogin, expoToken } = loginSlice.actions;
export default loginSlice.reducer;
