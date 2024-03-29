import { LOGIN_API_URL } from "@env";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
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

import {
  COLOR_BEIGE,
  COLOR_BROWN,
  COLOR_LIGHTBROWN,
} from "../../constants/color";
import { LoginState } from "../../store/types";
import CalendarHeader from "../CalendarHeader";
import CreateMonthView from "../CreateMonthView";

export default function CreateMeeting() {
  type RootStackParamList = {
    ErrorPage: undefined;
    MeetingSchedule: {
      showSnackbar: boolean;
      text: string;
    };
  };
  type NavigationProp = StackNavigationProp<RootStackParamList>;

  const [date, setDate] = useState<Date>(new Date());
  const [timePeriod, setTimePeriod] = useState<string>("AM");
  const [completeTime, setCompleteTime] = useState<string[]>([]);
  const [selectedDateTime, setSelectedDateTime] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  const { currentUser } = useSelector((state: LoginState) => state);

  const month = date.getMonth();
  const year = date.getFullYear();

  const navigation = useNavigation<NavigationProp>();

  const now = new Date();
  const currentHour = now.getHours();

  const navigateToLoginPage = () => {
    navigation.navigate("ErrorPage");
  };

  const handleMeetingSchedule = async () => {
    if (!currentUser) {
      navigateToLoginPage();
      return;
    }

    navigation.navigate("MeetingSchedule", {
      showSnackbar: true,
      text: "미팅일정등록이 완료 되었습니다.",
    });
    try {
      await axios.patch(`${LOGIN_API_URL}/api/users/${currentUser.id}`, {
        selectedDateTime,
      });
    } catch (error) {
      console.error(error);
      navigateToLoginPage();
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

  const onTimePeriodChange = (period: string) => {
    setTimePeriod(period);
  };

  const onHourSelect = (day: Date, hour: number) => {
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

  const isCompleteTime = (day: Date, hour: number) => {
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
        if (!currentUser) {
          navigateToLoginPage();
          return;
        }
        const response = await axios.get(
          `${LOGIN_API_URL}/api/users/${currentUser.id}`,
        );
        const openTime = response.data.openTime || null;
        const reservationTime = response.data.reservationTime || null;
        setCompleteTime(reservationTime);
        setSelectedDateTime(openTime);
      }
      fetchData();
    }, [currentUser]),
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
              <CreateMonthView
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
              testID="timePeriodTextAM"
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
              testID="timePeriodTextPM"
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

              const isDisabled =
                isCompleteTime(selectedDate, hour) ||
                (selectedDate.getTime() === now.setHours(0, 0, 0, 0) &&
                  hour < currentHour);

              return (
                <TouchableOpacity
                  key={`hour-${index}`}
                  testID="hour"
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
    backgroundColor: COLOR_BEIGE,
    flex: 1,
  },
  container: {
    backgroundColor: COLOR_BEIGE,
    alignItems: "center",
    marginTop: 20,
  },
  titleText: {
    marginTop: 20,
    marginLeft: 20,
    fontSize: 15,
    fontFamily: "Jua",
  },
  monthWrapper: {
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 20,
    padding: 10,
    width: "90%",
    backgroundColor: COLOR_BROWN,
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
    backgroundColor: COLOR_BROWN,
    width: "22%",
    marginRight: 5,
    alignItems: "center",
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
  timePeriodText: {
    fontSize: 20,
    color: COLOR_BEIGE,
    fontFamily: "Jua",
  },
  timePeriodSelected: {
    backgroundColor: COLOR_LIGHTBROWN,
  },
  timePeriodSelectedText: {
    color: COLOR_BEIGE,
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
    backgroundColor: COLOR_BROWN,
  },
  selectedHourText: {
    color: COLOR_BEIGE,
    fontFamily: "Jua",
  },
  button: {
    alignItems: "center",
    backgroundColor: COLOR_BROWN,
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
    fontSize: 22,
    color: COLOR_BEIGE,
    fontFamily: "Jua",
  },
  disabledHour: {
    backgroundColor: COLOR_LIGHTBROWN,
  },
  disabledHourText: {
    color: COLOR_BEIGE,
    fontFamily: "Jua",
  },
});
