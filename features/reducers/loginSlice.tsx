import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { User, LoginState } from "../../store/types";

const initialState: LoginState = {
  currentUser: null,
  expoPushToken: "",
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    userLogin: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    expoToken: (state, action: PayloadAction<string>) => {
      state.expoPushToken = action.payload;
    },
  },
});

export const { userLogin, expoToken } = loginSlice.actions;
export default loginSlice.reducer;
