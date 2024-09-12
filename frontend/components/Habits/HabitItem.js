import { View, Text, StyleSheet } from "react-native";
import IconButton from "../../ui/ButtonIcon";
import { Colors } from "../../constants/Colors";
import SmokingIcon from "../../assets/svgs/SmokingIcon.svg";
import TestSvg from "../../assets/svgs/test.svg";

function HabitItem({
  icon,
  title,
  daysOfTheWeek,
  description,
  onLogHabit,
  onDeleteHabitLog,
  category,
}) {
  let descriptionBasedOnCategory = <Text>Default description</Text>;
  let habitCategoryColor = Colors.primaryLight;
  let buttonCategoryColorGreyed = Colors.primaryGrey;
  let buttonCategoryColor = Colors.primaryBold;

  if (category) {
    descriptionBasedOnCategory = (
      <Text>Description will be different based on the category</Text>
    );
    habitCategoryColor = "the background color will be different too!!";
  }

  return (
    <View style={[styles.container, { backgroundColor: habitCategoryColor }]}>
      <View>
        {/* <Text>Icon</Text> */}

        <SmokingIcon width={60} height={60} />
      </View>
      <View style={{ gap: 8 }}>
        <View>
          <Text style={styles.title}>Long title of goal</Text>
          <Text style={styles.daysOfWeekText}>Mo, Tu, We, Th, Fr</Text>
        </View>
        {descriptionBasedOnCategory}
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
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    //backgroundColor: habitCategoryColor,
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
  },
});

export default HabitItem;
