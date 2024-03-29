import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";

import {
  COLOR_BEIGE,
  COLOR_BROWN,
  COLOR_LIGHTGRAY,
} from "../../constants/color";
import { LoginState } from "../../store/types";

export default function Header() {
  type RootStackParamList = {
    CreateMeeting: undefined;
    MeetingInfo: undefined;
    MeetingSchedule: undefined;
    MeetingRequest: undefined;
  };
  type NavigationProp = StackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<NavigationProp>();
  const { currentUser } = useSelector((state: LoginState) => state);

  const handleCreateMeeting = () => {
    navigation.navigate("CreateMeeting");
  };
  const handleMeetingInfo = () => {
    navigation.navigate("MeetingInfo");
  };
  const handleMeetingSchedule = () => {
    navigation.navigate("MeetingSchedule");
  };
  const handleMeetingRequest = () => {
    navigation.navigate("MeetingRequest");
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meet-UP!</Text>
        <View style={[styles.profile, { justifyContent: "flex-end" }]}>
          <View style={styles.profileImgContainer}>
            {currentUser && (
              <Image
                testID="profileImg"
                source={{
                  uri: currentUser.picture,
                }}
                style={styles.profileImg}
              />
            )}
          </View>
          {currentUser && (
            <Text style={styles.profileText}>
              {currentUser.name}님 안녕하세요
            </Text>
          )}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleMeetingSchedule}>
          <Text style={styles.buttonText}>미팅일정</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleMeetingInfo}>
          <Text style={styles.buttonText}>미팅확인</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleMeetingRequest}>
          <Text style={styles.buttonText}>미팅신청</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleCreateMeeting}>
          <Text style={styles.buttonText}>미팅생성</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const { width: screenWidth } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    backgroundColor: COLOR_BEIGE,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_LIGHTGRAY,
  },
  headerTitle: {
    width: "50%",
    color: COLOR_BROWN,
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 1,
    fontFamily: "GamjaFlower",
    fontSize: screenWidth * 0.1,
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
    fontFamily: "Jua",
    fontSize: screenWidth * 0.04,
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
    backgroundColor: COLOR_BROWN,
    padding: 10,
    width: "22%",
    marginRight: 5,
    borderRadius: 25,
    alignItems: "center",
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
    fontSize: 14,
    fontFamily: "Jua",
  },
});
