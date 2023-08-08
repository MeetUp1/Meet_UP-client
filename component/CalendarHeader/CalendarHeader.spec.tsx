import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import CalendarHeader from "./index";

describe("CalendarHeader", () => {
  it("renders header with given month and year", () => {
    const onPrev = jest.fn();
    const onNext = jest.fn();
    const { getByText } = render(
      <CalendarHeader month={3} year={2023} onPrev={onPrev} onNext={onNext} />,
    );
    expect(getByText("2023.4")).toBeTruthy();
  });

  it("calls onPrev when Prev button is pressed", () => {
    const onPrev = jest.fn();
    const onNext = jest.fn();
    const { getByText } = render(
      <CalendarHeader month={3} year={2023} onPrev={onPrev} onNext={onNext} />,
    );
    fireEvent.press(getByText("Prev"));
    expect(onPrev).toHaveBeenCalledTimes(1);
  });

  it("calls onNext when Next button is pressed", () => {
    const onPrev = jest.fn();
    const onNext = jest.fn();
    const { getByText } = render(
      <CalendarHeader month={3} year={2023} onPrev={onPrev} onNext={onNext} />,
    );
    fireEvent.press(getByText("Next"));
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
