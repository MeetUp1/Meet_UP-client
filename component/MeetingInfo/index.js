import { LOGIN_API_URL } from "@env";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { useSelector } from "react-redux";

import sendNotification from "../../features/expoPush";

export default function MeetingInfo() {
  const [activeButton, setActiveButton] = useState(0);
  const [expandedCards, setExpandedCards] = useState([]);
  const [meetingList, setMeetingList] = useState([]);
  const [inputRejected, setInputRejected] = useState("");

  const navigation = useNavigation();
  const { currentUser } = useSelector((state) => state);

  const navigateToLoginPage = () => {
    navigation.navigate("ErrorPage");
  };

  const fetchData = useCallback(async () => {
    const response = await axios.get(
      `${LOGIN_API_URL}/api/users/${currentUser.id}/meetings`,
    );
    const meetings = response.data;
    return meetings;
  }, [currentUser.id]);

  const handleButtonClick = async () => {
    const updatedData = await fetchData();
    setMeetingList(updatedData);
  };

  const handleMeetingRequest = async (userId) => {
    try {
      const response = await axios.get(`${LOGIN_API_URL}/api/users/${userId}`);
      navigation.navigate("MeetingRequest", {
        initialStep: 2,
        userinfo: response.data,
      });
    } catch (error) {
      navigateToLoginPage();
    }
  };

  const handlePress = async (index) => {
    setActiveButton(index);
    setExpandedCards(meetingList.map(() => false));
  };

  const toggleCardExpansion = (index) => {
    if (expandedCards.includes(index)) {
      setExpandedCards(
        expandedCards.filter((cardIndex) => cardIndex !== index),
      );
    } else {
      setExpandedCards([...expandedCards, index]);
    }
  };

  const handleAccept = async (id, expoPushToken, requesterName) => {
    const patchResponse = await axios.patch(
      `${LOGIN_API_URL}/api/meetings/${id}/accept`,
    );

    if (patchResponse.status === 200) {
      await sendNotification(
        expoPushToken,
        "미팅이 수락되었습니다",
        `${requesterName}님이 미팅을 수락했습니다`,
      );
      handleButtonClick();
    }
  };

  const handleCancel = async (userId, meetingId, time) => {
    try {
      const patchResponse = await axios.patch(
        `${LOGIN_API_URL}/api/users/${userId}/cancel`,
        {
          time,
        },
      );

      if (patchResponse.status === 200) {
        await axios.delete(`${LOGIN_API_URL}/api/meetings/${meetingId}`);
        handleButtonClick();
      }
    } catch (error) {
      navigateToLoginPage();
    }
  };

  const handleRejected = async (
    userId,
    meetingId,
    time,
    expoPushToken,
    requesterName,
  ) => {
    if (inputRejected.length === 0) {
      Alert.alert("Error", "거절 사유를 입력해주세요.");
      return;
    }
    try {
      const patchResponse = await axios.patch(
        `${LOGIN_API_URL}/api/users/${userId}/cancel`,
        {
          time,
        },
      );

      if (patchResponse.status === 200) {
        const patchResponse = await axios.patch(
          `${LOGIN_API_URL}/api/meetings/${meetingId}/rejected`,
          {
            message: inputRejected,
          },
        );

        if (patchResponse.status === 200) {
          await sendNotification(
            expoPushToken,
            "미팅이 거절되었습니다",
            `${requesterName}님이 미팅을 거절했습니다`,
          );
          handleButtonClick();
        }
      }
    } catch (error) {
      navigateToLoginPage();
    }
  };

  const completeMeeting = async (id, meetingId, time) => {
    try {
      const patchResponse = await axios.patch(
        `${LOGIN_API_URL}/api/users/${id}/changeReservationTime`,
        {
          time,
        },
      );

      if (patchResponse.status === 200) {
        await axios.delete(`${LOGIN_API_URL}/api/meetings/${meetingId}`);
        handleButtonClick();
      }
    } catch (error) {
      navigateToLoginPage();
    }
  };

  const handleDelete = async (meetingId) => {
    try {
      await axios.delete(`${LOGIN_API_URL}/api/meetings/${meetingId}`);
      handleButtonClick();
    } catch (error) {
      navigateToLoginPage();
    }
  };

  const isMinutesPast = (meetingStartTime, minutes) => {
    const now = new Date();
    const meetingTime = new Date(meetingStartTime);
    const nowLocal = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    const meetingTimeLocal = new Date(
      meetingTime.getTime() - meetingTime.getTimezoneOffset() * 60000,
    );
    const minuteDifference = (nowLocal - meetingTimeLocal) / 60000;
    return minuteDifference >= minutes;
  };

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        const response = await axios.get(
          `${LOGIN_API_URL}/api/users/${currentUser.id}/meetings`,
        );
        const meetings = response.data;
        setMeetingList(meetings);
      }
      fetchData();
    }, []),
  );

  const filterMeetings = (status, isRequester) => {
    const filteredMeeting = meetingList.filter(
      (meeting) =>
        meeting.status === status &&
        (isRequester
          ? meeting.requester.name === currentUser.name
          : meeting.requestee.name === currentUser.name &&
            meeting.requester.name !== currentUser.name),
    );

    if (filteredMeeting.length === 0) {
      return <Text style={styles.notFoundCardText}>미팅카드가 없습니다.</Text>;
    }

    return filteredMeeting.map((meeting, index) => (
      <View
        key={meeting._id}
        style={[
          styles.meetingCard,
          expandedCards.includes(index) && {
            height:
              activeButton === 0
                ? 290
                : activeButton === 1
                ? "auto"
                : activeButton === 2 || activeButton === 3
                ? 370
                : 230,
          },
        ]}
        onStartShouldSetResponder={() => true}
        onResponderRelease={() => toggleCardExpansion(index)}
      >
        <View style={styles.meetingCardTitle}>
          <View style={styles.profileImgContainer}>
            <Image
              source={{
                uri: isRequester
                  ? meeting.requestee.picture
                  : meeting.requester.picture,
              }}
              style={styles.profileImg}
            />
          </View>
          <Text style={styles.cardName}>
            {isRequester ? meeting.requestee.name : meeting.requester.name}
          </Text>
          <Text style={styles.cardText}>
            {Platform.OS === "android"
              ? new Date(meeting.startTime).toLocaleString().slice(0, 16)
              : new Date(meeting.startTime).toLocaleString()[20] === "0"
              ? new Date(meeting.startTime).toLocaleString().slice(0, 21)
              : new Date(meeting.startTime).toLocaleString().slice(0, 20)}
          </Text>
        </View>
        {expandedCards.includes(index) && (
          <View style={{ flexDirection: "column" }}>
            <View style={styles.meetingContentContainer}>
              <Text style={styles.cardText}>미팅주제</Text>
              <Text style={styles.inputText}>{meeting.title}</Text>
            </View>
            <View style={styles.meetingContentContainer}>
              <Text style={styles.cardText}>미팅주소</Text>
              <Text style={styles.inputText}>{meeting.location}</Text>
            </View>
            {activeButton === 0 && (
              <>
                <View style={styles.meetingButtonContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      handleCancel(
                        meeting.requester.id,
                        meeting._id,
                        meeting.startTime,
                      )
                    }
                  >
                    <View style={styles.meetingButton}>
                      <Text style={styles.cardText}>취소</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            )}
            {activeButton === 1 && (
              <>
                {isMinutesPast(meeting.startTime, 30) && (
                  <View style={styles.meetingButtonContainer}>
                    <TouchableOpacity
                      onPress={() =>
                        completeMeeting(
                          meeting.requester.id,
                          meeting._id,
                          meeting.startTime,
                        )
                      }
                    >
                      <View style={styles.meetingButton}>
                        <Text style={styles.cardText}>미팅완료</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
            {activeButton === 2 && (
              <>
                <View style={styles.meetingContentContainer}>
                  <Text style={styles.cardText}>거절사유</Text>
                  <TextInput
                    style={styles.contentInput}
                    onChangeText={setInputRejected}
                    placeholder="거절사유를 입력해주세요"
                    maxLength={16}
                  />
                </View>
                <View style={styles.meetingButtonContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      handleAccept(
                        meeting._id,
                        meeting.requestee.expoPushToken,
                        meeting.requester.name,
                      )
                    }
                  >
                    <View style={styles.meetingButton}>
                      <Text style={styles.cardText}>수락</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      handleRejected(
                        meeting.requester.id,
                        meeting._id,
                        meeting.startTime,
                        meeting.requestee.expoPushToken,
                        meeting.requester.name,
                      )
                    }
                  >
                    <View style={styles.meetingButton}>
                      <Text style={styles.cardText}>거절</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            )}
            {activeButton === 3 && (
              <>
                <View style={styles.meetingContentContainer}>
                  <Text style={styles.cardText}>거절사유</Text>
                  <Text style={styles.cardText}>{meeting.message}</Text>
                </View>
                <View style={styles.meetingButtonContainer}>
                  <TouchableOpacity
                    onPress={() => handleMeetingRequest(meeting.requester.id)}
                  >
                    <View style={styles.meetingButton}>
                      <Text style={styles.cardText}>수정</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(meeting._id)}>
                    <View style={styles.meetingButton}>
                      <Text style={styles.cardText}>삭제</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}
      </View>
    ));
  };
  const renderButton = (text, index) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.button,
        activeButton === index && { backgroundColor: "#594545" },
      ]}
      onPress={() => handlePress(index)}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.divider} />
        <View style={styles.buttonContainer}>
          {["요청대기", "신청완료", "신청대기", "거절확인"].map(renderButton)}
        </View>
        <View style={styles.meetingListContainer}>
          {activeButton === 0 && filterMeetings("pending", false)}
          {activeButton === 1 && filterMeetings("accepted", false)}
          {activeButton === 2 && filterMeetings("pending", true)}
          {activeButton === 3 && filterMeetings("rejected", false)}
        </View>
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
    backgroundColor: "#FFF8EA",
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    width: "100%",
    height: 2,
    backgroundColor: "#000",
    marginVertical: 10,
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: "center",
    flexDirection: "row",
  },
  button: {
    backgroundColor: "#9E7676",
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
    fontSize: 14,
    color: "#FFF8EA",
    fontFamily: "Jua",
  },
  meetingListContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  meetingCard: {
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "#9E7676",
    width: 300,
    padding: 10,
    borderWidth: 2,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
  cardName: {
    fontSize: 20,
    marginLeft: 5,
    color: "#FFF8EA",
    fontFamily: "Jua",
  },
  cardText: {
    marginLeft: 5,
    fontSize: 17,
    color: "#FFF8EA",
    fontFamily: "Jua",
  },
  notFoundCardText: {
    marginLeft: 5,
    marginTop: 20,
    fontSize: 22,
    color: "gray",
    fontFamily: "Jua",
  },
  profileImgContainer: {
    width: 50,
    height: 50,
    marginRight: 5,
    borderRadius: 50,
    overflow: "hidden",
  },
  profileImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  meetingCardTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  meetingContentContainer: {
    justifyContent: "center",
    backgroundColor: "#9E7676",
    borderColor: "#594545",
    marginTop: 5,
    width: 280,
    height: 70,
    padding: 3,
    borderWidth: 2,
    borderRadius: 10,
  },
  meetingButtonContainer: {
    marginTop: 3,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  meetingButton: {
    backgroundColor: "#815B5B",
    padding: 10,
    width: 100,
    height: 40,
    marginTop: 10,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 15,
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
  contentInput: {
    borderWidth: 2,
    borderRadius: 10,
    marginTop: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: "100%",
    height: 30,
    backgroundColor: "#FFF8EA",
  },
  inputText: {
    marginLeft: 5,
    marginTop: 10,
    fontSize: 17,
    color: "#FFF8EA",
    fontFamily: "Jua",
  },
});
