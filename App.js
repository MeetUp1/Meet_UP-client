import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

import CreateMeeting from "./component/CreateMeeting";
import Header from "./component/Header";
import Login from "./component/Login";
import MeetingInfo from "./component/MeetingInfo";
import MeetingSchedule from "./component/MeetingSchedule";
import MeetingRequest from "./component/RequestMeeting";

export default function App() {
  return (
    <View style={styles.container}>
      <Header />
      <MeetingInfo />
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
