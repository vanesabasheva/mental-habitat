import { useState } from "react";
import { TextInput, View, Text, Dimensions } from "react-native";
import { Colors } from "../../../constants/Colors";
import Button from "../../../ui/Button";
import { styles } from "./FormSmoking";

function NewAlcoholHabitForm({ onAddNewHabit }) {
  const [title, setTitle] = useState("");
  const [numberOfDrinks, setNumberOfDrinks] = useState("");
  const [errors, setErrors] = useState({
    titleError: null,
    drinksError: null,
  });

  function addNewHabitHandler() {
    const newErrors = {
      titleError: title.trim() === "" ? "Title required." : null,
      drinksError: drinksError.trim() === "" ? "Drinks/day required." : null,
    };

    // Set all errors at once
    setErrors(newErrors);

    // Check if any errors exist before submitting
    if (Object.values(newErrors).some((error) => error !== null)) {
      return;
    }

    const habit = {
      title: title,
      numberOfDrinks: numberOfDrinks,
    };
    onAddNewHabit(habit);
  }

  return (
    <View style={styles.container}>
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

      <Text
        style={{
          color: Colors.primaryText,
          fontSize: 14,
          fontFamily: "robotomono-bold",
          paddingHorizontal: 12,
        }}>
        Drinks/day
      </Text>
      <TextInput
        onChangeText={setNumberOfDrinks}
        value={numberOfDrinks}
        style={styles.input}
        maxLength={2}
        keyboardType="numeric"
      />
      {errors.cigaretteError && (
        <Text style={styles.errorText}>{errors.cigaretteError}</Text>
      )}

      <Button
        textStyles={{ fontFamily: "robotomono-bold" }}
        newStyles={{
          width: Dimensions.get("window").width,
          alignSelf: "center",
          marginTop: Dimensions.get("window").height / 15,
          width: Dimensions.get("window").width / 1.3,
        }}
        onPress={addNewHabitHandler}>
        Add
      </Button>
    </View>
  );
}

export default NewAlcoholHabitForm;
