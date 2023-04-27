import { render, fireEvent, waitFor } from "@testing-library/react-native";
import axios from "axios";
import React from "react";
import { Provider } from "react-redux";
import "@testing-library/jest-dom";

import MeetingInfo from "./index";
import { userLogin } from "../../features/reducers/loginSlice";
import store from "../../store/configureStore";

jest.mock("axios");

jest.mock("@react-navigation/native", () => {
  return {
    useNavigation: () => ({ navigate: jest.fn() }),
    useFocusEffect: () => {},
  };
});

test("fetchData should return mock meetings", async () => {
  const mockMeetings = [
    {
      _id: "1",
      status: "pending",
      startTime: "2023-05-01T10:00:00",
      title: "Meeting 1",
      location: "Location 1",
      requester: { id: "1", name: "User 1", picture: "User1.jpg" },
      requestee: { id: "2", name: "User 2", picture: "User2.jpg" },
    },
    {
      _id: "2",
      status: "accepted",
      startTime: "2023-05-02T10:00:00",
      title: "Meeting 2",
      location: "Location 2",
      requester: { id: "1", name: "User 1", picture: "User1.jpg" },
      requestee: { id: "2", name: "User 2", picture: "User2.jpg" },
    },
    {
      _id: "3",
      status: "rejected",
      startTime: "2023-05-03T10:00:00",
      title: "Meeting 3",
      location: "Location 3",
      requester: { id: "1", name: "User 1", picture: "User1.jpg" },
      requestee: { id: "2", name: "User 2", picture: "User2.jpg" },
    },
  ];

  axios.get.mockResolvedValue({ data: mockMeetings });
});

describe("MeetingInfo", () => {
  beforeEach(() => {
    store.dispatch(
      userLogin({
        name: "이상혁",
        id: "1",
        picture:
          "https://lh3.googleusercontent.com/a/AGNmyxbsZ_X7x6RQPbiObssV6ANgwoh7DOxueyuCpxnNCA=s96-c",
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
    expect(
      requestWaitingButton.parent.parent.props.style.backgroundColor,
    ).toEqual("#594545");

    fireEvent.press(requestCompletedButton);
    expect(
      requestCompletedButton.parent.parent.props.style.backgroundColor,
    ).toEqual("#594545");

    fireEvent.press(requestPendingButton);
    expect(
      requestPendingButton.parent.parent.props.style.backgroundColor,
    ).toEqual("#594545");

    fireEvent.press(rejectionConfirmedButton);
    expect(
      rejectionConfirmedButton.parent.parent.props.style.backgroundColor,
    ).toEqual("#594545");
  });
});
