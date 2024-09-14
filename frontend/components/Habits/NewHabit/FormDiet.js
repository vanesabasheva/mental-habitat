import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  Modal,
} from "react-native";
import { useState } from "react";
import { Colors } from "../../../constants/Colors";
import { Picker } from "@react-native-picker/picker";
import Button from "../../../ui/Button";
import SelectWeekDays, { WEEK_DAYS } from "./SelectWeekDays";
import { styles } from "./FormExercise";

function NewDietHabitForm({ onAddNewHabit }) {
  const [title, setTitle] = useState("");
  const [newHabit, setNewHabit] = useState(true);
  const [oldHabit, setOldHabit] = useState(false);
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
      typeHabitError:
        (!newHabit && !oldHabit) || (newHabit && oldHabit)
          ? "Type of habit required."
          : null,
      daysError: selectedDays.length == 0 ? "Days of the week required" : null,
    };

    // Set all errors at once
    setErrors(newErrors);

    // Check if any errors exist before submitting
    if (Object.values(newErrors).some((error) => error !== null)) {
      return;
    }

    const habit = {
      title: title,
      habitType: newHabit ? "new" : "old",
      selectedDaysOfWeek: selectedDays,
    };

    onAddNewHabit(habit);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title</Text>

      <TextInput
        onChangeText={setTitle}
        value={title}
        maxLength={40}
        placeholder="Write a positive, action-oriented title"
        style={styles.input}
      />
      {errors.titleError && (
        <Text style={styles.errorText}>{errors.titleError}</Text>
      )}

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          <Text style={styles.label}> New Habit</Text>
          <TextInput
            onChangeText={setNewHabit}
            value={newHabit}
            style={styles.input}
            maxLength={3}
            keyboardType="numeric"
          />

          {errors.typeHabitError && (
            <Text style={styles.errorText}>{errors.typeHabitError}</Text>
          )}
        </View>
        <View>
          <Text style={styles.label}>Old Habit</Text>
          <TextInput
            onChangeText={setOldHabit}
            value={oldHabit}
            style={styles.input}
            maxLength={3}
            keyboardType="numeric"
          />
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
          marginTop: Dimensions.get("window").height / 20,
          width: Dimensions.get("window").width / 1.3,
        }}
        onPress={addNewHabitHandler}>
        Add
      </Button>
    </View>
  );
}

export default NewDietHabitForm;
