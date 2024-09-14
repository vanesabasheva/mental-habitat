import { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Colors } from "../../../constants/Colors";
//import Button from "../../../ui/Button";

export const WEEK_DAYS = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

function SelectWeekDays({ onChange }) {
  let days = [];
  const [selectedDays, setSelectedDays] = useState(days);

  function getColor(index) {
    if (selectedDays.length != 0) {
      if (selectedDays.includes(index)) return Colors.primaryBackground;
      else return Colors.greyLight;
    } else {
      return Colors.greyLight;
    }
  }

  function toggleElement(daysOfWeek, element) {
    if (daysOfWeek.includes(element)) {
      return daysOfWeek.filter((item) => item != element);
    } else {
      return [...daysOfWeek, element];
    }
  }
  return (
    <View style={styles.container}>
      {WEEK_DAYS.map((day) => {
        return (
          <TouchableOpacity
            activeOpacity={0.6}
            key={day}
            onPress={() => {
              setSelectedDays(
                toggleElement(selectedDays, WEEK_DAYS.indexOf(day))
              );
              days = toggleElement(selectedDays, WEEK_DAYS.indexOf(day));
              onChange(days);
            }}
            style={[
              styles.weekButton,
              { backgroundColor: getColor(WEEK_DAYS.indexOf(day)) },
            ]}>
            <Text style={{ color: Colors.primaryText }}>{day}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 6,
  },
  weekButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 30,
    width: 30,
    //paddingHorizontal: 14,
    //paddingVertical: 12,
    margin: 4,
    borderRadius: 12,
  },
});
export default SelectWeekDays;
