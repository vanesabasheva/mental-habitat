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

const SPORT_ACTIVITIES = [
  "Running",
  "Walking",
  "Cycling",
  "Swimming",
  "Weight Training",
  "Yoga",
];
function NewExerciseHabitForm({ onAddNewHabit }) {
  const [selectedActivity, setSelectedActivity] = useState("Select Activity");
  const [duration, setDuration] = useState("0");
  const [distance, setDistance] = useState();
  const [selectedDays, setSelectedDays] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [errors, setErrors] = useState({
    activityError: null,
    durationError: null,
    distanceError: null,
    daysError: null,
  });

  function selectedDaysHandler(days) {
    const selectedDayNames = days.map((index) => WEEK_DAYS[index]);
    setSelectedDays(selectedDayNames);
  }

  function addNewHabitHandler() {
    let errorWithDistance = null;
    if (
      selectedActivity === "Running" ||
      selectedActivity === "Cycling" ||
      selectedActivity === "Swimming" ||
      selectedActivity === "Walking"
    ) {
      errorWithDistance =
        distance === "0" ? "Diistance for activity required." : null;
    }
    const newErrors = {
      activityError:
        selectedActivity === "Select Activity" ? "Activity required." : null,
      durationError:
        duration === "0" ? "Duration for activity required." : null,
      distanceError: errorWithDistance,
      daysError: selectedDays.length == 0 ? "Days of the week required" : null,
    };

    // Set all errors at once
    setErrors(newErrors);

    // Check if any errors exist before submitting
    if (Object.values(newErrors).some((error) => error !== null)) {
      return;
    }

    const habit = {
      title: selectedActivity,
      duration: duration,
      distance: distance,
      selectedDaysOfWeek: selectedDays,
      category: "Exercise",
    };
    onAddNewHabit(habit);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Activity</Text>
      <Button
        newStyles={{
          backgroundColor: Colors.primaryBackground,
          elevation: 0,
          shadowOpacity: 0,
        }}
        textStyles={[styles.label, { textAlign: "left" }]}
        onPress={() => setModalVisible(true)}>
        {selectedActivity}
      </Button>

      {errors.activityError && (
        <Text style={styles.errorText}>{errors.activityError}</Text>
      )}

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Picker
              selectedValue={selectedActivity}
              onValueChange={(itemValue, itemIndex) => {
                setSelectedActivity(itemValue);
              }}
              style={styles.picker}>
              {SPORT_ACTIVITIES.map((sport) => (
                <Picker.Item label={sport} value={sport} key={sport} />
              ))}
            </Picker>
            <Button
              textStyles={{ fontFamily: "robotomono-bold" }}
              onPress={() => setModalVisible(false)}>
              Select Activity
            </Button>
          </View>
        </View>
      </Modal>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          <Text style={styles.label}>Duration (min)</Text>
          <TextInput
            onChangeText={setDuration}
            value={duration}
            style={styles.input}
            maxLength={3}
            keyboardType="numeric"
          />

          {errors.durationError && (
            <Text style={styles.errorText}>{errors.durationError}</Text>
          )}
        </View>
        {(selectedActivity === "Running" ||
          selectedActivity === "Cycling" ||
          selectedActivity === "Swimming" ||
          selectedActivity === "Walking") && (
          <View>
            <Text style={styles.label}>Distance (km)</Text>
            <TextInput
              onChangeText={setDistance}
              value={distance}
              style={styles.input}
              maxLength={3}
              keyboardType="numeric"
            />

            {errors.distanceError && (
              <Text style={styles.errorText}>{errors.distanceError}</Text>
            )}
          </View>
        )}
      </View>
      <View>
        <Text style={styles.label}>Days of the week</Text>
        <SelectWeekDays onChange={selectedDaysHandler} />
        {errors.daysError && (
          <Text style={styles.errorText}>{errors.daysError}</Text>
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
        Add
      </Button>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    borderRadius: 42,
    backgroundColor: Colors.primaryBackgroundLight,
    //height: Dimensions.get("window").height / 3.5,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    height: Dimensions.get("window").height / 3,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  picker: {
    width: 250,
    //height: 44,
  },
  label: {
    color: Colors.primaryText,
    fontSize: 14,
    fontFamily: "robotomono-bold",
    paddingHorizontal: 12,
  },

  input: {
    backgroundColor: Colors.primaryBackground,
    padding: 14,
    borderRadius: 36,
    marginBottom: 4,
    width: Dimensions.get("window").width / 3,
    //textAlign: "center",
  },
  errorText: {
    color: Colors.error500,
    fontFamily: "robotomono-regular",
    fontSize: 8,
    paddingHorizontal: 16,
  },
});
export default NewExerciseHabitForm;
