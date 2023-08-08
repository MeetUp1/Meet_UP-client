import { useNavigation } from "@react-navigation/native";
import { render, fireEvent } from "@testing-library/react-native";
import React from "react";
import { useSelector } from "react-redux";

import Header from "./index";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));
jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

describe("Header", () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };
  const mockCurrentUser = {
    name: "홍길동",
    picture: "https://example.com/profile.jpg",
  };

  beforeEach(() => {
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector({ currentUser: mockCurrentUser }),
    );
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByText, getByTestId } = render(<Header />);
    expect(getByText("Meet-UP!")).toBeTruthy();
    expect(getByText(`${mockCurrentUser.name}님 안녕하세요`)).toBeTruthy();
    expect(getByTestId("profileImg")).toBeTruthy();
    expect(getByText("미팅일정")).toBeTruthy();
    expect(getByText("미팅확인")).toBeTruthy();
    expect(getByText("미팅신청")).toBeTruthy();
    expect(getByText("미팅생성")).toBeTruthy();
  });

  it("navigates correctly when buttons are pressed", () => {
    const { getByText } = render(<Header />);
    fireEvent.press(getByText("미팅일정"));
    expect(mockNavigation.navigate).toHaveBeenCalledWith("MeetingSchedule");
    fireEvent.press(getByText("미팅확인"));
    expect(mockNavigation.navigate).toHaveBeenCalledWith("MeetingInfo");

    fireEvent.press(getByText("미팅신청"));
    expect(mockNavigation.navigate).toHaveBeenCalledWith("MeetingRequest");

    fireEvent.press(getByText("미팅생성"));
    expect(mockNavigation.navigate).toHaveBeenCalledWith("CreateMeeting");
  });
});
