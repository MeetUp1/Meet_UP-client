import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

import Header from "./component/Header";
import Login from "./component/Login";
import MeetingSchedule from "./component/MeetingSchedule";

export default function App() {
  return (
    <View style={styles.container}>
      <Header />
      <MeetingSchedule />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});