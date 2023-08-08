import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import {
  COLOR_BEIGE,
  COLOR_GRAY,
  COLOR_LIGHTBROWN,
} from "../../constants/color";
import { getDaysInMonth, getFirstDayInMonth } from "../../features/utils";

const RequestMonthView = ({
  month,
  year,
  selectedDate,
  setSelectedDate,
  selectUserTime,
}) => {
  const daysInMonth = getDaysInMonth(month, year);
  const firstDayInMonth = getFirstDayInMonth(month, year);

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const onDayPress = (day: Date) => {
    setSelectedDate(day);
  };

  const getMeetingCountForDate = (date: Date) => {
    return selectUserTime
      .map((time: Date) => new Date(time))
      .filter(
        (time: Date) =>
          time.getFullYear() === date.getFullYear() &&
          time.getMonth() === date.getMonth() &&
          time.getDate() === date.getDate(),
      ).length;
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
            const isToday =
              day.getFullYear() === today.getFullYear() &&
              day.getMonth() === today.getMonth() &&
              day.getDate() === today.getDate();
            const isSelected =
              selectedDate && day.getTime() === selectedDate.getTime();
            const isPastDate = day.getTime() < today.getTime();

            const dayStyle = [
              styles.day,
              isToday && styles.today,
              isSelected && styles.selectedDay,
            ];
            const dayTextStyle = isToday
              ? styles.todayText
              : isPastDate
              ? styles.pastDateText
              : styles.dayText;

            const meetingCount = getMeetingCountForDate(day);

            return (
              <TouchableOpacity
                key={`day-${index}`}
                style={dayStyle}
                onPress={() => !isPastDate && onDayPress(day)}
                disabled={isPastDate}
              >
                <Text style={dayTextStyle}>{index + 1}</Text>
                {meetingCount > 0 && (
                  <Text style={styles.meetingCount}>{meetingCount}</Text>
                )}
              </TouchableOpacity>
            );
          })}
      </View>
    </View>
  );
};

export default RequestMonthView;

const styles = StyleSheet.create({
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
    color: COLOR_BEIGE,
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
    color: COLOR_BEIGE,
    fontFamily: "Jua",
  },
  today: {
    backgroundColor: COLOR_LIGHTBROWN,
    borderRadius: 50,
  },
  todayText: {
    color: COLOR_BEIGE,
    fontFamily: "Jua",
  },
  selectedDay: {
    borderColor: COLOR_LIGHTBROWN,
    borderWidth: 2,
    borderRadius: 50,
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
  },
  pastDateText: {
    color: COLOR_GRAY,
    fontSize: 15,
    fontFamily: "Jua",
  },
});
