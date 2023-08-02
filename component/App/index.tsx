import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import CreateMeeting from "../CreateMeeting";
import Header from "../Header";
import Login from "../Login";
import MeetingInfo from "../MeetingInfo";
import MeetingSchedule from "../MeetingSchedule";
import MeetingRequest from "../RequestMeeting";
import ErrorPage from "../error";

type EmptyProps = object;

type RootStackParamList = {
  Login: EmptyProps;
  CreateMeeting: EmptyProps;
  MeetingInfo: EmptyProps;
  MeetingSchedule: EmptyProps;
  MeetingRequest: EmptyProps;
  ErrorPage: EmptyProps;
};

const Stack = createStackNavigator<RootStackParamList>();

const Root = () => {
  return (
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
      <Stack.Screen
        name="ErrorPage"
        component={ErrorPage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default Root;
