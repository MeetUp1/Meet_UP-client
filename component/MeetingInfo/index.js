import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from "react-native";

const mockData = [
  {
    requester: {
      name: "호랑이",
      imgURL:
        "https://lh3.googleusercontent.com/a/AGNmyxa5mqAs837yjRYEkSvflqIJV3vnOFxU3yjyTpd_=s96-c",
    },
    requestee: {
      name: "이상혁",
      imgURL:
        "https://lh3.googleusercontent.com/a/AGNmyxa5mqAs837yjRYEkSvflqIJV3vnOFxU3yjyTpd_=s96-c",
    },
    status: "pending",
    location: "zoom",
    Date: "2023.12.15",
    startTime: "14",
    title: "호랑이랑 사자랑 싸우면 누가이겨?",
    message: "",
  },
  {
    requester: {
      name: "원숭이",
      imgURL:
        "https://lh3.googleusercontent.com/a/AGNmyxa5mqAs837yjRYEkSvflqIJV3vnOFxU3yjyTpd_=s96-c",
    },
    requestee: {
      name: "이상혁",
      imgURL:
        "https://lh3.googleusercontent.com/a/AGNmyxa5mqAs837yjRYEkSvflqIJV3vnOFxU3yjyTpd_=s96-c",
    },
    status: "pending",
    location: "zoom",
    Date: "2023.12.15",
    startTime: "09",
    title: "엉덩이 빨간생 이니?",
    message: "",
  },
  {
    requester: {
      name: "이상혁",
      imgURL:
        "https://lh3.googleusercontent.com/a/AGNmyxa5mqAs837yjRYEkSvflqIJV3vnOFxU3yjyTpd_=s96-c",
    },
    requestee: {
      name: "???",
      imgURL:
        "https://lh3.googleusercontent.com/a/AGNmyxa5mqAs837yjRYEkSvflqIJV3vnOFxU3yjyTpd_=s96-c",
    },
    status: "pending",
    location: "zoom",
    Date: "2023.12.15",
    startTime: "09",
    title: "누굴까요?",
    message: "",
  },
  {
    requester: {
      name: "이상혁",
      imgURL:
        "https://lh3.googleusercontent.com/a/AGNmyxa5mqAs837yjRYEkSvflqIJV3vnOFxU3yjyTpd_=s96-c",
    },
    requestee: {
      name: "땅콩이",
      imgURL:
        "https://lh3.googleusercontent.com/a/AGNmyxa5mqAs837yjRYEkSvflqIJV3vnOFxU3yjyTpd_=s96-c",
    },
    status: "pending",
    location: "zoom",
    Date: "2023.12.15",
    startTime: "09",
    title: "미팅신청 합니다.",
    message: "",
  },
  {
    requester: {
      name: "얼룩말",
      imgURL:
        "https://lh3.googleusercontent.com/a/AGNmyxa5mqAs837yjRYEkSvflqIJV3vnOFxU3yjyTpd_=s96-c",
    },
    requestee: {
      name: "이상혁",
      imgURL:
        "https://lh3.googleusercontent.com/a/AGNmyxa5mqAs837yjRYEkSvflqIJV3vnOFxU3yjyTpd_=s96-c",
    },
    status: "rejected",
    location: "zoom",
    Date: "2023.12.15",
    startTime: "11",
    title: "말이 더빠름",
    message: "내가 더빠른데..",
  },
  {
    requester: {
      name: "돼지",
      imgURL:
        "https://lh3.googleusercontent.com/a/AGNmyxa5mqAs837yjRYEkSvflqIJV3vnOFxU3yjyTpd_=s96-c",
    },
    requestee: {
      name: "이상혁",
      imgURL:
        "https://lh3.googleusercontent.com/a/AGNmyxa5mqAs837yjRYEkSvflqIJV3vnOFxU3yjyTpd_=s96-c",
    },
    status: "rejected",
    location: "zoom",
    Date: "2023.12.15",
    startTime: "11",
    title: "맛나겠다",
    message: "소가 더맛날듯..",
  },
];

export default function MeetingInfo() {
  const [activeButton, setActiveButton] = useState(0);
  const [expandedCards, setExpandedCards] = useState([]);

  const handlePress = (index) => {
    setActiveButton(index);
    setExpandedCards(mockData.map(() => false));
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

  const filterMeetings = (status, isRequester) => {
    const filteredMeeting = mockData.filter(
      (meeting) =>
        meeting.status === status &&
        (isRequester
          ? meeting.requester.name === "이상혁"
          : meeting.requestee.name === "이상혁" &&
            meeting.requester.name !== "이상혁"),
    );

    if (filteredMeeting.length === 0) {
      return <Text style={styles.cardText}>미팅카드가 없습니다.</Text>;
    }

    return filteredMeeting.map((meeting, index) => (
      <View
        key={meeting.title}
        style={[
          styles.meetingCard,
          expandedCards.includes(index) && {
            height: activeButton === 2 || activeButton === 3 ? 370 : 230,
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
                  ? meeting.requestee.imgURL
                  : meeting.requester.imgURL,
              }}
              style={styles.profileImg}
            />
          </View>
          <Text style={styles.cardName}>
            {isRequester ? meeting.requestee.name : meeting.requester.name}
          </Text>
          <Text style={styles.cardText}>{meeting.Date}</Text>
          <Text style={styles.cardText}>{`${meeting.startTime}시`}</Text>
        </View>
        {expandedCards.includes(index) && (
          <View style={{ flexDirection: "column" }}>
            <View style={styles.meetingContentContainer}>
              <Text style={styles.cardText}>미팅주제</Text>
              <Text style={styles.cardText}>{meeting.title}</Text>
            </View>
            <View style={styles.meetingContentContainer}>
              <Text style={styles.cardText}>미팅주소</Text>
              <Text style={styles.cardText}>{meeting.location}</Text>
            </View>
            {activeButton === 2 && (
              <>
                <View style={styles.meetingContentContainer}>
                  <Text style={styles.cardText}>거절사유</Text>
                  <TextInput
                    style={styles.contentInput}
                    placeholder="거절사유를 입력해주세요"
                  />
                </View>
                <View style={styles.meetingButtonContainer}>
                  <TouchableOpacity>
                    <View style={styles.meetingButton}>
                      <Text style={styles.cardText}>수정</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <View style={styles.meetingButton}>
                      <Text style={styles.cardText}>삭제</Text>
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
                  <TouchableOpacity>
                    <View style={styles.meetingButton}>
                      <Text style={styles.cardText}>수락</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <View style={styles.meetingButton}>
                      <Text style={styles.cardText}>거절</Text>
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
        activeButton === index && { backgroundColor: "#FF5AD9" },
      ]}
      onPress={() => handlePress(index)}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView>
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
  container: {
    backgroundColor: "#fff",
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
    backgroundColor: "#FFC8FF",
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
    fontSize: 14,
    fontWeight: "bold",
  },
  meetingListContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  meetingCard: {
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "#FFD6F5",
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
    fontWeight: "bold",
    marginLeft: 5,
    marginRight: 5,
  },
  cardText: {
    marginLeft: 5,
    fontSize: 17,
    fontWeight: "bold",
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
    backgroundColor: "#FFD6F5",
    marginTop: 5,
    width: 250,
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
    backgroundColor: "#FF64E3",
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
    width: 240,
    height: 30,
  },
});
