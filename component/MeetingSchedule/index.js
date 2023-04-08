import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

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

const MonthView = ({ month, year }) => {
  const daysInMonth = getDaysInMonth(month, year);
  const firstDayInMonth = getFirstDayInMonth(month, year);

  const [selectedDate, setSelectedDate] = useState(null);

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const onDayPress = (day) => {
    setSelectedDate(day);
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
            const isToday = day.getTime() === today.getTime();
            const isSelected =
              selectedDate && day.getTime() === selectedDate.getTime();

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
              </TouchableOpacity>
            );
          })}
      </View>
    </View>
  );
};

export default function MeetingSchedule() {
  const [date, setDate] = useState(new Date());
  const month = date.getMonth();
  const year = date.getFullYear();

  const onPrevMonth = () => {
    runOnJS(setDate)(new Date(year, month - 1, 1));
  };

  const onNextMonth = () => {
    runOnJS(setDate)(new Date(year, month + 1, 1));
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

  return (
    <ScrollView>
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
              <MonthView month={month} year={year} />
            </View>
          </Animated.View>
        </PanGestureHandler>
        <ScheduleCard
          name="이상혁"
          time="10:00 AM"
          agenda="어쩌구저쩌구~~"
          address="어쩌구저쩌구~~"
        />
        <ScheduleCard
          name="이상혁"
          time="10:00 AM"
          agenda="어쩌구저쩌구~~"
          address="어쩌구저쩌구~~"
        />
        <ScheduleCard
          name="이상혁"
          time="10:00 AM"
          agenda="어쩌구저쩌구~~"
          address="어쩌구저쩌구~~"
        />
        <ScheduleCard
          name="이상혁"
          time="10:00 AM"
          agenda="어쩌구저쩌구~~"
          address="어쩌구저쩌구~~"
        />
        <ScheduleCard
          name="이상혁"
          time="10:00 AM"
          agenda="어쩌구저쩌구~~"
          address="어쩌구저쩌구~~"
        />
        <ScheduleCard
          name="이상혁"
          time="10:00 AM"
          agenda="어쩌구저쩌구~~"
          address="어쩌구저쩌구~~"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    marginTop: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  headerButton: {
    marginRight: 15,
    marginLeft: 15,
    fontSize: 20,
    fontWeight: "bold",
  },
  month: {
    flexDirection: "column",
    alignItems: "center",
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
    fontWeight: "bold",
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
    fontWeight: "bold",
  },
  today: {
    backgroundColor: "#eee",
    borderRadius: 50,
  },
  todayText: {
    fontWeight: "bold",
  },
  selectedDay: {
    borderColor: "red",
    borderWidth: 2,
    borderRadius: 50,
  },
  monthWrapper: {
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 20,
    padding: 10,
    width: "90%",
  },
});
