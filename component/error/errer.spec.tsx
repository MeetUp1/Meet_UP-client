import { useNavigation } from "@react-navigation/native";
import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import ErrorPage from "./index";

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));
const mockNavigate = jest.fn();

describe("ErrorPage", () => {
  it("renders correctly", () => {
    const { getByText } = render(<ErrorPage />);
    expect(getByText("⚠️에러가 발생했습니다")).toBeTruthy();
    expect(getByText("로그인 페이지로 이동")).toBeTruthy();
  });

  it("navigates to login page when retry button is pressed", () => {
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });

    const { getByText } = render(<ErrorPage />);
    fireEvent.press(getByText("로그인 페이지로 이동"));

    expect(mockNavigate).toHaveBeenCalledWith("Login");
  });
});
