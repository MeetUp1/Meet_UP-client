import { LOGIN_API_URL } from "@env";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
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

import ScheduleCard from "../ScheduleCard";

const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayInMonth = (month, year) => {
  return new Date(year, month, 1).getDay();
};

const CalendarHeader = ({ month, year, onPrev, onNext }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onPrev}>
      <Text style={styles.headerButton}>Prev</Text>
    </TouchableOpacity>
    <Text style={styles.headerText}>{`${year}.${month + 1}`}</Text>
    <TouchableOpacity onPress={onNext}>
      <Text style={styles.headerButton}>Next</Text>
    </TouchableOpacity>
  </View>
);

const MonthView = ({
  month,
  year,
  meetingsByDate,
  onDaySelected,
  selectedDate,
  setSelectedDate,
}) => {
  const daysInMonth = getDaysInMonth(month, year);
  const firstDayInMonth = getFirstDayInMonth(month, year);

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const onDayPress = (day) => {
    setSelectedDate(day);
    onDaySelected(day);
  };

  return (
    <View style={styles.month}>
      <View style={styles.weekDaysContainer}>
        {weekDays.map((day, index) => (
          <View key={`weekday-${index}`} style={styles.weekDay}>
            <Text style={styles.weekDayText}>{day}</Text>
          </View>
        ))}
      </View>
      <View style={styles.daysContainer}>
        {Array(firstDayInMonth)
          .fill(null)
          .map((_, index) => (
            <View key={`empty-${index}`} style={styles.day} />
          ))}
        {Array(daysInMonth)
          .fill(null)
          .map((_, index) => {
            const day = new Date(year, month, index + 1);
            const dayMeetings = meetingsByDate[index + 1] || [];
            const isToday = day.getTime() === today.getTime();
            const isSelected =
              selectedDate &&
              day.getFullYear() === selectedDate.getFullYear() &&
              day.getMonth() === selectedDate.getMonth() &&
              day.getDate() === selectedDate.getDate();

            const dayStyle = [
              styles.day,
              isToday && styles.today,
              isSelected && styles.selectedDay,
            ];
            const dayTextStyle = isToday ? styles.todayText : styles.dayText;

            return (
              <TouchableOpacity
                key={`day-${index}`}
                style={dayStyle}
                onPress={() => onDayPress(day)}
              >
                <Text style={dayTextStyle}>{index + 1}</Text>
                {dayMeetings.length > 0 && (
                  <Text style={styles.meetingCount}>{dayMeetings.length}</Text>
                )}
              </TouchableOpacity>
            );
          })}
      </View>
    </View>
  );
};

export default function MeetingSchedule({ route }) {
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
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
                <MonthView
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
          {selectedDateMeetings.map((meeting, index) => (
            <ScheduleCard
              key={index}
              name={
                currentUser.name === meeting.requester.name
                  ? meeting.requestee.name
                  : `${meeting.requester.name}🤝`
              }
              time={
                new Date(meeting.startTime).toLocaleString()[20] === "0"
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
        duration={Snackbar.DURATION_SHORT}
      >
        {route.params?.text || "미팅 일정을 한번 더 클릭하셨습니다"}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    marginTop: 20,
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Jua",
  },
  headerButton: {
    marginTop: 20,
    marginRight: 15,
    marginLeft: 15,
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Jua",
  },
  month: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 10,
  },
  weekDaysContainer: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  weekDay: {
    width: "14%",
  },
  weekDayText: {
    fontSize: 17,
    textAlign: "center",
    color: "#FFF8EA",
    fontFamily: "Jua",
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
  },
  day: {
    width: "14%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dayText: {
    fontSize: 15,
    textAlign: "center",
    color: "#FFF8EA",
    fontFamily: "Jua",
  },
  today: {
    backgroundColor: "#594545",
    borderRadius: 50,
  },
  todayText: {
    color: "#FFF8EA",
    fontFamily: "Jua",
  },
  selectedDay: {
    borderColor: "#594545",
    borderWidth: 2,
    borderRadius: 50,
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
  meetingCount: {
    position: "absolute",
    bottom: 1,
    right: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 30,
    paddingHorizontal: 4,
    paddingVertical: 2,
    color: "white",
    fontSize: 10,
    fontFamily: "Jua",
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
