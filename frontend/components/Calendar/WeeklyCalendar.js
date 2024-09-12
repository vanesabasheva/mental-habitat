import { Agenda } from "react-native-calendars";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Colors } from "../../constants/Colors";
function WeeklyAgenda() {
  const CALENDAR_THEME = {
    backgroundColor: Colors.primaryBackgroundLight,
    calendarBackground: Colors.primaryBackgroundLight,
    textSectionTitleColor: "#b6c1cd",
    textSectionTitleDisabledColor: "#d9e1e8",
    selectedDayBackgroundColor: Colors.primaryGrey,
    selectedDayTextColor: Colors.primaryText,
    todayTextColor: Colors.primaryText,
    dayTextColor: "#2d4150",
    textDisabledColor: "#d9e1e8",
    dotColor: "white",
    selectedDotColor: "transparent",
    arrowColor: "orange",
    disabledArrowColor: "#d9e1e8",
    monthTextColor: "blue",
    indicatorColor: "blue",
    textDayFontFamily: "monospace",
    textMonthFontFamily: "monospace",
    textDayHeaderFontFamily: "monospace",
    textDayFontWeight: "300",
    textMonthFontWeight: "bold",
    textDayHeaderFontWeight: "300",
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 16,
  };

  // Specify how each date should be rendered. day can be undefined if the item is not first in that day
  const renderEmptyDay = () => {
    return <View styles={{ backgroundColor: Colors.primaryBackgroundLight }} />;
  };

  //returns card for empty slots.
  const renderEmptyItem = () => {
    return <Text>No slots in the calendar</Text>;
  };

  // Specify how each item should be rendered in the agenda
  const renderItems = (item, firstItemInDay) => {
    // TODO: Add Habits Scrollable List
    return (
      <View style={{ backgroundColor: Colors.primaryBackgroundLight }}>
        <Text>{item.name}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView>
      <View
        style={{ height: 200, backgroundColor: Colors.primaryBackgroundLight }}>
        <Agenda
          firstDay={1}
          items={{
            "2024-09-05": [
              {
                name: "Meeting 1",
                data: "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. ",
              },
            ],
            "2024-09-04": [
              {
                name: "Meeting 2",
                data: "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. ",
              },
            ],
            "2024-09-05": [
              {
                name: "Meeting 3",
                data: "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. ",
              },
            ],
            "2024-03-30": [
              {
                name: "Meeting 4",
                data: "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. ",
              },
            ],
            "2024-03-31": [
              {
                name: "Meeting 5",
                data: "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. ",
              },
            ],
            "2024-03-25": [
              {
                name: "Meeting 6",
                data: "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. ",
              },
            ],
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
