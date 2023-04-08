import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Animated } from "react-native";

export default function Login() {
  const [animatedValue, setAnimatedValue] = useState(new Animated.Value(0));

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
      <TouchableOpacity style={styles.button}>
        <Animated.Text style={[styles.buttonText]}>Log in</Animated.Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
