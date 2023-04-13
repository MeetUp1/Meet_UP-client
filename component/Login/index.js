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
    clientId:
      "760691643877-o33uruvobddb5dqheoci9cfdarig3sut.apps.googleusercontent.com",
    iosClientId:
      "760691643877-rdt1f3ccve1f8qgfjcam41h0qdmj868t.apps.googleusercontent.com",
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
        navigation.navigate("CreateMeeting");
        await axios.post("http:localhost:8000/api/users/login", {
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
        <Animated.Text
          style={{
            fontSize: 60,
            fontWeight: "bold",
            color: "#FF9900",
            textShadowColor: "rgba(0, 0, 0, 0.75)",
            textShadowOffset: { width: 1, height: 3 },
            textShadowRadius: 1,
          }}
        >
          Meet-Up
        </Animated.Text>
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
    backgroundColor: "#fff",
  },
  headingContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 100,
  },
  headingExclamation: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#FF9900",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 150,
    height: 60,
    backgroundColor: "#FF9900",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
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
    fontSize: 20,
    fontWeight: "bold",
  },
});
