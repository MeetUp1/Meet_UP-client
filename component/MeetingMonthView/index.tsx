import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import { COLOR_BEIGE, COLOR_LIGHTBROWN } from "../../constants/color";
import { getDaysInMonth, getFirstDayInMonth } from "../../features/utils";

const MeetingMonthView = ({
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

  const onDayPress = (day: Date) => {
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

export default MeetingMonthView;

const styles = StyleSheet.create({
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
    fontFamily: "Jua",
  },
});
