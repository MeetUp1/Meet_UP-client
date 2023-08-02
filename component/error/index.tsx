import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { COLOR_BROWN, COLOR_BEIGE } from "../../constants/color";

type RootStackParamList = {
  ErrorPage: undefined;
  Login: undefined;
};

const ErrorPage = () => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, "ErrorPage">>();

  const navigateToLoginPage = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>⚠️에러가 발생했습니다</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={navigateToLoginPage}
      >
        <Text style={styles.retryText}>로그인 페이지로 이동</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLOR_BEIGE,
  },
  errorText: {
    fontSize: 30,
    marginBottom: 20,
    fontFamily: "Jua",
  },
  retryButton: {
    backgroundColor: COLOR_BROWN,
    marginTop: 30,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryText: {
    color: COLOR_BEIGE,
    fontSize: 18,
    fontFamily: "Jua",
  },
});

export default ErrorPage;
