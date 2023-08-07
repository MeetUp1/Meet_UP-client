import { LOGIN_API_URL } from "@env";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
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

import {
  COLOR_BEIGE,
  COLOR_BROWN,
  COLOR_LIGHTBROWN,
} from "../../constants/color";
import CalendarHeader from "../CalendarHeader";
import RequestMonthView from "../RequestMonthview";

export default function RequestCalendar({
  nextStep,
  selectedUser,
  setSelectUserUTCTime,
  prevStep,
}) {
  type RootStackParamList = {
    ErrorPage: undefined;
  };
  type NavigationProp = StackNavigationProp<RootStackParamList>;

  const [date, setDate] = useState<Date>(new Date());
  const [timePeriod, setTimePeriod] = useState<string>("AM");
  const [selectedHours, setSelectedHours] = useState<number[]>([]);
  const [selectUserTime, setSelectUserTime] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return today;
  });

  const navigation = useNavigation<NavigationProp>();

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

  const onTimePeriodChange = (period: string) => {
    setTimePeriod(period);
  };

  const onHourSelect = (hour: number) => {
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

  const convertToLocalDate = (utcDate: Date) => {
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

  const convertToUTCDate = (localDate: Date, hour: number) => {
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
          console.error(error);
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
              <RequestMonthView
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
    backgroundColor: COLOR_BEIGE,
    alignItems: "center",
    marginTop: 10,
  },
  buttonContainer: {
    backgroundColor: COLOR_BEIGE,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    flexDirection: "row",
  },
  marginContainer: {
    marginBottom: 50,
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
    backgroundColor: COLOR_BROWN,
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
    color: COLOR_BEIGE,
    fontFamily: "Jua",
  },
  unavailableHour: {
    backgroundColor: COLOR_LIGHTBROWN,
  },
  unavailableHourText: {
    color: "#999",
    fontFamily: "Jua",
  },
});
