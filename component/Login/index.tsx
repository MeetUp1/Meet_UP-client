import {
  CLIENT_ID,
  IOS_CLIENT_ID,
  LOGIN_API_URL,
  ANDROID_CLIENT_ID,
} from "@env";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";
import * as Google from "expo-auth-session/providers/google";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as WebBrowser from "expo-web-browser";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import { useDispatch } from "react-redux";

import { COLOR_BEIGE, COLOR_BROWN, COLOR_RED } from "../../constants/color";
import { userLogin, expoToken } from "../../features/reducers/loginSlice";

import { Prompt } from "/Users/snaghyuk/Documents/MeetUP/MeetUp-client/node_modules/expo-auth-session/build/AuthRequest.types";

WebBrowser.maybeCompleteAuthSession();

export async function registerForPushNotificationsAsync() {
  let token: string;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert("Must use physical device for Push Notifications");
    return;
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: COLOR_RED,
    });
  }

  return token;
}

export default function Login() {
  type RootStackParamList = {
    ErrorPage: undefined;
    MeetingSchedule: undefined;
  };
  type NavigationProp = StackNavigationProp<RootStackParamList>;

  const [animatedValue, setAnimatedValue] = useState<Animated.Value>(
    new Animated.Value(0),
  );
  const [token, setToken] = useState<string | null>(null);

  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp>();

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
    prompt: "select_account" as Prompt | undefined,
  });

  const navigateToLoginPage = () => {
    navigation.navigate("ErrorPage");
  };

  useEffect(() => {
    if (response?.type === "success" && response.authentication) {
      setToken(response.authentication.accessToken);
      getUserInfo();
    }
  }, [response, token]);

  const getUserInfo = async () => {
    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const user = await response.json();

      if (user) {
        const expoPushToken = await registerForPushNotificationsAsync();
        if (expoPushToken) {
          dispatch(expoToken(expoPushToken));
        }
        dispatch(userLogin(user));
        const postRequest = await axios.post(
          `${LOGIN_API_URL}/api/users/login`,
          {
            user,
            expoPushToken,
          },
        );

        if (postRequest.status === 200) {
          await axios.patch(`${LOGIN_API_URL}/api/users/${user.id}/checkTime`);
          navigation.navigate("MeetingSchedule");
        }
      }
    } catch (error) {
      console.error(error);
      navigateToLoginPage();
    }
  };

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const jumpingAnimation = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -20, 0],
  });

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Animated.Text style={styles.logoText}>Meet-UP</Animated.Text>
        <Animated.Text
          testID="animated-exclamation"
          style={[
            styles.headingExclamation,
            {
              transform: [{ translateY: jumpingAnimation }],
              textShadowColor: "rgba(0, 0, 0, 0.75)",
              textShadowOffset: { width: 1, height: 3 },
              textShadowRadius: 1,
            },
          ]}
        >
          !
        </Animated.Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        disabled={!request}
        onPress={() => {
          promptAsync();
        }}
      >
        <Animated.Text style={[styles.buttonText]}>Log in</Animated.Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLOR_BEIGE,
  },
  headingContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 100,
  },
  logoText: {
    fontSize: 80,
    fontFamily: "GamjaFlower",
    color: COLOR_BROWN,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 3 },
    textShadowRadius: 1,
  },
  headingExclamation: {
    fontSize: 80,
    fontFamily: "GamjaFlower",
    color: COLOR_BROWN,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 150,
    height: 60,
    backgroundColor: COLOR_BROWN,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#000",
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
  buttonText: {
    color: COLOR_BEIGE,
    fontSize: 20,
    fontFamily: "Jua",
  },
});
