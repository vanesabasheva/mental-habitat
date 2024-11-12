import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
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
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../store/auth-context";
import { StatsContext } from "../../store/stats-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { EXPO_PUBLIC_API_URL } from "@env";
import CustomModal from "../../ui/Modal";
import NewAlcoholHabitForm from "../Habits/NewHabit/FormAlcohol";
import NewExerciseHabitForm from "../Habits/NewHabit/FormExercise";
import NewSmokingHabitForm from "../Habits/NewHabit/FormSmoking";
import NewDietHabitForm from "../Habits/NewHabit/FormDiet";
import { deviceWidth, deviceHeight } from "../../constants/Dimensions";
import SubstanceHabitLog from "./LogHabit/SubstanceHabitLog";
import DietHabitLog from "./LogHabit/DietHabitLog";
import ExerciseHabitLog from "./LogHabit/ExerciseHabitLog";
import {
  scheduleNotificationForHabit,
  cancelNotificationById,
} from "../../util/notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "../../ui/Toast";

const getNotificationId = (habitEntryId, day) => `habit-${habitEntryId}-${day}`;

const scheduleHabitReminder = async (
  habit,
  habitEntry,
  day,
  habitUnchecked
) => {
  const now = new Date();
  const reminderTime = new Date(day);
  reminderTime.setHours(20, 0, 0, 0);
  console.log(reminderTime);
  console.log(now);
  if (habitEntry) {
    if (now < reminderTime && (!habitEntry.isCompleted || habitUnchecked)) {
      const notificationId = getNotificationId(habitEntry._id, day);
      console.log("Scheduling notification.... " + notificationId);

      const answersString = await AsyncStorage.getItem("answers");
      const answersObj = JSON.parse(answersString);

      const title = `Reminder to complete your habit "${habit.title}" `;
      const body = `Remember why you want to do this!: ${answersObj[9]}`;
      const trigger = {
        hour: 20,
        minute: 0,
        repeats: false,
      };

      console.log(title);
      console.log(body);
      await scheduleNotificationForHabit(notificationId, title, body, trigger);
    }
  } else {
    console.log("No Notification needed to be scheduled.");
  }
};

function HabitItem({ habit, day, onDeleteHabit, onEditHabit }) {
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
  const [toast, setToast] = useState(false);
  const [toastText, setToastText] = useState("");
  const [toastIcon, setToastIcon] = useState(
    <MaterialCommunityIcons
      name="engine-outline"
      size={24}
      color={Colors.primaryBold}
    />
  );
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
      <Text
        adjustsFontSizeToFit={true}
        numberOfLines={1}
        style={[{ fontFamily: "robotomono-regular" }, checkedTextStyle]}>
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
        <Text
          adjustsFontSizeToFit={true}
          numberOfLines={1}
          style={[styles.daysOfWeekText, checkedTextStyle]}>
          {selectedDaysOfWeek.join(", ")}
        </Text>
        <Text
          adjustsFontSizeToFit={true}
          numberOfLines={1}
          style={[checkedTextStyle, { fontFamily: "robotomono-regular" }]}>
          Duration: {duration} min
        </Text>
        {distance ? (
          <Text
            adjustsFontSizeToFit={true}
            numberOfLines={1}
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
      <Text
        adjustsFontSizeToFit={true}
        numberOfLines={1}
        style={[{ fontFamily: "robotomono-regular" }, checkedTextStyle]}>
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
        <Text
          adjustsFontSizeToFit={true}
          numberOfLines={1}
          style={[styles.daysOfWeekText, checkedTextStyle]}>
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
      console.log(
        "Checking habit... " + EXPO_PUBLIC_API_URL + "/habits/habitEntry"
      );

      const response = await axios.patch(
        `${EXPO_PUBLIC_API_URL}/habits/habitEntry/${habitEntryId}`,
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
      // updatedStat: fuel, increment: increment
      setToastText(stats.increment);
      switch (stats.updatedStat) {
        case "engines":
          setToastIcon(
            <MaterialCommunityIcons
              name="engine-outline"
              size={24}
              color={Colors.primaryBold}
            />
          );
          break;
        case "energy":
          setToastIcon(
            <SimpleLineIcons
              name="energy"
              size={24}
              color={Colors.primaryBold}
            />
          );

          break;
        case "grip":
          setToastIcon(
            <FontAwesome5
              name="grip-lines"
              size={24}
              color={Colors.primaryBold}
            />
          );
          break;
        case "fuel":
          setToastIcon(
            <MaterialCommunityIcons
              name="fuel"
              size={24}
              color={Colors.primaryBold}
            />
          );
          break;

        default:
          break;
      }
      setToast(true);
      const notificationId = getNotificationId(habitEntry._id, day);

      await cancelNotificationById(notificationId);
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
        `${EXPO_PUBLIC_API_URL}/habits/habitEntry/${habitEntryId}`,
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

      setToastText(stats.increment);
      switch (stats.updatedStat) {
        case "engines":
          setToastIcon(
            <MaterialCommunityIcons
              name="engine-outline"
              size={24}
              color={Colors.primaryBold}
            />
          );
          break;
        case "energy":
          setToastIcon(
            <SimpleLineIcons
              name="energy"
              size={24}
              color={Colors.primaryBold}
            />
          );

          break;
        case "grip":
          setToastIcon(
            <FontAwesome5
              name="grip-lines"
              size={24}
              color={Colors.primaryBold}
            />
          );
          break;
        case "fuel":
          setToastIcon(
            <MaterialCommunityIcons
              name="fuel"
              size={24}
              color={Colors.primaryBold}
            />
          );
          break;

        default:
          break;
      }
      setToast(true);

      //await scheduleHabitReminder(habitEntry, day, true);
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
      let habitEntry;
      try {
        const response = await axios.get(
          EXPO_PUBLIC_API_URL + "/habits/habitEntry",
          {
            params: {
              habitId: habit._id,
              day: day,
            },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        //TODO: optimize setting of properties in states, one state is enough
        habitEntry = response.data;
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
              EXPO_PUBLIC_API_URL + "/habits/habitEntry",
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
      await scheduleHabitReminder(habit, habitEntry, day, false);
    };

    fetchHabitEntryForDay();
    return () => {
      // This will cancel the notification when the component unmounts or if the habit gets completed
      const notificationId = getNotificationId(habitEntry._id, day);
      cancelNotificationById(notificationId);
    };
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
    console.log(_id);
    try {
      const response = await axios.put(
        `${EXPO_PUBLIC_API_URL}/habits/${_id}`,

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
    await onEditHabit();
    setModalVisible(false);
  }

  async function updateHabitEntry(details) {
    console.log(details);
    try {
      const response = await axios.patch(
        `${EXPO_PUBLIC_API_URL}/habits/habitEntry/${habitEntryId}`,
        {
          habitId: habit._id,
          updates: details,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(response.data);
      statsCtx.setAllStats((prevState) => ({
        ...prevState,
        lastUpdated: Date.now(),
      }));
      setHabitEntry(response.data.habitEntry);
      setLogModalVisible(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {toast && <Toast setToast={setToast} icon={toastIcon} text={toastText} />}
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
                <View
                  style={{ position: "absolute", right: deviceWidth * 0.06 }}>
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
            description={
              "Try to frame your habit as a small achievable action "
            }
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}>
            <ScrollView
              contentContainerStyle={{
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
            </ScrollView>
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
    </>
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
