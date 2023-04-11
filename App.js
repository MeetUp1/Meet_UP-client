import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { StyleSheet, View } from "react-native";

import CreateMeeting from "./component/CreateMeeting";
import Header from "./component/Header";
import Login from "./component/Login";
import MeetingInfo from "./component/MeetingInfo";
import MeetingSchedule from "./component/MeetingSchedule";
import MeetingRequest from "./component/RequestMeeting";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          header: () => <Header />,
        }}
      >
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="CreateMeeting" component={CreateMeeting} />
        <Stack.Screen name="MeetingInfo" component={MeetingInfo} />
        <Stack.Screen name="MeetingSchedule" component={MeetingSchedule} />
        <Stack.Screen name="MeetingRequest" component={MeetingRequest} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
});
