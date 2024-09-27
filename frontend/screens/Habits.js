import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { Colors } from "../constants/Colors";
import Button from "../ui/Button";

import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import WeeklyAgenda from "../components/Calendar/WeeklyCalendar";
import NewGoalIcon from "../assets/svgs/NewGoalIcon.svg";
import BackgroundStars from "../assets/svgs/BackgroundStarsSmall.svg";
import Sky from "../assets/svgs/Sky.svg";
import CategoryPicker from "../components/Habits/NewHabit/CategoryPicker";
import NewSmokingHabitForm from "../components/Habits/NewHabit/FormSmoking";
import NewExerciseHabitForm from "../components/Habits/NewHabit/FormExercise";
import NewAlcoholHabitForm from "../components/Habits/NewHabit/FormAlcohol";
import NewDietHabitForm from "../components/Habits/NewHabit/FormDiet";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
export const HABITS = [
  {
    id: 1,
    title: "Some Long Title",
    category: "Smoking",
    numberOfCigarettes: "1",
  },
  {
    id: 2,
    title: "Running",
    category: "Exercise",
    duration: "20",
    distance: "2",
    selectedDaysOfWeek: ["MO", "TU"],
  },
  {
    id: 3,
    title: "Yoga",
    category: "Exercise",
    duration: "35",
    selectedDaysOfWeek: ["WE"],
  },
];

function HabitsScreen() {
  const [selectedDate, setSelectedDate] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  function saveHabit(habitObject) {
    habitObject = { ...habitObject, id: Date.now() };
    HABITS.push(habitObject);

    setModalVisible(false);
  }

  const [currentForm, setCurrentForm] = useState(
    <NewSmokingHabitForm onAddNewHabit={saveHabit} />
  );
  function pickCategoryHandler(category) {
    switch (category) {
      case "Smoking":
        setCurrentForm(<NewSmokingHabitForm onAddNewHabit={saveHabit} />);
        break;
      case "Exercise":
        setCurrentForm(<NewExerciseHabitForm onAddNewHabit={saveHabit} />);
        break;
      case "Alcohol":
        setCurrentForm(<NewAlcoholHabitForm onAddNewHabit={saveHabit} />);
        break;
      case "Diet":
        setCurrentForm(<NewDietHabitForm onAddNewHabit={saveHabit} />);
        break;
      default:
        break;
    }
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Your mission</Text>
          <Button onPress={() => setModalVisible(true)}>&#43; New Habit</Button>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}>
            <ScrollView
              style={{ marginTop: deviceHeight / 6 }}
              automaticallyAdjustKeyboardInsets={true}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Pressable
                    style={({ pressed }) =>
                      pressed ? [{ opacity: 0.7 }] : null
                    }
                    onPress={() => setModalVisible(!modalVisible)}>
                    <Ionicons name="remove" size={32} color="black" />
                  </Pressable>
                  <View>
                    <BackgroundStars
                      width={160}
                      height={160}
                      style={{ transform: [{ rotate: "90deg" }] }}
                    />
                    <NewGoalIcon
                      style={{ position: "absolute" }}
                      width={160}
                      height={160}
                    />
                  </View>
                  <View>
                    <Sky
                      style={{
                        position: "absolute",
                        top: -deviceHeight / 9,
                        right: -deviceWidth / 12,
                      }}
                      width={deviceWidth}
                      height={deviceHeight / 2}
                    />
                    <Text style={styles.modalText}>Add a new habit</Text>
                    <CategoryPicker onPickedCategory={pickCategoryHandler} />
                    {currentForm}
                  </View>
                </View>
              </View>
            </ScrollView>
          </Modal>
        </View>

        <WeeklyAgenda habits={HABITS} />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackgroundLight,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 24,
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontFamily: "robotomono-bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    //marginTop: 22,
  },
  modalView: {
    height: deviceHeight / 1.2,
    width: deviceWidth,
    margin: 0,
    backgroundColor: "white",
    borderRadius: 20,
    paddingTop: 10,
    paddingHorizontal: 40,
    alignItems: "center",
    shadowColor: "#333",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "robotomono-regular",
  },
  modalText: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 24,
    fontFamily: "robotomono-bold",
  },
});

export default HabitsScreen;
