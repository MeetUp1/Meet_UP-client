import { LOGIN_API_URL } from "@env";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import React, { useState, useCallback } from "react";
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
import { useSelector } from "react-redux";

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

export default function CreateMeeting() {
  const [date, setDate] = useState(new Date());
  const [timePeriod, setTimePeriod] = useState("AM");
  const [completeTime, setCompleteTime] = useState([]);
  const [selectedDateTime, setSelectedDateTime] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  const { currentUser } = useSelector((state) => state);

  const month = date.getMonth();
  const year = date.getFullYear();

  const navigation = useNavigation();

  const handleMeetingSchedule = async () => {
    navigation.navigate("MeetingSchedule", {
      showSnackbar: true,
      text: "미팅일정등록이 완료 되었습니다.",
    });
    try {
      await axios.patch(`${LOGIN_API_URL}/api/users/${currentUser.id}`, {
        selectedDateTime,
      });
    } catch (error) {
      // 오류 화면 렌더링
    }
  };

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

  const onHourSelect = (day, hour) => {
    const dateTime = new Date(day);
    dateTime.setHours(hour, 0, 0, 0);

    const dateTimeUTC = dateTime.toISOString();

    if (selectedDateTime.includes(dateTimeUTC)) {
      setSelectedDateTime(
        selectedDateTime.filter((selected) => selected !== dateTimeUTC),
      );
    } else {
      setSelectedDateTime([...selectedDateTime, dateTimeUTC]);
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

  const isCompleteTime = (day, hour) => {
    return completeTime.some((dateTime) => {
      const complete = new Date(dateTime);
      return (
        complete.getDate() === day.getDate() &&
        complete.getMonth() === day.getMonth() &&
        complete.getFullYear() === day.getFullYear() &&
        complete.getHours() === hour
      );
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
    };
  });

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        const response = await axios.get(
          `${LOGIN_API_URL}/api/users/${currentUser.id}`,
        );
        const openTime = response.data.openTime || null;
        const reservationTime = response.data.reservationTime || null;
        setCompleteTime(reservationTime);
        setSelectedDateTime(openTime);
      }
      fetchData();
    }, [currentUser.id]),
  );

  return (
    <ScrollView style={styles.scrollContainer}>
      <Text style={styles.titleText}>미팅 가능한 날짜를 선택해 주세요.</Text>
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
      {selectedDate && (
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
      )}
      <View style={styles.hoursContainer}>
        {selectedDate &&
          Array(12)
            .fill(null)
            .map((_, index) => {
              const hour = timePeriod === "AM" ? index : index + 12;
              const isSelected = selectedDateTime.some((dateTime) => {
                const selected = new Date(dateTime);
                return (
                  selected.getDate() === selectedDate.getDate() &&
                  selected.getMonth() === selectedDate.getMonth() &&
                  selected.getFullYear() === selectedDate.getFullYear() &&
                  selected.getHours() === hour
                );
              });

              const isDisabled = isCompleteTime(selectedDate, hour);

              return (
                <TouchableOpacity
                  key={`hour-${index}`}
                  style={[
                    styles.hour,
                    isSelected && styles.selectedHour,
                    isDisabled && styles.disabledHour,
                  ]}
                  onPress={() =>
                    !isDisabled && onHourSelect(selectedDate, hour)
                  }
                >
                  <Text
                    style={[
                      styles.hourText,
                      isSelected && styles.selectedHourText,
                      isDisabled && styles.disabledHourText,
                    ]}
                  >
                    {`${hour}:00`}
                  </Text>
                </TouchableOpacity>
              );
            })}
      </View>
      {selectedDate && (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleMeetingSchedule}
          >
            <Text style={styles.buttonText}>시간등록</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: "#fff",
    flex: 1,
  },
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    marginTop: 20,
  },
  titleText: {
    marginTop: 20,
    marginLeft: 20,
    fontSize: 15,
    fontWeight: "bold",
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
  button: {
    alignItems: "center",
    backgroundColor: "#FF9900",
    padding: 10,
    width: "35%",
    marginBottom: 50,
    borderRadius: 25,
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
  buttonText: {
    fontSize: 25,
    fontWeight: "bold",
  },
  disabledHour: {
    backgroundColor: "orange",
  },
  disabledHourText: {
    color: "#FFF",
  },
});
