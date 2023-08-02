import { NavigationContainer } from "@react-navigation/native";
import * as Font from "expo-font";
import LottieView from "lottie-react-native";
import React, { useState, useEffect } from "react";
import { Provider } from "react-redux";

import animation from "./assets/animation.json/meeting-and-stuff.json";
import Root from "./component/App/index";
import { COLOR_BEIGE } from "./constants/color";
import { LOADING_ANIMATION_DELAY } from "./constants/timings";
import store from "./store/configureStore";

async function loadFonts(): Promise<void> {
  try {
    await Font.loadAsync({
      GamjaFlower: require("./assets/fonts/GamjaFlower-Regular.ttf"),
      Jua: require("./assets/fonts/Jua-Regular.ttf"),
    });
  } catch (e: any) {
    console.warn(e);
  }
}

const App = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await loadFonts();
      } catch (e: any) {
        console.warn(e);
      } finally {
        setTimeout(() => {
          setIsReady(true);
        }, LOADING_ANIMATION_DELAY);
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
        style={{ flex: 1, backgroundColor: COLOR_BEIGE }}
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
};

export default App;
