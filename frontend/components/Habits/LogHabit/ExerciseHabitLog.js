import { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Colors } from "../../../constants/Colors";
import { deviceHeight, deviceWidth } from "../../../constants/Dimensions";
import Button from "../../../ui/Button";

function ExerciseHabitLog({ habitEntry, onLog }) {
  const [notes, setNotes] = useState("");
  const [duration, setDuration] = useState("0");
  const [distance, setDistance] = useState();

  useEffect(() => {
    console.log("Habit entry in exercise log" + habitEntry);
    if (habitEntry) {
      if (habitEntry.details) {
        setNotes(habitEntry.details.notes);
        setDuration(habitEntry.details.duration);
        if (habitEntry.details.distance) {
          setDistance(habitEntry.details.distance);
        }
      }
    }
  }, [habitEntry]);

  return (
    <View style={{ alignItems: "center" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 10,
        }}>
        <View>
          <Text style={styles.label}>Duration (min)</Text>
          <TextInput
            onChangeText={setDuration}
            value={duration}
            style={styles.input}
            maxLength={3}
            keyboardType="numeric"
          />
        </View>
        {habitEntry.details.distance && (
          <View>
            <Text style={styles.label}>Distance (km)</Text>
            <TextInput
              onChangeText={setDistance}
              value={distance}
              style={styles.input}
              maxLength={3}
              keyboardType="numeric"
            />
          </View>
        )}
      </View>

      <View
        style={{
          marginTop: 32,
          backgroundColor: Colors.primaryBackgroundLight,
          width: deviceWidth * 0.7,
          height: deviceHeight * 0.25,
          borderRadius: 32,
          marginBottom: 12,
          overflow: "hidden",
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
      <Button
        onPress={() =>
          onLog({
            notes: notes,
            duration: duration,
            ...(distance !== undefined && { distance: distance }),
          })
        }>
        Save
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: Colors.primaryText,
    fontSize: 14,
    fontFamily: "robotomono-bold",
    paddingHorizontal: 12,
  },
  input: {
    backgroundColor: Colors.primaryGrey,
    padding: 14,
    borderRadius: 36,
    marginBottom: 4,
  },
});

export default ExerciseHabitLog;
