import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";

export default function Header() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meet-Up!</Text>
        <View style={[styles.profile, { justifyContent: "flex-end" }]}>
          <View style={styles.profileImgContainer}>
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/a/AGNmyxa5mqAs837yjRYEkSvflqIJV3vnOFxU3yjyTpd_=s96-c",
              }}
              style={styles.profileImg}
            />
          </View>
          <Text style={styles.profileText}>상혁님 안녕하세요</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>미팅일정</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>미팅확인</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>미팅신청</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>미팅생성</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    marginBottom: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#CCC",
  },
  headerTitle: {
    width: "50%",
    fontWeight: "bold",
    color: "#FF9900",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 1,
    fontSize: 30,
  },
  profileImgContainer: {
    width: 35,
    height: 35,
    marginRight: 5,
    borderRadius: 50,
    overflow: "hidden",
  },
  profile: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
  },
  profileText: {
    fontWeight: "bold",
    fontSize: 13,
  },
  profileImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: "center",
    flexDirection: "row",
  },
  button: {
    backgroundColor: "#FF9900",
    padding: 10,
    width: "22%",
    marginRight: 5,
    borderRadius: 25,
    alignItems: "center",
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
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});
