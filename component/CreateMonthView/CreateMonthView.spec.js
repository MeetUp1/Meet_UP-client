import { render } from "@testing-library/react-native";
import React from "react";

import CreateMonthView from "./index";

describe("CreateMonthView", () => {
  const mockSetSelectedDate = jest.fn();

  beforeEach(() => {
    mockSetSelectedDate.mockReset();
  });

  it("renders correctly and displays week labels", () => {
    const { getByText } = render(
      <CreateMonthView
        month={1}
        year={2023}
        selectedDate={new Date(2023, 1, 15)}
        setSelectedDate={mockSetSelectedDate}
      />,
    );

    expect(getByText("일")).toBeTruthy();
    expect(getByText("월")).toBeTruthy();
    expect(getByText("화")).toBeTruthy();
    expect(getByText("수")).toBeTruthy();
    expect(getByText("목")).toBeTruthy();
    expect(getByText("금")).toBeTruthy();
    expect(getByText("토")).toBeTruthy();
  });

  it("renders days correctly", () => {
    const { getByText } = render(
      <CreateMonthView
        month={1}
        year={2023}
        selectedDate={new Date(2023, 1, 15)}
        setSelectedDate={mockSetSelectedDate}
      />,
    );

    expect(getByText("1")).toBeTruthy();
    expect(getByText("15")).toBeTruthy();
    expect(getByText("28")).toBeTruthy();
  });

  it("applies the correct styling for the selected date", () => {
    const { getByTestId } = render(
      <CreateMonthView
        month={1}
        year={2023}
        selectedDate={new Date(2023, 1, 15)}
        setSelectedDate={mockSetSelectedDate}
      />,
    );

    const selectedDateElement = getByTestId("selectedDay");
    const { style } = selectedDateElement.props;

    const borderWidth = style.borderWidth;
    const borderColor = style.borderColor;

    expect(borderWidth).toEqual(2);
    expect(borderColor).toEqual("#594545");
  });

  it("applies correct styling for past dates", () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 2);
    const { getByText } = render(
      <CreateMonthView
        month={pastDate.getMonth()}
        year={pastDate.getFullYear()}
        selectedDate={null}
        setSelectedDate={mockSetSelectedDate}
      />,
    );

    const pastDateElement = getByText(pastDate.getDate().toString());
    const { style } = pastDateElement.props;

    expect(style.color).toEqual("#A0A0A0");
  });

  it("applies correct styling for today's date", () => {
    const today = new Date();
    const { getByText } = render(
      <CreateMonthView
        month={today.getMonth()}
        year={today.getFullYear()}
        selectedDate={null}
        setSelectedDate={mockSetSelectedDate}
      />,
    );

    const todayElement = getByText(today.getDate().toString());
    const { style } = todayElement.props;

    expect(style.color).toEqual("#FFF8EA");
  });
});
