import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  Modal,
  Pressable,
} from "react-native";
import { Colors } from "../constants/Colors";
import Button from "../ui/Button";

import { useState } from "react";
import WeeklyAgenda from "../components/Calendar/WeeklyCalendar";
import MonthlyCalendar from "../components/Calendar/MonthlyCalendar";
import HabitsList from "../components/Habits/HabitsList";
import { Ionicons } from "@expo/vector-icons";
import NewGoalIcon from "../assets/svgs/NewGoalIcon.svg";

function HabitsScreen() {
  const [selectedDate, setSelectedDate] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

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
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Pressable
                  style={({ pressed }) => (pressed ? [{ opacity: 0.7 }] : null)}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Ionicons name="remove" size={32} color="black" />
                </Pressable>
                <NewGoalIcon width={160} height={160} />
                <Text style={styles.modalText}>Add a new habit</Text>
              </View>
            </View>
          </Modal>
        </View>

        <WeeklyAgenda />

        {/* <MonthlyCalendar /> */}
        <HabitsList />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "space-between",
    //alignItems: "center",
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
    height: Dimensions.get("window").height / 1.5,
    width: Dimensions.get("window").width,
    margin: 0,
    backgroundColor: "white",
    borderRadius: 20,
    paddingTop: 10,
    padding: 40,
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
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 24,
    fontFamily: "robotomono-bold",
  },
});

export default HabitsScreen;
