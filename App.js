import { NavigationContainer } from "@react-navigation/native";
import * as Font from "expo-font";
import LottieView from "lottie-react-native";
import React, { useState, useEffect } from "react";
import { Provider } from "react-redux";

import animation from "./assets/animation.json/meeting-and-stuff.json";
import Root from "./component/App";
import store from "./store/configureStore";

async function loadFonts() {
  await Font.loadAsync({
    GamjaFlower: require("./assets/fonts/GamjaFlower-Regular.ttf"),
    Jua: require("./assets/fonts/Jua-Regular.ttf"),
  });
}

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await loadFonts();
      } catch (e) {
        console.warn(e);
      } finally {
        setTimeout(() => {
          setIsReady(true);
        }, 4000);
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return (
      <LottieView
        source={animation}
        autoPlay
        loop
        style={{ flex: 1, backgroundColor: "#FFF8EA" }}
      />
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Root />
      </NavigationContainer>
    </Provider>
  );
}
