import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Animated,
} from "react-native";

import RequestCalendar from "../RequestCalendar";

const mockDate = [
  {
    name: "이상혁",
    imgURL:
      "https://lh3.googleusercontent.com/a/AGNmyxa5mqAs837yjRYEkSvflqIJV3vnOFxU3yjyTpd_=s96-c",
  },
  {
    name: "이상혁",
    imgURL:
      "https://lh3.googleusercontent.com/a/AGNmyxa5mqAs837yjRYEkSvflqIJV3vnOFxU3yjyTpd_=s96-c",
  },
];

export default function MeetingRequest() {
  const [searchUser, setSearchUser] = useState("");
  const [foundUsers, setFoundUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [step, setStep] = useState(1);

  const stepAnimation = useRef(new Animated.Value(0)).current;

  const search = (text) => {
    setSearchUser(text);
    const users = mockDate.filter((user) => user.name === text);
    setFoundUsers(users);
  };

  const selectUser = (user) => {
    if (selectedUser === user) {
      setSelectedUser(null);
    } else {
      setSelectedUser(user);
    }
  };

  const userContainerStyle = (user) => {
    return selectedUser === user
      ? [styles.userContainer, { backgroundColor: "#C1FB9E" }]
      : styles.userContainer;
  };

  const nextStep = () => {
    if (step >= 3) return;

    setStep(step + 1);
    stepAnimation.setValue(0);

    Animated.timing(stepAnimation, {
      toValue: step,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.stepContainer}>
          <View
            style={step === 1 ? styles.stepNumber : styles.disabledStepNumber}
          >
            <Text
              style={
                step === 1
                  ? styles.stepNumberText
                  : styles.disabledStepNumberText
              }
            >
              1
            </Text>
          </View>
          <TextInput
            style={step === 1 ? styles.input : styles.disabledInput}
            placeholder="유저 이름 검색🔍"
            onChangeText={search}
            value={searchUser}
            editable={step === 1}
          />
        </View>
        {step === 1 && (
          <View style={styles.container}>
            <View style={styles.profileScrollView}>
              {foundUsers.map((user, index) => (
                <TouchableOpacity
                  key={index}
                  style={userContainerStyle(user)}
                  onPress={() => selectUser(user)}
                >
                  <View style={styles.profileImgContainer}>
                    <Image
                      source={{ uri: user.imgURL }}
                      style={styles.profileImg}
                    />
                  </View>
                  <Text style={styles.profileText}>{user.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {selectedUser && (
              <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
                <Text style={styles.nextButtonText}>다음</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        <Animated.View
          style={{
            ...styles.animatedView,
            transform: [
              {
                translateY: stepAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [600, 0],
                }),
              },
            ],
          }}
        >
          {step === 2 && (
            <View style={styles.container}>
              <View style={styles.stepContainer}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepTitleText}>날짜를 선택해주세요</Text>
              </View>
              <RequestCalendar nextStep={nextStep} />
            </View>
          )}
        </Animated.View>
        {step === 3 && (
          <View style={styles.container}>
            <View style={styles.stepContainer}>
              <View style={styles.disabledStepNumber}>
                <Text style={styles.disabledStepNumberText}>2</Text>
              </View>
              <Text style={styles.disabledStepTitleText}>
                날짜를 선택해주세요
              </Text>
            </View>
            <Animated.View
              style={{
                ...styles.animatedView,
                transform: [
                  {
                    translateY: stepAnimation.interpolate({
                      inputRange: [0, 1, 2, 3],
                      outputRange: [600, 0, 0, -600],
                    }),
                  },
                ],
              }}
            >
              <View style={styles.container}>
                <View style={styles.stepContainer}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <Text style={styles.stepTitleText}>내용을 입력해주세요</Text>
                </View>
                <View style={styles.contentContainer}>
                  <Text style={styles.contentText}>미팅 안건</Text>
                  <View style={styles.meetingContentContainer}>
                    <TextInput
                      style={styles.contentInput}
                      placeholder="미팅 안건을 입력 해주세요"
                    />
                  </View>
                  <Text style={styles.contentText}>미팅 주소</Text>
                  <View style={styles.meetingContentContainer}>
                    <TextInput
                      style={styles.contentInput}
                      placeholder="미팅 주소를 입력 해주세요"
                    />
                  </View>
                </View>
                <TouchableOpacity style={styles.nextButton}>
                  <Text style={styles.nextButtonText}>완료</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#fff",
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepNumber: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderWidth: 3,
    borderRadius: 25,
    marginRight: 10,
  },
  disabledStepNumber: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderWidth: 3,
    borderRadius: 25,
    borderColor: "lightgray",
    marginRight: 10,
  },
  stepNumberText: {
    fontSize: 25,
    fontWeight: "bold",
  },
  stepTitleText: {
    fontSize: 25,
    fontWeight: "bold",
  },
  disabledStepTitleText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "lightgray",
  },
  disabledStepNumberText: {
    fontSize: 25,
    color: "lightgray",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: 200,
    height: "80%",
  },
  disabledInput: {
    width: 200,
    height: "80%",
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "lightgray",
  },
  userContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    width: 100,
    height: 130,
    borderRadius: 15,
    borderWidth: 2,
  },
  profileImgContainer: {
    width: 70,
    height: 70,
    marginRight: 5,
    borderRadius: 50,
    overflow: "hidden",
  },
  profileImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  profileText: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: "bold",
  },
  profileScrollView: {
    flexDirection: "row",
    marginBottom: 10,
  },
  nextButton: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    width: 100,
    height: 50,
    borderRadius: 15,
    borderWidth: 2,
    backgroundColor: "#C1FB9E",
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
  nextButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  animatedView: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    width: 350,
    height: 230,
    marginTop: 20,
    borderRadius: 20,
    borderWidth: 2,
  },
  contentText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
    marginLeft: 25,
  },
  contentInput: {
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: 300,
    height: 50,
  },
  meetingContentContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
});
