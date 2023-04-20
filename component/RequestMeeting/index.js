import { LOGIN_API_URL } from "@env";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import React, { useState, useRef, useCallback } from "react";
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
import { useSelector } from "react-redux";

import RequestCalendar from "../RequestCalendar";

export default function MeetingRequest({ route }) {
  const [step, setStep] = useState(route.params ? route.params.initialStep : 1);
  const [searchUser, setSearchUser] = useState(
    route.params ? route.params.userinfo.name : "",
  );
  const [foundUsers, setFoundUsers] = useState(
    route.params ? [route.params.userinfo] : [],
  );
  const [selectedUser, setSelectedUser] = useState(
    route.params ? route.params.userinfo : {},
  );
  const [content, setContent] = useState("");
  const [address, setAddress] = useState("");
  const [userList, setUserList] = useState([]);
  const [selectUserUTCTime, setSelectUserUTCTime] = useState("");

  const { currentUser } = useSelector((state) => state);

  const stepAnimation = useRef(
    new Animated.Value(route.params ? route.params.initialStep - 1 : 0),
  ).current;

  const navigation = useNavigation();

  const handleMeetingSchedule = () => {
    navigation.navigate("MeetingSchedule", {
      showSnackbar: true,
      text: "미팅신청이 완료 되었습니다.",
    });

    setSearchUser("");
    setFoundUsers([]);
    setSelectedUser({});
    setStep(1);
    stepAnimation.setValue(route.params ? route.params.initialStep - 1 : 0);
  };

  const inputContent = (text) => {
    setContent(text);
  };

  const inputAddress = (text) => {
    setAddress(text);
  };

  const searchUserName = (text) => {
    setSearchUser(text);
    const users = userList.filter((user) => user.name === text);
    setFoundUsers(users);
  };

  const selectUser = (user) => {
    if (selectedUser === user) {
      setSelectedUser({});
    } else {
      setSelectedUser(user);
    }
  };

  const userContainerStyle = (user) => {
    return selectedUser === user
      ? [styles.userContainer, { backgroundColor: "#9E7676" }]
      : styles.userContainer;
  };

  const userTextStyle = (user) => {
    return selectedUser === user
      ? [styles.profileText, { color: "#FFF8EA" }]
      : styles.profileText;
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

  const prevStep = () => {
    if (step <= 1) return;

    if (step === 2) {
      setSearchUser("");
      setFoundUsers([]);
      setSelectedUser({});

      Animated.timing(stepAnimation, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        setStep(step - 1);
      });
    } else if (step === 3) {
      setSelectUserUTCTime("");

      Animated.timing(stepAnimation, {
        toValue: step - 2,
        duration: 800,
        useNativeDriver: true,
      }).start(setStep(step - 1));
    }
  };

  const handleChangeSchedule = async () => {
    try {
      const patchRequest = await axios.patch(
        `${LOGIN_API_URL}/api/users/${foundUsers[0].id}/changeTime`,
        {
          selectUserUTCTime,
        },
      );
      if (patchRequest.status === 200) {
        const postRequest = await axios.post(
          `${LOGIN_API_URL}/api/meetings/new`,
          {
            title: content,
            location: address,
            startTime: selectUserUTCTime,
            requester: foundUsers[0],
            requestee: currentUser,
          },
        );
        if (postRequest.status === 200) {
          handleMeetingSchedule();
        }
      }
    } catch (error) {
      // 오류 화면 렌더링
    }
  };

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        const response = await axios.get(`${LOGIN_API_URL}/api/users/`);
        const userList = response.data;
        setUserList(userList);
      }
      fetchData();
    }, []),
  );

  return (
    <ScrollView style={styles.scrollContainer}>
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
            onChangeText={searchUserName}
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
                      source={{ uri: user.picture }}
                      style={styles.profileImg}
                    />
                  </View>
                  <Text style={userTextStyle(user)}>{user.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {Object.keys(selectedUser).length !== 0 && (
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
                  outputRange: [900, 0],
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
              <RequestCalendar
                nextStep={nextStep}
                selectedUser={selectedUser}
                setSelectUserUTCTime={setSelectUserUTCTime}
                prevStep={prevStep}
              />
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
                      onChangeText={inputContent}
                      placeholder="미팅 안건을 입력 해주세요"
                    />
                  </View>
                  <Text style={styles.contentText}>미팅 주소</Text>
                  <View style={styles.meetingContentContainer}>
                    <TextInput
                      style={styles.contentInput}
                      onChangeText={inputAddress}
                      placeholder="미팅 주소를 입력 해주세요"
                    />
                  </View>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.nextButton}
                    onPress={prevStep}
                  >
                    <Text style={styles.nextButtonText}>뒤로</Text>
                  </TouchableOpacity>
                  {content && (
                    <TouchableOpacity
                      style={styles.nextButton}
                      onPress={handleChangeSchedule}
                    >
                      <Text style={styles.nextButtonText}>완료</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </Animated.View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: "#FFF8EA",
    flex: 1,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#FFF8EA",
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: "row",
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
    fontFamily: "Jua",
  },
  stepTitleText: {
    fontSize: 25,
    fontFamily: "Jua",
  },
  disabledStepTitleText: {
    fontSize: 25,
    color: "lightgray",
    fontFamily: "Jua",
  },
  disabledStepNumberText: {
    fontSize: 25,
    color: "lightgray",
    fontFamily: "Jua",
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
    fontFamily: "Jua",
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
    backgroundColor: "#9E7676",
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
    color: "#FFF8EA",
    fontFamily: "Jua",
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
    backgroundColor: "#9E7676",
  },
  contentText: {
    fontSize: 20,
    marginTop: 15,
    marginLeft: 25,
    color: "#FFF8EA",
    fontFamily: "Jua",
  },
  contentInput: {
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: 300,
    height: 50,
    backgroundColor: "#FFF8EA",
  },
  meetingContentContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
});
