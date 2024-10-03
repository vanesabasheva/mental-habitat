import { Agenda } from "react-native-calendars";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Colors } from "../../constants/Colors";
import HabitItem from "../Habits/HabitItem";
import { useState } from "react";
import CustomModal from "../../ui/Modal";
import NewAlcoholHabitForm from "../Habits/NewHabit/FormAlcohol";
import NewExerciseHabitForm from "../Habits/NewHabit/FormExercise";
import NewSmokingHabitForm from "../Habits/NewHabit/FormSmoking";
import NewDietHabitForm from "../Habits/NewHabit/FormDiet";
import IconButton from "../../ui/ButtonIcon";
import { deviceHeight, deviceWidth } from "../../constants/Dimensions";
import SmokingIcon from "../../assets/svgs/HabitsIcons/SmokingIcon.svg";
import WorkoutIcon from "../../assets/svgs/HabitsIcons/WorkoutIcon.svg";
import AlcoholIcon from "../../assets/svgs/HabitsIcons/AlcoholIcon.svg";
import DietIcon from "../../assets/svgs/HabitsIcons/DietIcon.svg";

function WeeklyAgenda({
  habitsForDate,
  selectedDate,
  setSelectedDate,
  onDeleteHabit,
  onEditHabit,
}) {
  const CALENDAR_THEME = {
    calendarBackground: Colors.primaryBackgroundLight,
    textSectionTitleColor: "#b6c1cd", //color of Mon, Tue, Wed ...
    textSectionTitleDisabledColor: Colors.primaryBackgroundLight,
    selectedDayBackgroundColor: Colors.primaryGrey,
    selectedDayTextColor: Colors.primaryText,
    todayTextColor: Colors.primaryText,
    dayTextColor: "#2d4150",
    textDisabledColor: Colors.primaryGrey, //last and next month color
    dotColor: "white", // other days, if there are any items
    selectedDotColor: "white", // today, if there are any items
    arrowColor: "orange",
    disabledArrowColor: Colors.primaryGrey,
    monthTextColor: Colors.primaryBold,
    indicatorColor: Colors.primaryGrey,
    textDayFontFamily: "robotomono-regular",
    textMonthFontFamily: "robotomono-bold",
    textDayHeaderFontFamily: "robotomono-regular",
    textDayFontWeight: "300",
    textMonthFontWeight: "bold",
    textDayHeaderFontWeight: "300",
    textDayFontSize: 14,
    textMonthFontSize: 14,
    textDayHeaderFontSize: 14,
    reservationsBackgroundColor: Colors.primaryBackgroundLight,
    agendaKnobColor: Colors.primaryGrey,
  };

  const [currentHabit, setCurrentHabit] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Specify how each date should be rendered. day can be undefined if the item is not first in that day
  const renderEmptyDay = () => {
    return <View styles={{ backgroundColor: Colors.primaryBackgroundLight }} />;
  };

  function openEditModal(habit) {
    setCurrentHabit(habit);
    setModalVisible(true);
  }

  function editHabitHandler(habit) {
    onEditHabit(habit);
    setModalVisible(false);
  }

  async function deleteHabitHandler(id) {
    onDeleteHabit(id);
    setModalVisible(false);
  }

  ///////////////////////////////////////////////
  // Set the EDIT HABIT FORM based on category //
  ///////////////////////////////////////////////
  let habitForm;
  let icon;
  if (currentHabit) {
    switch (currentHabit.category) {
      case "Smoking":
        habitForm = (
          <NewSmokingHabitForm
            buttonLabel="Update Habit"
            habit={currentHabit}
            onAddNewHabit={editHabitHandler}
          />
        );
        icon = (
          <SmokingIcon width={deviceWidth * 0.2} height={deviceWidth * 0.2} />
        );
        break;

      case "Exercise":
        habitForm = (
          <NewExerciseHabitForm
            buttonLabel="Update Habit"
            habit={currentHabit}
            onAddNewHabit={editHabitHandler}
          />
        );
        icon = (
          <WorkoutIcon width={deviceWidth * 0.2} height={deviceWidth * 0.2} />
        );
        break;

      case "Alcohol":
        habitForm = (
          <NewAlcoholHabitForm
            buttonLabel="Update Habit"
            habit={currentHabit}
            onAddNewHabit={editHabitHandler}
          />
        );
        icon = (
          <AlcoholIcon width={deviceWidth * 0.25} height={deviceWidth * 0.25} />
        );
        break;

      case "Diet":
        habitForm = (
          <NewDietHabitForm
            buttonLabel="Update Habit"
            habit={currentHabit}
            onAddNewHabit={editHabitHandler}
          />
        );
        icon = (
          <DietIcon width={deviceWidth * 0.2} height={deviceWidth * 0.2} />
        );
        break;
      default:
        habitForm = <Text>Invalid Habit Category</Text>;
        break;
    }
  }

  //returns card for empty slots.
  const renderEmptyItem = () => {
    return (
      <View style={styles.container}>
        <Text>No habits for today</Text>
      </View>
    );
  };

  // Specify how each item should be rendered in the agenda
  const renderItems = (item, firstItemInDay) => {
    console.log(selectedDate);
    return (
      <TouchableOpacity onPress={() => openEditModal(item)}>
        <HabitItem habit={item} day={selectedDate} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
      <View
        style={{
          height: deviceHeight / 1.5,
          backgroundColor: Colors.primaryBackgroundLight,
        }}>
        <Agenda
          firstDay={1}
          items={habitsForDate}
          // Callback that gets called on day press
          onDayPress={(day) => {
            const formattedMonth = String(day.month).padStart(2, "0"); // Ensures the month is two digits
            const formattedDay = String(day.day).padStart(2, "0"); // Ensures the day is two digits
            const formattedDate = `${day.year}-${formattedMonth}-${formattedDay}`;
            setSelectedDate(formattedDate);
          }}
          renderDay={renderEmptyDay}
          renderEmptyData={renderEmptyItem}
          renderItem={renderItems}
          scrollEnabled={false}
          selected={selectedDate} //Initially selected day
          hideKnob={false} // Hide knob button. Default = false
          showClosingKnob // When `true` and `hideKnob` prop is `false`, the knob will always be visible and the user will be able to drag the knob up and close the calendar. Default = false
          theme={{
            ...CALENDAR_THEME,
          }}
        />
      </View>
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
              deleteHabitHandler(currentHabit._id);
            }}
          />
        </View>
      </CustomModal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
});
export default WeeklyAgenda;
