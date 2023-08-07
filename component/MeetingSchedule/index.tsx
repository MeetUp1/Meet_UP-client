import { LOGIN_API_URL } from "@env";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { StyleSheet, Text, View, ScrollView, Platform } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { Snackbar } from "react-native-paper";
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { useSelector } from "react-redux";

import { COLOR_BEIGE, COLOR_BROWN } from "../../constants/color";
import { LoginState } from "../../store/types";
import { Meeting } from "../../types/types";
import CalendarHeader from "../CalendarHeader";
import MeetingMonthView from "../MeetingMonthView";
import ScheduleCard from "../ScheduleCard";

export default function MeetingSchedule({ route }) {
  type RootStackParamList = {
    ErrorPage: undefined;
  };
  type NavigationProp = StackNavigationProp<RootStackParamList>;

  const [visibleSnackbar, setVisibleSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [meetingList, setMeetingList] = useState<Meeting[]>([]);
  const [selectedDateMeetings, setSelectedDateMeetings] = useState<Meeting[]>(
    [],
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const month = date.getMonth();
  const year = date.getFullYear();

  const navigation = useNavigation<NavigationProp>();
  const { currentUser } = useSelector((state: LoginState) => state);

  const onPrevMonth = () => {
    const newDate = new Date(year, month - 1, 1);
    const today = new Date();

    runOnJS(setDate)(newDate);

    if (
      today.getMonth() === newDate.getMonth() &&
      today.getFullYear() === newDate.getFullYear()
    ) {
      runOnJS(setSelectedDate)(today);
      runOnJS(onDaySelected)(today);
    } else {
      runOnJS(setSelectedDate)(newDate);
      runOnJS(onDaySelected)(newDate);
    }
  };

  const onNextMonth = () => {
    const newDate = new Date(year, month + 1, 1);
    const today = new Date();

    runOnJS(setDate)(newDate);

    if (
      today.getMonth() === newDate.getMonth() &&
      today.getFullYear() === newDate.getFullYear()
    ) {
      runOnJS(setSelectedDate)(today);
      runOnJS(onDaySelected)(today);
    } else {
      runOnJS(setSelectedDate)(newDate);
      runOnJS(onDaySelected)(newDate);
    }
  };

  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const onGestureEvent = useAnimatedGestureHandler({
    onActive: (event, ctx) => {
      translateX.value = event.translationX;
      opacity.value = 1 - Math.abs(event.translationX / 200);
    },
    onEnd: (event, ctx) => {
      if (event.translationX > 50) {
        runOnJS(onPrevMonth)();
      } else if (event.translationX < -50) {
        runOnJS(onNextMonth)();
      }
      translateX.value = withSpring(0);
      opacity.value = withSpring(1);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
    };
  });

  const navigateToLoginPage = () => {
    navigation.navigate("ErrorPage");
  };

  const onDismissSnackBar = () => {
    setVisibleSnackbar(false);
  };

  const getMeetingsByDate = (
    meetingList: Meeting[],
    month: number,
    year: number,
  ) => {
    const meetingsByDate = {};

    meetingList.forEach((meeting) => {
      const meetingDate = new Date(meeting.startTime);
      if (
        meetingDate.getMonth() === month &&
        meetingDate.getFullYear() === year
      ) {
        const dateKey = meetingDate.getDate();
        if (!meetingsByDate[dateKey]) {
          meetingsByDate[dateKey] = [];
        }
        meetingsByDate[dateKey].push(meeting);
      }
    });

    return meetingsByDate;
  };

  const onDaySelected = (selectedDate: Date) => {
    const selectedDateMeetings = meetingsByDate[selectedDate.getDate()] || [];
    setSelectedDateMeetings(selectedDateMeetings);
  };

  const meetingsByDate = useMemo(
    () => getMeetingsByDate(meetingList, month, year),
    [meetingList, month, year],
  );

  useEffect(() => {
    if (route.params && route.params.showSnackbar) {
      setVisibleSnackbar(true);
      setSnackbarMessage(route.params.text);
    }
  }, [route]);

  useEffect(() => {
    onDaySelected(selectedDate);
  }, [meetingList, selectedDate]);

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        if (!currentUser) {
          navigateToLoginPage();
          return;
        }
        const response = await axios.get(
          `${LOGIN_API_URL}/api/users/${currentUser.id}/meetings/accepted`,
        );
        const meetings = response.data;
        setMeetingList(meetings);
        onDaySelected(selectedDate);
      }
      fetchData();
    }, [selectedDate]),
  );

  return (
    <>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <CalendarHeader
            month={month}
            year={year}
            onPrev={onPrevMonth}
            onNext={onNextMonth}
          />
          <PanGestureHandler onGestureEvent={onGestureEvent}>
            <Animated.View style={animatedStyle}>
              <View style={styles.monthWrapper}>
                <MeetingMonthView
                  month={month}
                  year={year}
                  meetingsByDate={meetingsByDate}
                  onDaySelected={onDaySelected}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />
              </View>
            </Animated.View>
          </PanGestureHandler>
        </View>
        <View style={styles.scheduleCardContainer}>
          {currentUser ? (
            <>
              {selectedDateMeetings.map((meeting) => (
                <ScheduleCard
                  key={meeting._id}
                  name={
                    currentUser.name === meeting.requester.name
                      ? meeting.requestee.name
                      : `${meeting.requester.name}🤝`
                  }
                  time={
                    Platform.OS === "android"
                      ? new Date(meeting.startTime)
                          .toLocaleString()
                          .slice(0, 16)
                      : new Date(meeting.startTime).toLocaleString()[20] === "0"
                      ? new Date(meeting.startTime)
                          .toLocaleString()
                          .slice(0, 21)
                      : new Date(meeting.startTime)
                          .toLocaleString()
                          .slice(0, 20)
                  }
                  agenda={meeting.title}
                  address={meeting.location}
                  picture={
                    currentUser.name === meeting.requester.name
                      ? meeting.requestee.picture
                      : meeting.requester.picture
                  }
                  onCopy={() => {
                    setSnackbarMessage("미팅 주소가 복사되었습니다.");
                    setVisibleSnackbar(true);
                  }}
                />
              ))}
              {selectedDateMeetings.length === 0 && (
                <Text style={styles.noScheduleText}>일정이 없습니다</Text>
              )}
            </>
          ) : (
            <Text style={styles.noScheduleText}>
              Current user is not available
            </Text>
          )}
        </View>
      </ScrollView>
      <Snackbar
        style={styles.snackbar}
        visible={visibleSnackbar}
        onDismiss={onDismissSnackBar}
        duration={1500}
      >
        {snackbarMessage}
      </Snackbar>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: COLOR_BEIGE,
    flex: 1,
  },
  container: {
    backgroundColor: COLOR_BEIGE,
    alignItems: "center",
    marginBottom: 10,
  },
  monthWrapper: {
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 20,
    padding: 10,
    width: "90%",
    backgroundColor: COLOR_BROWN,
  },
  snackbar: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
  },
  scheduleCardContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  scheduleCard: {
    backgroundColor: COLOR_BROWN,
  },
  noScheduleText: {
    textAlign: "center",
    fontSize: 22,
    color: "gray",
    marginTop: 20,
    fontFamily: "Jua",
  },
});
