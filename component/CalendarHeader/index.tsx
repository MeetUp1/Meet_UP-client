import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

type CalendarHeaderProps = {
  month: number;
  year: number;
  onPrev: () => void;
  onNext: () => void;
};

const CalendarHeader = ({
  month,
  year,
  onPrev,
  onNext,
}: CalendarHeaderProps) => (
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

export default CalendarHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    marginTop: 20,
    fontSize: 30,
    fontFamily: "Jua",
  },
  headerButton: {
    marginTop: 20,
    marginRight: 15,
    marginLeft: 15,
    fontSize: 20,
    fontFamily: "Jua",
  },
});
