import { useState, useEffect } from "react";
import { TextInput, View, Text, StyleSheet, Dimensions } from "react-native";
import { Colors } from "../../../constants/Colors";
import Button from "../../../ui/Button";

function NewSmokingHabitForm({ habit, buttonLabel, onAddNewHabit }) {
  const [title, setTitle] = useState("");
  const [numberOfCigarettes, setNumberOfCigarettes] = useState("");
  const [errors, setErrors] = useState({
    titleError: null,
    cigaretteError: null,
  });

  useEffect(() => {
    if (habit) {
      setTitle(habit.title);
      setNumberOfCigarettes(habit.details.numberOfCigarettes);
    }
  }, [habit]);

  function addNewHabitHandler() {
    const newErrors = {
      titleError: title.trim() === "" ? "Title required." : null,
      cigaretteError:
        numberOfCigarettes.trim() === "" ? "Cigarettes/day required." : null,
    };

    // Set all errors at once
    setErrors(newErrors);

    // Check if any errors exist before submitting
    if (Object.values(newErrors).some((error) => error !== null)) {
      return;
    }
    const newHabit = {
      title: title,
      numberOfCigarettes: numberOfCigarettes,
      category: "Smoking",
    };
    console.log(newHabit);
    onAddNewHabit(newHabit);
  }
  return (
    <View style={styles.container}>
      <View>
        <Text
          style={{
            color: Colors.primaryText,
            fontSize: 14,
            fontFamily: "robotomono-bold",
            paddingHorizontal: 12,
          }}>
          Title
        </Text>

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
      </View>

      <View>
        <Text
          style={{
            color: Colors.primaryText,
            fontSize: 14,
            fontFamily: "robotomono-bold",
            paddingHorizontal: 12,
          }}>
          Cigarettes/day
        </Text>
        <TextInput
          onChangeText={setNumberOfCigarettes}
          value={numberOfCigarettes}
          style={styles.input}
          maxLength={2}
          keyboardType="numeric"
        />
        {errors.cigaretteError && (
          <Text style={styles.errorText}>{errors.cigaretteError}</Text>
        )}
      </View>
      <Button
        textStyles={{ fontFamily: "robotomono-bold" }}
        newStyles={{
          width: Dimensions.get("window").width,
          alignSelf: "center",
          width: Dimensions.get("window").width / 1.3,
        }}
        onPress={addNewHabitHandler}>
        {buttonLabel ? buttonLabel : "Add"}
      </Button>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    borderRadius: 42,
    backgroundColor: Colors.primaryBackgroundLight,
    // height: Dimensions.get("window").height / 5,
    width: Dimensions.get("window").width / 1.2,
    elevation: 2,
    shadowColor: "#333",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    padding: 16,
    marginTop: 12,
    gap: 6,
  },
  input: {
    backgroundColor: Colors.primaryBackground,
    padding: 14,
    borderRadius: 42,
    marginBottom: 4,
  },
  errorText: {
    color: Colors.error500,
    fontFamily: "robotomono-regular",
    fontSize: 8,
    paddingHorizontal: 16,
  },
});
export default NewSmokingHabitForm;
