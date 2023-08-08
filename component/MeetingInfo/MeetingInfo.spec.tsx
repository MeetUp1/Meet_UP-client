import { render, fireEvent } from "@testing-library/react-native";
import React from "react";
import { Provider } from "react-redux";
import "@testing-library/jest-dom";

import MeetingInfo from "./index";
import { userLogin } from "../../features/reducers/loginSlice";
import store from "../../store/configureStore";

jest.mock("@react-navigation/native", () => {
  return {
    useNavigation: () => ({ navigate: jest.fn() }),
    useFocusEffect: () => {},
  };
});

describe("MeetingInfo", () => {
  beforeEach(() => {
    store.dispatch(
      userLogin({
        name: "이상혁",
        id: "1",
        picture:
          "https://lh3.googleusercontent.com/a/AGNmyxbsZ_X7x6RQPbiObssV6ANgwoh7DOxueyuCpxnNCA=s96-c",
        email: "test@test.com",
        family_name: "이",
        given_name: "상혁",
        locale: "ko",
        verified_email: true,
      }),
    );
  });

  it("renders the initial state correctly", () => {
    const { getByText } = render(
      <Provider store={store}>
        <MeetingInfo />
      </Provider>,
    );
    expect(getByText("요청대기")).toBeTruthy();
    expect(getByText("신청완료")).toBeTruthy();
    expect(getByText("신청대기")).toBeTruthy();
    expect(getByText("거절확인")).toBeTruthy();
  });

  it("changes activeButton state when buttons are clicked", () => {
    const { getByText } = render(
      <Provider store={store}>
        <MeetingInfo />
      </Provider>,
    );

    const requestWaitingButton = getByText("요청대기");
    const requestCompletedButton = getByText("신청완료");
    const requestPendingButton = getByText("신청대기");
    const rejectionConfirmedButton = getByText("거절확인");

    fireEvent.press(requestWaitingButton);
    if (requestWaitingButton.parent?.parent) {
      expect(
        requestWaitingButton.parent.parent.props.style.backgroundColor,
      ).toEqual("#594545");
    } else {
      fail("Parent does not exist");
    }

    fireEvent.press(requestCompletedButton);
    if (requestCompletedButton.parent?.parent) {
      expect(
        requestCompletedButton.parent.parent.props.style.backgroundColor,
      ).toEqual("#594545");
    } else {
      fail("Parent does not exist");
    }

    fireEvent.press(requestPendingButton);
    if (requestPendingButton.parent?.parent) {
      expect(
        requestPendingButton.parent.parent.props.style.backgroundColor,
      ).toEqual("#594545");
    } else {
      fail("Parent does not exist");
    }

    fireEvent.press(rejectionConfirmedButton);
    if (rejectionConfirmedButton.parent?.parent) {
      expect(
        rejectionConfirmedButton.parent.parent.props.style.backgroundColor,
      ).toEqual("#594545");
    } else {
      fail("Parent does not exist");
    }
  });
});
