import {
  View,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { Colors } from "../../../constants/Colors";
import { styles } from "./FormExercise";
import SelectWeekDays, { WEEK_DAYS } from "./SelectWeekDays";
import Button from "../../../ui/Button";
import Ionicons from "@expo/vector-icons/Ionicons";

function NewDietHabitForm({ onAddNewHabit }) {
  const [title, setTitle] = useState("");
  const [habitType, setHabitType] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);

  const [errors, setErrors] = useState({
    title: null,
    typeHabitError: null,
    daysError: null,
  });

  function selectedDaysHandler(days) {
    const selectedDayNames = days.map((index) => WEEK_DAYS[index]);
    setSelectedDays(selectedDayNames);
  }

  function addNewHabitHandler() {
    const newErrors = {
      titleError: title.trim() === "" ? "Title required." : null,
      typeHabitError: habitType === null ? "Type of habit required." : null,
      daysError: selectedDays.length == 0 ? "Days of the week required" : null,
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error !== null)) {
      return;
    }

    const habit = {
      title: title,
      habitType: habitType,
      selectedDaysOfWeek: selectedDays,
      category: "Diet",
    };

    onAddNewHabit(habit);
  }

  function toggleHabitType(type) {
    setHabitType(type);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title</Text>

      <TextInput
        onChangeText={setTitle}
        value={title}
        maxLength={40}
        placeholder="Write a positive, action-oriented title"
        style={{
          backgroundColor: Colors.primaryBackground,
          padding: 14,
          borderRadius: 42,
          marginBottom: 4,
        }}
      />
      {errors.titleError && (
        <Text style={styles.errorText}>{errors.titleError}</Text>
      )}

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          <Text style={styles.label}> New Habit</Text>
          <TouchableOpacity
            onPress={() => toggleHabitType("new")}
            style={[
              styles.input,
              !(habitType === "new") && { backgroundColor: Colors.greyLight },
            ]}>
            <Ionicons
              name="checkmark-sharp"
              size={20}
              color={Colors.greyLight}
              style={{ alignSelf: "center" }}
            />
          </TouchableOpacity>

          {errors.typeHabitError && (
            <Text style={styles.errorText}>{errors.typeHabitError}</Text>
          )}
        </View>
        <View>
          <Text style={styles.label}>Old Habit</Text>
          <TouchableOpacity
            onPress={() => toggleHabitType("old")}
            style={[
              styles.input,
              !(habitType === "old") && { backgroundColor: Colors.greyLight },
            ]}>
            <Ionicons
              name="checkmark-sharp"
              size={20}
              color={Colors.greyLight}
              style={{ alignSelf: "center" }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.label}>Days of the week</Text>
      <SelectWeekDays onChange={selectedDaysHandler} />

      {errors.daysError && (
        <Text style={styles.errorText}>{errors.daysError}</Text>
      )}

      <Button
        textStyles={{ fontFamily: "robotomono-bold" }}
        newStyles={{
          width: Dimensions.get("window").width,
          alignSelf: "center",
          width: Dimensions.get("window").width / 1.3,
        }}
        onPress={addNewHabitHandler}>
        Add
      </Button>
    </View>
  );
}

export default NewDietHabitForm;
