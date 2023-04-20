import { CLIENT_ID, IOS_CLIENT_ID, LOGIN_API_URL } from "@env";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Animated } from "react-native";
import { useDispatch } from "react-redux";

import { userLogin } from "../../features/reducers/loginSlice";

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const [animatedValue, setAnimatedValue] = useState(new Animated.Value(0));
  const [token, setToken] = useState(null);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    prompt: "select_account",
  });

  useEffect(() => {
    if (response?.type === "success") {
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
        dispatch(userLogin(user));
        navigation.navigate("MeetingSchedule");
        await axios.post(`${LOGIN_API_URL}/api/users/login`, {
          user,
        });
      }
    } catch (error) {
      //에러 페이지 이동
      console.log(error);
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
    backgroundColor: "#FFF8EA",
  },
  headingContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 100,
  },
  logoText: {
    fontSize: 80,
    fontFamily: "GamjaFlower",
    color: "#9E7676",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 3 },
    textShadowRadius: 1,
  },
  headingExclamation: {
    fontSize: 80,
    fontFamily: "GamjaFlower",
    color: "#9E7676",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 150,
    height: 60,
    backgroundColor: "#9E7676",
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
    color: "#FFF8EA",
    fontSize: 20,
    fontFamily: "Jua",
    fontWeight: "bold",
  },
});
