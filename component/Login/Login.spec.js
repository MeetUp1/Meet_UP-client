import { NavigationContainer } from "@react-navigation/native";
import { render, fireEvent } from "@testing-library/react-native";
import * as expoNotifications from "expo-notifications";
import React from "react";
import { Provider } from "react-redux";

import Login, { registerForPushNotificationsAsync } from "./index";
import store from "../../store/configureStore";

const mockPromptAsync = jest.fn().mockResolvedValue({ type: "success" });

jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

jest.mock("expo-auth-session/providers/google", () => ({
  useAuthRequest: jest.fn(() => [
    { type: "request" },
    { type: "response" },
    mockPromptAsync,
  ]),
}));

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: jest.fn(),
}));

jest.mock("expo-device", () => ({
  isDevice: true,
}));

jest.mock("expo-notifications", () => ({
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  getExpoPushTokenAsync: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  AndroidImportance: {
    MAX: "MAX",
  },
}));

describe("Login", () => {
  it("should render correctly", () => {
    const { getByTestId, getByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <Login />
        </NavigationContainer>
      </Provider>,
    );
    const animatedExclamation = getByTestId("animated-exclamation");
    const loginButton = getByText("Log in");

    expect(animatedExclamation).toBeTruthy();
    expect(loginButton).toBeTruthy();
  });

  it("should trigger Google authentication request when the login button is pressed", () => {
    const { getByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <Login />
        </NavigationContainer>
      </Provider>,
    );

    const loginButton = getByText("Log in");
    fireEvent.press(loginButton);

    expect(mockPromptAsync).toHaveBeenCalled();
  });

  it("should return token when permissions are granted", async () => {
    const mockToken = "mock-token";

    expoNotifications.getPermissionsAsync.mockResolvedValue({
      status: "granted",
    });
    expoNotifications.getExpoPushTokenAsync.mockResolvedValue({
      data: mockToken,
    });

    const result = await registerForPushNotificationsAsync();

    expect(result).toBe(mockToken);
  });
});
