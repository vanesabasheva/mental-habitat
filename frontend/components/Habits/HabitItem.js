import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "../../constants/Colors";
import Checkbox from "react-native-community-checkbox";
import SmokingIcon from "../../assets/svgs/HabitsIcons/SmokingIcon.svg";
import YogaIcon from "../../assets/svgs/HabitsIcons/YogaIcon.svg";
import WalkingIcon from "../../assets/svgs/HabitsIcons/WalkingIcon.svg";
import CyclingIcon from "../../assets/svgs/HabitsIcons/CyclingIcon.svg";
import SwimmingIcon from "../../assets/svgs/HabitsIcons/SwimmingIcon.svg";
import WeightliftingIcon from "../../assets/svgs/HabitsIcons/WeightliftingIcon.svg";
import RunningIcon from "../../assets/svgs/HabitsIcons/RunningIcon.svg";
import AlcoholIcon from "../../assets/svgs/HabitsIcons/AlcoholIcon.svg";
import DietIcon from "../../assets/svgs/HabitsIcons/DietIcon.svg";
import IconButton from "../../ui/ButtonIcon";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../store/auth-context";
import { StatsContext } from "../../store/stats-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { BACKEND_URL } from "@env";
import CustomModal from "../../ui/Modal";
import NewAlcoholHabitForm from "../Habits/NewHabit/FormAlcohol";
import NewExerciseHabitForm from "../Habits/NewHabit/FormExercise";
import NewSmokingHabitForm from "../Habits/NewHabit/FormSmoking";
import NewDietHabitForm from "../Habits/NewHabit/FormDiet";
import { deviceWidth, deviceHeight } from "../../constants/Dimensions";
import SubstanceHabitLog from "./LogHabit/SubstanceHabitLog";
import DietHabitLog from "./LogHabit/DietHabitLog";
import ExerciseHabitLog from "./LogHabit/ExerciseHabitLog";

function HabitItem({ habit, day, onDeleteHabit }) {
  const { _id, title, details, habitType, selectedDaysOfWeek, category } =
    habit;
  const { numberOfCigarettes, duration, distance, numberOfDrinks } = details;
  const authCtx = useContext(AuthContext);
  const statsCtx = useContext(StatsContext);
  const [isHabitChecked, setIsHabitChecked] = useState(false);
  const [habitEntryId, setHabitEntryId] = useState();
  const [habitEntry, setHabitEntry] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [logModalVisible, setLogModalVisible] = useState(false);
  const token = authCtx.token;

  let descriptionBasedOnCategory;
  let habitCategoryColor;
  let icon;
  let checkedTextStyle = "grey";

  if (isHabitChecked) {
    checkedTextStyle = { color: "#999" };
  }

  // Set descriptions of each habit based on category
  if (category === "Smoking") {
    let text = "Cigarettes/day";
    if (numberOfCigarettes == "1") {
      text = "Cigarette/day";
    }
    descriptionBasedOnCategory = (
      <Text style={[{ fontFamily: "robotomono-regular" }, checkedTextStyle]}>
        {numberOfCigarettes} {text}
      </Text>
    );
    habitCategoryColor = Colors.primarySmoking;
    icon = (
      <SmokingIcon
        style={{ opacity: isHabitChecked ? 0.5 : 1 }}
        width={60}
        height={60}
      />
    );
  } else if (category === "Exercise") {
    descriptionBasedOnCategory = (
      <View>
        <Text style={[styles.daysOfWeekText, checkedTextStyle]}>
          {selectedDaysOfWeek.join(", ")}
        </Text>
        <Text style={[checkedTextStyle, { fontFamily: "robotomono-regular" }]}>
          Duration: {duration} min
        </Text>
        {distance ? (
          <Text
            style={[{ fontFamily: "robotomono-regular" }, checkedTextStyle]}>
            Distance: {distance} km
          </Text>
        ) : null}
      </View>
    );
    habitCategoryColor = Colors.primaryExercise;

    switch (title) {
      case "Running":
        icon = (
          <RunningIcon
            style={{ opacity: isHabitChecked ? 0.5 : 1 }}
            width={60}
            height={60}
          />
        );
        break;
      case "Walking":
        icon = (
          <WalkingIcon
            style={{ opacity: isHabitChecked ? 0.5 : 1 }}
            width={60}
            height={60}
          />
        );
        break;
      case "Cycling":
        icon = (
          <CyclingIcon
            style={{ opacity: isHabitChecked ? 0.5 : 1 }}
            width={60}
            height={60}
          />
        );
      case "Swimming":
        icon = (
          <SwimmingIcon
            style={{ opacity: isHabitChecked ? 0.5 : 1 }}
            width={60}
            height={60}
          />
        );
        break;
      case "Yoga":
        icon = (
          <YogaIcon
            style={{ opacity: isHabitChecked ? 0.5 : 1 }}
            width={60}
            height={60}
          />
        );
        break;
      case "Weight Training":
        icon = (
          <WeightliftingIcon
            style={{ opacity: isHabitChecked ? 0.5 : 1 }}
            width={60}
            height={60}
          />
        );
        break;
    }
  } else if (category === "Alcohol") {
    let text = "Drinks/day";
    if (numberOfDrinks == "1") {
      text = "Drink/day";
    }
    descriptionBasedOnCategory = (
      <Text style={[{ fontFamily: "robotomono-regular" }, checkedTextStyle]}>
        {numberOfDrinks} {text}
      </Text>
    );
    habitCategoryColor = Colors.primaryAlcohol;
    icon = (
      <AlcoholIcon
        style={{ opacity: isHabitChecked ? 0.5 : 1 }}
        width={80}
        height={60}
      />
    );
  } else if (category === "Diet") {
    descriptionBasedOnCategory = (
      <View>
        <Text style={[styles.daysOfWeekText, checkedTextStyle]}>
          {selectedDaysOfWeek.join(", ")}
        </Text>
      </View>
    );
    habitCategoryColor = Colors.primaryDiet;
    icon = (
      <DietIcon
        style={{ opacity: isHabitChecked ? 0.5 : 1 }}
        width={60}
        height={60}
      />
    );
  }

  if (isHabitChecked) {
    habitCategoryColor = "#DAD6DE";
    habitCategoryColor = Colors.greyLight;
  }

  const stylesCheckbox = {
    width: 32,
    height: 32,
    borderColor: "#B1AEB5",
    borderWidth: 1,
    borderRadius: 15,
    activeBackgroundColor: "rgba(60, 60, 60, 0.2)",
    inactiveBackgroundColor: "rgba(255, 255, 255, 0.5)",
    fillPercentage: 100, // Percentage of the checkbox that is filled when checked
  };

  const handleCheck = async () => {
    setIsHabitChecked(true);
    try {
      console.log("Checking habit... " + BACKEND_URL + "/habits/habitEntry");
      const response = await axios.patch(
        `${BACKEND_URL}/habits/habitEntry/${habitEntryId}`,
        {
          habitId: habit._id,
          updates: {
            isCompleted: true,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(response.data);
      const stats = response.data.stats;
      statsCtx.incrementStat(stats.updatedStat, stats.increment);
    } catch (error) {
      console.log(error);
      setIsHabitChecked(false);
    }
  };

  const handleUncheck = async () => {
    setIsHabitChecked(false);
    try {
      console.log(habit._id);
      const response = await axios.patch(
        `${BACKEND_URL}/habits/habitEntry/${habitEntryId}`,
        {
          habitId: habit._id,
          updates: {
            isCompleted: false,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);
      const stats = response.data.stats;
      statsCtx.incrementStat(stats.updatedStat, stats.increment);
    } catch (error) {
      console.log(error);
      setIsHabitChecked(true);
    }
  };

  const toggleCheckbox = () => {
    if (isHabitChecked) {
      handleUncheck();
    } else {
      handleCheck();
    }
  };

  useEffect(() => {
    const fetchHabitEntryForDay = async () => {
      try {
        const response = await axios.get(BACKEND_URL + "/habits/habitEntry", {
          params: {
            habitId: habit._id,
            day: day,
          },
          headers: { Authorization: `Bearer ${token}` },
        });

        //TODO: optimize setting of properties in states, one state is enough
        const habitEntry = response.data;
        setHabitEntryId(habitEntry._id);
        setHabitEntry(habitEntry);
        setIsHabitChecked(habitEntry.isCompleted);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Handle 404 specifically
          console.log(`No habit entry for this day ${day}.`);
          console.log("Creating habit entry for day...");
          try {
            const response = await axios.post(
              BACKEND_URL + "/habits/habitEntry",
              {
                habitId: habit._id,
                day: day,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            console.log(response.data);
            const habitEntry = response.data.habitEntry;
            setHabitEntry(habitEntry);
            setHabitEntryId(habitEntry._id);
          } catch (error) {}
        } else {
          // Handle other errors
          console.error("An error occurred:", error.message);
        }
      }
    };

    fetchHabitEntryForDay();
  }, []);

  const openModal = () => {
    setModalVisible(true);
  };

  function openLogModal() {
    setLogModalVisible(true);
  }

  ///////////////////////////////////////////////
  // Set the EDIT & LOG HABIT FORM based on category //
  ///////////////////////////////////////////////
  let habitForm;
  let logHabitForm;
  if (habit) {
    switch (habit.category) {
      case "Smoking":
        habitForm = (
          <NewSmokingHabitForm
            buttonLabel="Update Habit"
            habit={habit}
            onAddNewHabit={editHabitHandler}
          />
        );
        logHabitForm = (
          <SubstanceHabitLog
            habitEntry={habitEntry}
            mode="Smoking"
            onLog={updateHabitEntry}
          />
        );
        break;

      case "Exercise":
        habitForm = (
          <NewExerciseHabitForm
            buttonLabel="Update Habit"
            habit={habit}
            onAddNewHabit={editHabitHandler}
          />
        );

        logHabitForm = (
          <ExerciseHabitLog habitEntry={habitEntry} onLog={updateHabitEntry} />
        );

        break;

      case "Alcohol":
        habitForm = (
          <NewAlcoholHabitForm
            buttonLabel="Update Habit"
            habit={habit}
            onAddNewHabit={editHabitHandler}
          />
        );
        logHabitForm = (
          <SubstanceHabitLog
            habitEntry={habitEntry}
            mode="Alcohol"
            onLog={updateHabitEntry}
          />
        );
        break;

      case "Diet":
        habitForm = (
          <NewDietHabitForm
            buttonLabel="Update Habit"
            habit={habit}
            onAddNewHabit={editHabitHandler}
          />
        );
        logHabitForm = (
          <DietHabitLog habitEntry={habitEntry} onLog={updateHabitEntry} />
        );

        break;
      default:
        habitForm = <Text>Invalid Habit Category</Text>;
        break;
    }
  }

  async function deleteHabitHandler(id) {
    onDeleteHabit(id);
    setModalVisible(false);
  }

  async function editHabitHandler(habit) {
    const { ...updateData } = habit;
    console.log("Starting editing habit..." + JSON.stringify(updateData));
    console.log(habit._id);
    try {
      const response = await axios.put(
        `${BACKEND_URL}/habits/${_id}`,

        updateData,

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Update Successful", response.data);
    } catch (error) {
      console.error("Failed to update habit", error);
    }
    console.log("Editing habit" + JSON.stringify(habit));
    setModalVisible(false);
  }

  async function updateHabitEntry(details) {
    console.log(details);
    try {
      const response = await axios.patch(
        `${BACKEND_URL}/habits/habitEntry/${habitEntryId}`,
        {
          habitId: habit._id,
          updates: details,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(response.data);
      setHabitEntry(response.data.habitEntry);
      setLogModalVisible(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <TouchableOpacity onPress={() => openLogModal(habit)}>
      <View style={{ backgroundColor: Colors.primaryBackgroundLight }}>
        <View
          style={[styles.container, { backgroundColor: habitCategoryColor }]}>
          <View
            style={{
              position: "absolute",
              padding: 10,
              top: 18,
              borderRadius: 50,
            }}>
            <IconButton
              icon="create-outline"
              size={24}
              color={isHabitChecked ? Colors.primaryGrey : "grey"}
              onPress={openModal}
            />
          </View>
          <View style={{ marginLeft: 32 }}>{icon}</View>
          <View style={{ gap: 8, maxWidth: "40%" }}>
            <View>
              <Text style={[styles.title, checkedTextStyle]}>{title}</Text>
              {descriptionBasedOnCategory}
            </View>
          </View>
          <View style={styles.container}>
            {isHabitChecked ? (
              <View style={{ position: "absolute", right: deviceWidth * 0.06 }}>
                <Ionicons name="checkmark-outline" size={12} color="black" />
              </View>
            ) : null}
            <View style={{ borderRadius: 50, overflow: "hidden" }}>
              <Checkbox
                isChecked={isHabitChecked}
                setChecked={toggleCheckbox}
                styles={stylesCheckbox}
              />
            </View>
          </View>
        </View>

        {/* EDIT HABIT MODAL */}
        <CustomModal
          title={"Edit habit"}
          description={"Try to frame your habit as a small achievable action "}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              gap: deviceHeight * 0.025,
            }}>
            {icon}
            {habitForm}
            <IconButton
              icon={"trash"}
              color={Colors.primaryBold}
              size={24}
              onPress={() => {
                deleteHabitHandler(habit._id);
              }}
            />
          </View>
        </CustomModal>

        {/* LOG HABIT MODAL */}
        <CustomModal
          title={"Habit Log"}
          description={habit.title}
          modalVisible={logModalVisible}
          setModalVisible={setLogModalVisible}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              gap: deviceHeight * 0.025,
            }}>
            <View
              style={{
                backgroundColor: Colors.primaryBackgroundLight,
                width: deviceWidth * 0.7,
                alignItems: "center",
                justifyContent: "center",
                padding: 20,
                borderRadius: 32,
              }}>
              {icon}
            </View>
            {logHabitForm}
          </View>
        </CustomModal>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 32,
  },
  title: {
    //fontWeight: "bold",
    fontSize: 16,
    fontFamily: "robotomono-bold",
  },
  daysOfWeekText: {
    fontSize: 10,
    marginBottom: 6,
    fontFamily: "robotomono-regular",
  },
});

export default HabitItem;
