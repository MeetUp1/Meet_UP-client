import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { Provider } from "react-redux";

import Root from "./component/App";
import store from "./store/configureStore";

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Root />
      </NavigationContainer>
    </Provider>
  );
}
