import { Agenda } from "react-native-calendars";
import { View, Text, SafeAreaView, StyleSheet, Dimensions } from "react-native";
import { Colors } from "../../constants/Colors";
//import { HABITS } from "../../screens/Habits";
import HabitItem from "../Habits/HabitItem";

function WeeklyAgenda({ habits }) {
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

  //returns card for empty slots.
  const renderEmptyItem = () => {
    return (
      <View style={styles.container}>
        <Text>No slots in the calendar</Text>
      </View>
    );
  };

  // Specify how each item should be rendered in the agenda
  const renderItems = (item, firstItemInDay) => {
    return <HabitItem habit={item} />;
  };

  const deviceHeight = Dimensions.get("window").height;

  return (
    <SafeAreaView>
      <View
        style={{
          height: deviceHeight / 1.5,
          backgroundColor: Colors.primaryBackgroundLight,
        }}>
        <Agenda
          firstDay={1}
          items={{
            "2024-09-16": habits,
          }}
          renderDay={renderEmptyDay}
          renderEmptyData={renderEmptyItem}
          renderItem={renderItems}
          scrollEnabled={false}
          selected={new Date().toString()} //Initially selected day
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
    justifyContent: "center",
  },
  item: {
    //backgroundColor: "white",
    //flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  itemText: {
    color: "#888",
    fontSize: 16,
  },
});
export default WeeklyAgenda;
