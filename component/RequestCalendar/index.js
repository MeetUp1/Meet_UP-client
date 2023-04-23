import { LOGIN_API_URL } from "@env";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import React, { useState, useMemo, useCallback } from "react";
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

const MonthView = ({
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

  const onDayPress = (day) => {
    setSelectedDate(day);
  };

  const getMeetingCountForDate = (date) => {
    return selectUserTime
      .map((time) => new Date(time))
      .filter(
        (time) =>
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

export default function RequestCalendar({
  nextStep,
  selectedUser,
  setSelectUserUTCTime,
  prevStep,
}) {
  const [date, setDate] = useState(new Date());
  const [timePeriod, setTimePeriod] = useState("AM");
  const [selectedHours, setSelectedHours] = useState([]);
  const [selectUserTime, setSelectUserTime] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const navigation = useNavigation();

  const navigateToLoginPage = () => {
    navigation.navigate("ErrorPage");
  };

  const month = date.getMonth();
  const year = date.getFullYear();

  const onPrevMonth = () => {
    const newDate = new Date(year, month - 1, 1);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    runOnJS(setDate)(newDate);

    if (
      today.getMonth() === newDate.getMonth() &&
      today.getFullYear() === newDate.getFullYear()
    ) {
      runOnJS(setSelectedDate)(today);
    } else {
      newDate.setHours(0, 0, 0, 0);
      runOnJS(setSelectedDate)(newDate);
    }
  };

  const onNextMonth = () => {
    const newDate = new Date(year, month + 1, 1);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    runOnJS(setDate)(newDate);

    if (
      today.getMonth() === newDate.getMonth() &&
      today.getFullYear() === newDate.getFullYear()
    ) {
      runOnJS(setSelectedDate)(today);
    } else {
      newDate.setHours(0, 0, 0, 0);
      runOnJS(setSelectedDate)(newDate);
    }
  };

  const onTimePeriodChange = (period) => {
    setTimePeriod(period);
  };

  const onHourSelect = (hour) => {
    if (selectedHours.includes(hour)) {
      setSelectedHours(
        selectedHours.filter((selectedHour) => selectedHour !== hour),
      );
    } else {
      const utcDate = convertToUTCDate(selectedDate, hour);
      setSelectUserUTCTime(utcDate);
      setSelectedHours([hour]);
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

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        try {
          const response = await axios.get(
            `${LOGIN_API_URL}/api/users/${selectedUser.id}`,
          );
          const openTime = response.data.openTime || null;
          setSelectUserTime(openTime);
        } catch (error) {
          navigateToLoginPage();
        }
      }
      fetchData();
    }, []),
  );

  return (
    <View style={styles.marginContainer}>
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
                selectUserTime={selectUserTime}
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
      <View style={styles.buttonContainer}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => prevStep()}
          >
            <Text style={styles.nextButtonText}>뒤로</Text>
          </TouchableOpacity>
        </View>
        {selectedHours.length !== 0 && (
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => nextStep()}
            >
              <Text style={styles.nextButtonText}>다음</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF8EA",
    alignItems: "center",
    marginTop: 10,
  },
  buttonContainer: {
    backgroundColor: "#FFF8EA",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    flexDirection: "row",
  },
  marginContainer: {
    marginBottom: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 30,
    fontFamily: "Jua",
  },
  headerButton: {
    marginRight: 15,
    marginLeft: 15,
    fontSize: 20,
    fontFamily: "Jua",
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
    backgroundColor: "#9E7676",
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
    color: "#FFF8EA",
    fontFamily: "Jua",
  },
  timePeriodSelected: {
    backgroundColor: "#594545",
  },
  timePeriodSelectedText: {
    color: "#FFF8EA",
    fontFamily: "Jua",
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
    fontFamily: "Jua",
  },
  selectedHour: {
    backgroundColor: "#9E7676",
  },
  selectedHourText: {
    color: "#FFF8EA",
    fontFamily: "Jua",
  },
  nextButton: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    marginBottom: 50,
    marginLeft: 10,
    marginRight: 10,
    width: 100,
    height: 50,
    borderRadius: 15,
    borderWidth: 2,
    backgroundColor: "#9E7676",
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
    color: "#FFF8EA",
    fontFamily: "Jua",
  },
  unavailableHour: {
    backgroundColor: "#594545",
  },
  unavailableHourText: {
    color: "#999",
    fontFamily: "Jua",
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
    color: "#A0A0A0",
    fontSize: 15,
    fontFamily: "Jua",
  },
});
