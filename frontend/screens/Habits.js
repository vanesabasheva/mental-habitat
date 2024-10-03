import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { Colors } from "../constants/Colors";
import Button from "../ui/Button";

import { useContext, useEffect, useState } from "react";
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
import { deviceHeight, deviceWidth } from "../constants/Dimensions";
import axios from "axios";
import { AuthContext } from "../store/auth-context";
import { BACKEND_URL } from "@env";

const emulatorBaseURL = "http://10.0.2.2:3000/habits";
const backendURL = BACKEND_URL + "/habits";

function HabitsScreen() {
  const { token } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);

  // Habits State Management
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [habitsForDate, setHabitsForDate] = useState(null);

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

  async function saveHabit(habitObject) {
    try {
      const response = await axios.post(backendURL, habitObject, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchHabits();

      setModalVisible(false);
    } catch (error) {
      console.log("Error saving habit: " + error);
    }
  }

  async function deleteHabitHandler(id) {
    console.log(id);
    try {
      const response = await axios.delete(`${backendURL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHabitsForDate((prevHabits) => {
        const filteredHabits = prevHabits[selectedDate].filter(
          (item) => item._id !== id
        );
        return { [selectedDate]: filteredHabits };
      });
    } catch (error) {
      console.log("could not delete habit " + id);
      console.log(error);
    }
  }

  async function editHabitHandler(habit) {
    console.log(habit);
  }

  const fetchHabits = async () => {
    console.log("Fetching habits... " + backendURL);
    try {
      const response = await axios.get(`${backendURL}/${selectedDate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHabitsForDate({ [selectedDate]: response.data.habits });
    } catch (error) {
      console.log(error);
    }
  };

  ////////////
  // Hooks //
  ///////////
  useEffect(() => {
    fetchHabits();
  }, [selectedDate]);

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

        <WeeklyAgenda
          habitsForDate={habitsForDate}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          onDeleteHabit={deleteHabitHandler}
          onEditHabit={editHabitHandler}
        />
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
