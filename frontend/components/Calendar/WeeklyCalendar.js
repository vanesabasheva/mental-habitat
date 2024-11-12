import { Agenda } from "react-native-calendars";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import { Colors } from "../../constants/Colors";
import HabitItem from "../Habits/HabitItem";
import Ionicons from "@expo/vector-icons/Ionicons";
import { deviceHeight } from "../../constants/Dimensions";

function WeeklyAgenda({
  habitsForDate,
  selectedDate,
  setSelectedDate,
  onDeleteHabit,
  onEditHabit,
}) {
  const CALENDAR_THEME = {
    calendarBackground: Colors.primaryBackgroundLight,
    textSectionTitleColor: "#b6c1cd", //color of Mon, Tue, Wed ...
    textSectionTitleDisabledColor: Colors.primaryBackgroundLight,
    selectedDayBackgroundColor: Colors.primaryGrey,
    selectedDayTextColor: Colors.primaryText,
    todayTextColor: Colors.primaryText,
    dayTextColor: "#2d4150",
    textDisabledColor: Colors.primaryGrey, //last and next month color
    dotColor: "white", // other days, if there are any items
    selectedDotColor: "white", // today, if there are any items
    arrowColor: "orange",
    disabledArrowColor: Colors.primaryGrey,
    monthTextColor: Colors.primaryBold,
    indicatorColor: Colors.primaryGrey,
    textDayFontFamily: "robotomono-regular",
    textMonthFontFamily: "robotomono-bold",
    textDayHeaderFontFamily: "robotomono-regular",
    textDayFontWeight: "300",
    textMonthFontWeight: "bold",
    textDayHeaderFontWeight: "300",
    textDayFontSize: 14,
    textMonthFontSize: 14,
    textDayHeaderFontSize: 14,
    reservationsBackgroundColor: Colors.primaryBackgroundLight,
    agendaKnobColor: Colors.primaryGrey,
  };

  // Specify how each date should be rendered. day can be undefined if the item is not first in that day
  const renderEmptyDay = () => {
    return <View styles={{ backgroundColor: Colors.primaryBackgroundLight }} />;
  };

  async function editHabitHandler() {
    console.log("Editing habit... updating UI initiated");
    await onEditHabit();
  }

  async function deleteHabitHandler(id) {
    onDeleteHabit(id);
  }

  //returns card for empty slots.
  const renderEmptyItem = () => {
    return (
      <View style={styles.container}>
        <Ionicons name="sunny-outline" size={24} color={Colors.primaryGrey} />
      </View>
    );
  };

  // Specify how each item should be rendered in the agenda
  const renderItems = (item, firstItemInDay) => {
    return (
      <HabitItem
        habit={item}
        day={selectedDate}
        onDeleteHabit={deleteHabitHandler}
        onEditHabit={editHabitHandler}
      />
    );
  };

  return (
    <SafeAreaView>
      <View
        style={{
          height: deviceHeight / 1.5,
          backgroundColor: Colors.primaryBackgroundLight,
        }}>
        <Agenda
          firstDay={1}
          items={habitsForDate}
          // Callback that gets called on day press
          onDayPress={(day) => {
            const formattedMonth = String(day.month).padStart(2, "0"); // Ensures the month is two digits
            const formattedDay = String(day.day).padStart(2, "0"); // Ensures the day is two digits
            const formattedDate = `${day.year}-${formattedMonth}-${formattedDay}`;
            setSelectedDate(formattedDate);
          }}
          renderDay={renderEmptyDay}
          renderEmptyData={renderEmptyItem}
          renderItem={renderItems}
          scrollEnabled={false}
          selected={selectedDate} //Initially selected day
          hideKnob={false} // Hide knob button. Default = false
          showClosingKnob // When `true` and `hideKnob` prop is `false`, the knob will always be visible and the user will be able to drag the knob up and close the calendar. Default = false
          theme={{
            ...CALENDAR_THEME,
          }}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
});
export default WeeklyAgenda;
