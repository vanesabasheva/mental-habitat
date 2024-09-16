import { View, Text, StyleSheet } from "react-native";
import IconButton from "../../ui/ButtonIcon";
import { Colors } from "../../constants/Colors";
import SmokingIcon from "../../assets/svgs/HabitsIcons/SmokingIcon.svg";
import YogaIcon from "../../assets/svgs/HabitsIcons/YogaIcon.svg";
import WalkingIcon from "../../assets/svgs/HabitsIcons/WalkingIcon.svg";
import CyclingIcon from "../../assets/svgs/HabitsIcons/CyclingIcon.svg";
import SwimmingIcon from "../../assets/svgs/HabitsIcons/SwimmingIcon.svg";
import WeightliftingIcon from "../../assets/svgs/HabitsIcons/WeightliftingIcon.svg";
import RunningIcon from "../../assets/svgs/HabitsIcons/RunningIcon.svg";
import AlcoholIcon from "../../assets/svgs/HabitsIcons/AlcoholIcon.svg";
import DietIcon from "../../assets/svgs/HabitsIcons/DietIcon.svg";

function HabitItem({ onLogHabit, onDeleteHabitLog, habit }) {
  const {
    title,
    numberOfCigarettes,
    duration,
    distance,
    numberOfDrinks,
    habitType,
    selectedDaysOfWeek,
    category,
  } = habit;

  let descriptionBasedOnCategory;
  let habitCategoryColor;
  let buttonCategoryColorGreyed = Colors.primaryGrey;
  let buttonCategoryColor = Colors.primaryBold;
  let icon;

  if (category === "Smoking") {
    let text = "Cigarettes/day";
    if (numberOfCigarettes == "1") {
      text = "Cigarette/day";
    }
    descriptionBasedOnCategory = (
      <Text>
        {numberOfCigarettes} {text}
      </Text>
    );
    habitCategoryColor = Colors.primarySmoking;
    icon = <SmokingIcon width={60} height={60} />;
  } else if (category === "Exercise") {
    descriptionBasedOnCategory = (
      <View>
        <Text style={styles.daysOfWeekText}>
          {selectedDaysOfWeek.join(", ")}
        </Text>
        <Text>Duration: {duration} min</Text>
        {distance ? <Text>Distance: {distance} km</Text> : null}
      </View>
    );
    habitCategoryColor = Colors.primaryExercise;

    switch (title) {
      case "Running":
        icon = <RunningIcon width={60} height={60} />;
        break;
      case "Walking":
        icon = <WalkingIcon width={60} height={60} />;
        break;
      case "Cycling":
        icon = <CyclingIcon width={60} height={60} />;
      case "Swimming":
        icon = <SwimmingIcon width={60} height={60} />;
        break;
      case "Yoga":
        icon = <YogaIcon width={60} height={60} />;
        break;
      case "Weight Training":
        icon = <WeightliftingIcon width={60} height={60} />;
        break;
    }
  } else if (category === "Alcohol") {
    let text = "Drinks/day";
    if (numberOfDrinks == "1") {
      text = "Drink/day";
    }
    descriptionBasedOnCategory = (
      <Text>
        {numberOfDrinks} {text}
      </Text>
    );
    habitCategoryColor = Colors.primaryAlcohol;
    icon = <AlcoholIcon width={80} height={60} />;
  } else if (category === "Diet") {
    descriptionBasedOnCategory = (
      <View>
        <Text style={styles.daysOfWeekText}>
          {selectedDaysOfWeek.join(", ")}
        </Text>
      </View>
    );
    habitCategoryColor = Colors.primaryDiet;
    icon = <DietIcon width={60} height={60} />;
  }

  return (
    <View style={{ backgroundColor: Colors.primaryBackgroundLight }}>
      <View style={[styles.container, { backgroundColor: habitCategoryColor }]}>
        <View>{icon}</View>
        <View style={{ gap: 8 }}>
          <View>
            <Text style={styles.title}>{title}</Text>
            {descriptionBasedOnCategory}
          </View>
        </View>
        <View style={styles.container}>
          <IconButton
            icon="remove-circle-outline"
            size={34}
            color={buttonCategoryColorGreyed}
            onPress={onDeleteHabitLog}
          />
          <IconButton
            icon="add-circle"
            size={34}
            color={buttonCategoryColor}
            onPress={onLogHabit}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 32,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  daysOfWeekText: {
    fontSize: 10,
    marginBottom: 6,
  },
});

export default HabitItem;
