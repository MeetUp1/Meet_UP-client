import { NavigationContainer } from "@react-navigation/native";
import { render, fireEvent } from "@testing-library/react-native";
import React from "react";
import { Provider } from "react-redux";

import Login from "./index";
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
});
