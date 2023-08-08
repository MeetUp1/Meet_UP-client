import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { render, fireEvent } from "@testing-library/react-native";
import axios from "axios";
import React from "react";
import { Provider } from "react-redux";
import "@testing-library/jest-dom";

import CreateMeeting from "./index";
import store from "../../store/configureStore";

jest.mock("axios");
jest.mock("@react-navigation/native", () => {
  return {
    ...jest.requireActual("@react-navigation/native"),
    useNavigation: jest.fn(),
  };
});

describe("CreateMeeting", () => {
  it("renders correctly", () => {
    const { getByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <CreateMeeting />
        </NavigationContainer>
      </Provider>,
    );

    expect(getByText("미팅 가능한 날짜를 선택해 주세요.")).toBeTruthy();
  });

  it("switches time periods correctly", () => {
    const { getByText, queryByTestId } = render(
      <Provider store={store}>
        <NavigationContainer>
          <CreateMeeting />
        </NavigationContainer>
      </Provider>,
    );

    const amButton = getByText("오전");
    const pmButton = getByText("오후");

    fireEvent.press(amButton);
    const timePeriodTextAM = queryByTestId("timePeriodTextAM");
    expect(timePeriodTextAM).not.toBeNull();
    if (timePeriodTextAM) {
      expect(timePeriodTextAM.props.children).toEqual("오전");
    }

    fireEvent.press(pmButton);
    const timePeriodTextPM = queryByTestId("timePeriodTextPM");
    expect(timePeriodTextPM).not.toBeNull();
    if (timePeriodTextPM) {
      expect(timePeriodTextPM.props.children).toEqual("오후");
    }
  });

  it("selects hours correctly", () => {
    const { getByText, getAllByTestId } = render(
      <Provider store={store}>
        <NavigationContainer>
          <CreateMeeting />
        </NavigationContainer>
      </Provider>,
    );

    const hourButtons = getAllByTestId("hour");
    const firstHourButton = hourButtons[0];
    const firstHourText = getByText("0:00");

    fireEvent.press(firstHourButton);
    expect(firstHourText.props.style).toContainEqual(
      expect.objectContaining({ color: "#FFF8EA" }),
    );
  });

  it("handles meeting schedule submission", async () => {
    const mockNavigation = { navigate: jest.fn() };
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);

    const { getByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <CreateMeeting />
        </NavigationContainer>
      </Provider>,
    );

    const meetingScheduleButton = getByText("시간등록");

    jest.mocked(axios.patch).mockResolvedValue({ status: 200 } as any);

    fireEvent.press(meetingScheduleButton);

    expect(axios.patch).toHaveBeenCalled();
  });
});
