import { configureStore } from "@reduxjs/toolkit";

import loginReducer from "../features/reducers/loginSlice.js";

const store = configureStore({
  reducer: loginReducer,
});

export default store;
