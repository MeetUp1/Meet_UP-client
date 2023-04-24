import { LOGIN_API_URL } from "@env";
import { useFocusEffect } from "@react-navigation/native";
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

import CalendarHeader from "../CalendarHeader";
import MeetingMonthView from "../MeetingMonthView";
import ScheduleCard from "../ScheduleCard";

export default function MeetingSchedule({ route }) {
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [date, setDate] = useState(new Date());
  const [meetingList, setMeetingList] = useState([]);
  const [selectedDateMeetings, setSelectedDateMeetings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const month = date.getMonth();
  const year = date.getFullYear();

  const { currentUser } = useSelector((state) => state);

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

  const onDismissSnackBar = () => {
    setVisibleSnackbar(false);
  };

  const getMeetingsByDate = (meetingList, month, year) => {
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

  const onDaySelected = (selectedDate) => {
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
                  ? new Date(meeting.startTime).toLocaleString().slice(0, 16)
                  : new Date(meeting.startTime).toLocaleString()[20] === "0"
                  ? new Date(meeting.startTime).toLocaleString().slice(0, 21)
                  : new Date(meeting.startTime).toLocaleString().slice(0, 20)
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
    backgroundColor: "#FFF8EA",
    flex: 1,
  },
  container: {
    backgroundColor: "#FFF8EA",
    alignItems: "center",
    marginBottom: 10,
  },
  monthWrapper: {
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 20,
    padding: 10,
    width: "90%",
    backgroundColor: "#9E7676",
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
    backgroundColor: "#9E7676",
  },
  noScheduleText: {
    textAlign: "center",
    fontSize: 22,
    color: "gray",
    marginTop: 20,
    fontFamily: "Jua",
  },
});
