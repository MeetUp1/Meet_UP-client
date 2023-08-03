import { configureStore } from "@reduxjs/toolkit";

import loginReducer from "../features/reducers/loginSlice";

const store = configureStore({
  reducer: loginReducer,
});

export default store;
