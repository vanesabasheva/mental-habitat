import {
  Calendar,
  CalendarList,
  Agenda,
  LocaleConfig,
} from "react-native-calendars";
import { useState } from "react";
import { Colors } from "../../constants/Colors";
function MonthlyCalendar() {
  const [selectedDate, setSelectedDate] = useState("");
  return (
    <Calendar
      firstDay={1}
      style={{
        borderWidth: 1,
        borderColor: Colors.primaryGrey,
        height: 350,
        borderRadius: 32,
      }}
      theme={{
        backgroundColor: "#cdffffff",
        calendarBackground: "#cdff",
        textSectionTitleColor: "#b6c1cd",
        selectedDayBackgroundColor: "yellow",
        selectedDayTextColor: "#ffffff",
        todayTextColor: "#00adf5",
        dayTextColor: "#2d4150",
        textDisabledColor: "#d9e",
      }}
      onDayPress={(day) => {
        setSelectedDate(day.dateString);
      }}
      markedDates={{
        [selectedDate]: {
          selected: true,
          disableTouchEvent: true,
          selectedDotColor: "tomato",
        },
      }}
    />
  );
}

export default MonthlyCalendar;
