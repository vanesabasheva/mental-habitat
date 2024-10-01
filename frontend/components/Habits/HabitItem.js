import { View, Text, StyleSheet } from "react-native";
import IconButton from "../../ui/ButtonIcon";
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
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { deviceWidth } from "../../constants/Dimensions";

function HabitItem({ onLogHabit, onDeleteHabitLog, habit }) {
  const { title, details, habitType, selectedDaysOfWeek, category } = habit;

  const { numberOfCigarettes, duration, distance, numberOfDrinks } = details;

  const [isHabitChecked, setIsHabitChecked] = useState(false);

  let descriptionBasedOnCategory;
  let habitCategoryColor;
  let buttonCategoryColorGreyed = Colors.primaryGrey;
  let buttonCategoryColor = Colors.primaryBold;
  let icon;
  let checkedTextStyle;

  if (isHabitChecked) {
    checkedTextStyle = { color: "#999" };
  }

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

  const handleCheck = () => {
    setIsHabitChecked(true);
    try {
      //make an http post request to /habits/habitEntry
    } catch (error) {
      setIsHabitChecked(false);
    }
  };

  const handleUncheck = () => {
    setIsHabitChecked(false);
    try {
      // make an http delete request to /habits/habitEntry
    } catch (error) {
      setIsHabitChecked(true);
    }
  };

  // Function to toggle the checked state
  const toggleCheckbox = () => {
    if (isHabitChecked) {
      handleUncheck();
    } else {
      handleCheck();
    }
  };

  return (
    <View style={{ backgroundColor: Colors.primaryBackgroundLight }}>
      <View style={[styles.container, { backgroundColor: habitCategoryColor }]}>
        <View>{icon}</View>
        <View style={{ gap: 8, maxWidth: "40%" }}>
          <View>
            <Text style={[styles.title, checkedTextStyle]}>{title}</Text>
            {descriptionBasedOnCategory}
          </View>
        </View>
        <View style={styles.container}>
          {/* <IconButton
            icon="add-circle"
            size={34}
            color={buttonCategoryColor}
            onPress={onLogHabit}
          /> */}
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
    </View>
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
