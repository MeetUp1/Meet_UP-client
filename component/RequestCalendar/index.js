import axios from "axios";
import React, { useState, useEffect, useMemo } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

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

const MonthView = ({ month, year, selectedDate, setSelectedDate }) => {
  const daysInMonth = getDaysInMonth(month, year);
  const firstDayInMonth = getFirstDayInMonth(month, year);

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

export default function RequestCalendar({
  nextStep,
  selectedUser,
  setSelectUserUTCTime,
}) {
  const [date, setDate] = useState(new Date());
  const [timePeriod, setTimePeriod] = useState("AM");
  const [selectedHours, setSelectedHours] = useState([]);
  const [selectUserTime, setSelectUserTime] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const month = date.getMonth();
  const year = date.getFullYear();

  const onPrevMonth = () => {
    runOnJS(setDate)(new Date(year, month - 1, 1));
  };

  const onNextMonth = () => {
    runOnJS(setDate)(new Date(year, month + 1, 1));
  };

  const onTimePeriodChange = (period) => {
    setTimePeriod(period);
  };

  const onHourSelect = (hour) => {
    const utcDate = convertToUTCDate(selectedDate, hour);
    setSelectUserUTCTime(utcDate);
    setSelectedHours([hour]);
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

  const convertToLocalDate = (utcDate) => {
    const date = new Date(utcDate);
    return date;
  };

  const localUserTimes = useMemo(() => {
    if (!selectedDate) {
      return [];
    }
    return selectUserTime
      .map((time) => convertToLocalDate(time))
      .filter(
        (time) =>
          time.getFullYear() === selectedDate.getFullYear() &&
          time.getMonth() === selectedDate.getMonth() &&
          time.getDate() === selectedDate.getDate(),
      );
  }, [selectUserTime, selectedDate]);

  const convertToUTCDate = (localDate, hour) => {
    const date = new Date(localDate);
    date.setHours(hour, 0, 0, 0);
    return date.toISOString();
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/users/${selectedUser.id}`,
        );
        const openTime = response.data.openTime || null;
        setSelectUserTime(openTime);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchData();
  }, [selectedUser.id]);

  return (
    <View>
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
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            </View>
          </Animated.View>
        </PanGestureHandler>
      </View>
      <View style={styles.timePeriodContainer}>
        <TouchableOpacity
          style={[
            styles.timePeriodButton,
            timePeriod === "AM" && styles.timePeriodSelected,
          ]}
          onPress={() => onTimePeriodChange("AM")}
        >
          <Text
            style={[
              styles.timePeriodText,
              timePeriod === "AM" && styles.timePeriodSelectedText,
            ]}
          >
            오전
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.timePeriodButton,
            timePeriod === "PM" && styles.timePeriodSelected,
          ]}
          onPress={() => onTimePeriodChange("PM")}
        >
          <Text
            style={[
              styles.timePeriodText,
              timePeriod === "PM" && styles.timePeriodSelectedText,
            ]}
          >
            오후
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.hoursContainer}>
        {Array(12)
          .fill(null)
          .map((_, index) => {
            const hour = timePeriod === "AM" ? index : index + 12;
            const isSelected = selectedHours.includes(hour);
            const isAvailable = localUserTimes.some(
              (time) => time.getHours() === hour,
            );

            return (
              <TouchableOpacity
                key={`hour-${index}`}
                style={[
                  styles.hour,
                  isSelected && styles.selectedHour,
                  !isAvailable && styles.unavailableHour,
                ]}
                onPress={() => isAvailable && onHourSelect(hour)}
                disabled={!isAvailable}
              >
                <Text
                  style={[
                    styles.hourText,
                    isSelected && styles.selectedHourText,
                    !isAvailable && styles.unavailableHourText,
                  ]}
                >
                  {`${hour}:00`}
                </Text>
              </TouchableOpacity>
            );
          })}
      </View>
      <View style={styles.container}>
        <TouchableOpacity style={styles.nextButton} onPress={() => nextStep()}>
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    marginTop: 20,
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
  timePeriodContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  timePeriodButton: {
    padding: 10,
    borderRadius: 25,
    marginHorizontal: 10,
    backgroundColor: "khaki",
    width: "22%",
    marginRight: 5,
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
  timePeriodText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  timePeriodSelected: {
    backgroundColor: "green",
  },
  timePeriodSelectedText: {
    color: "white",
  },
  hoursContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  hour: {
    width: "30%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 20,
    margin: 5,
  },
  hourText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  selectedHour: {
    backgroundColor: "gray",
  },
  selectedHourText: {
    color: "white",
  },
  nextButton: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 50,
    width: 100,
    height: 50,
    borderRadius: 15,
    borderWidth: 2,
    backgroundColor: "#C1FB9E",
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
    fontWeight: "bold",
  },
  unavailableHour: {
    backgroundColor: "#f0f0f0",
  },
  unavailableHourText: {
    color: "#999",
  },
});
