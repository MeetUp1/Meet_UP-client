import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import {
  COLOR_BEIGE,
  COLOR_BROWN,
  COLOR_LIGHTBROWN,
  COLOR_GRAY,
} from "../../constants/color";
import { getDaysInMonth, getFirstDayInMonth } from "../../features/utils";

type CreateMonthViewProps = {
  month: number;
  year: number;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
};

const CreateMonthView = ({
  month,
  year,
  selectedDate,
  setSelectedDate,
}: CreateMonthViewProps) => {
  const daysInMonth = getDaysInMonth(month, year);
  const firstDayInMonth = getFirstDayInMonth(month, year);

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const onDayPress = (day: Date) => {
    const currentDay = new Date();
    currentDay.setHours(0, 0, 0, 0);
    if (day >= currentDay) {
      setSelectedDate(day);
    }
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
            <View key={`day-${index}`} style={styles.day} />
          ))}
        {Array(daysInMonth)
          .fill(null)
          .map((_, index) => {
            const day = new Date(year, month, index + 1);
            const isToday = day.getTime() === today.getTime();
            const isSelected =
              selectedDate && day.getTime() === selectedDate.getTime();
            const isPast = day < today;

            const dayStyle = [
              styles.day,
              isToday && styles.today,
              isSelected && styles.selectedDay,
              isPast && styles.pastDay,
            ];
            const dayTextStyle = isToday
              ? styles.todayText
              : isPast
              ? styles.pastDayText
              : styles.dayText;

            return (
              <TouchableOpacity
                key={`day-${index}`}
                style={dayStyle}
                onPress={() => onDayPress(day)}
                disabled={isPast}
                testID={isSelected ? "selectedDay" : undefined}
              >
                <Text style={dayTextStyle}>{index + 1}</Text>
              </TouchableOpacity>
            );
          })}
      </View>
    </View>
  );
};

export default CreateMonthView;

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
  pastDay: {
    backgroundColor: COLOR_BROWN,
  },
  pastDayText: {
    color: COLOR_GRAY,
    fontSize: 15,
    fontFamily: "Jua",
  },
});
