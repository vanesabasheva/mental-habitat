import { useState, useEffect } from "react";
import { View, Text, TextInput } from "react-native";
import { Colors } from "../../../constants/Colors";
import { deviceHeight, deviceWidth } from "../../../constants/Dimensions";
import Button from "../../../ui/Button";

function ExerciseHabitLog({ habitEntry, onLog }) {
  const [notes, setNotes] = useState("");

  useEffect(() => {
    console.log("Habit entry in exercise log" + habitEntry);
    if (habitEntry) {
      if (habitEntry.details) {
        setNotes(habitEntry.details.notes);
      }
    }
  }, [habitEntry]);

  return (
    <View style={{ alignItems: "center" }}>
      <View
        style={{
          marginTop: 32,
          backgroundColor: Colors.primaryBackgroundLight,
          width: deviceWidth * 0.7,
          height: deviceHeight * 0.25,
          borderRadius: 32,
          marginBottom: 12,
        }}>
        <Text
          style={{
            padding: 14,
            backgroundColor: Colors.primaryGrey,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            fontFamily: "robotomono-bold",
          }}>
          Notes
        </Text>
        <TextInput
          multiline
          editable
          numberOfLines={4}
          value={notes}
          onChangeText={(text) => setNotes(text)}
          maxLength={400}
          style={{ padding: 10 }}
        />
      </View>
      <Button onPress={() => onLog({ notes: notes })}>Save</Button>
    </View>
  );
}

export default ExerciseHabitLog;
