import { View, Text, StyleSheet } from "react-native";
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
import { useContext, useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { deviceWidth } from "../../constants/Dimensions";
import { AuthContext } from "../../store/auth-context";
import { StatsContext } from "../../store/stats-context";
import axios from "axios";
import { BACKEND_URL } from "@env";

function HabitItem({ habit, day }) {
  const { title, details, habitType, selectedDaysOfWeek, category } = habit;
  const { numberOfCigarettes, duration, distance, numberOfDrinks } = details;
  const authCtx = useContext(AuthContext);
  const statsCtx = useContext(StatsContext);
  const [isHabitChecked, setIsHabitChecked] = useState(false);
  const [habitEntryId, setHabitEntryId] = useState();
  const token = authCtx.token;

  let descriptionBasedOnCategory;
  let habitCategoryColor;
  let buttonCategoryColorGreyed = Colors.primaryGrey;
  let buttonCategoryColor = Colors.primaryBold;
  let icon;
  let checkedTextStyle;

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
      console.log(day);
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
      console.log(habitEntry);
      setHabitEntryId(habitEntry._id);

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
      const response = await axios.delete(
        BACKEND_URL + "/habits/habitEntry/" + habitEntryId,
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

  // Function to toggle the checked state
  const toggleCheckbox = () => {
    if (isHabitChecked) {
      handleUncheck();
    } else {
      handleCheck();
    }
  };

  useEffect(() => {
    console.log(
      "Fetching log for the day initiated..." +
        BACKEND_URL +
        "/habits/habitEntry"
    );
    const fetchHabitEntryForDay = async () => {
      try {
        const response = await axios.get(BACKEND_URL + "/habits/habitEntry", {
          params: {
            habitId: habit._id,
            day: day,
          },
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Response entry id: " + JSON.stringify(response.data._id));
        setHabitEntryId(response.data._id);
        setIsHabitChecked(true);
        if (response.data) {
          console.log("Success");
        }
        // setHabitEntryId(habitEntry)
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Handle 404 specifically

          console.log("Habit entry not found.");
        } else {
          // Handle other errors
          console.error("An error occurred:", error.message);
        }
      }
    };

    fetchHabitEntryForDay();
  }, []);

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
