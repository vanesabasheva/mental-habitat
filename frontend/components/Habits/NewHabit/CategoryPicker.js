import { View, StyleSheet, Dimensions, Text } from "react-native";
import { Colors } from "../../../constants/Colors";
import Button from "../../../ui/Button";
import { deviceHeight } from "../../../constants/Dimensions";

const CATEGORIES = ["Smoking", "Exercise", "Alcohol", "Diet"];

function CategoryPicker({ onPickedCategory }) {
  function selectCategoryHandler(index) {
    const newSelectedCategory = CATEGORIES[index];
    onPickedCategory(newSelectedCategory);
  }
  return (
    <View style={styles.conainer}>
      <Text style={styles.title}>Categories</Text>
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => selectCategoryHandler(0)}
          newStyles={{
            backgroundColor: Colors.primarySmoking,
            width: Dimensions.get("window").width / 3,
          }}
          textStyles={styles.buttonText}>
          Smoking
        </Button>
        <Button
          onPress={() => selectCategoryHandler(1)}
          newStyles={{
            backgroundColor: Colors.primaryExercise,
            width: Dimensions.get("window").width / 3,
          }}
          textStyles={styles.buttonText}>
          Exercise
        </Button>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => selectCategoryHandler(2)}
          newStyles={{
            backgroundColor: Colors.primaryAlcohol,
            width: Dimensions.get("window").width / 3,
          }}
          textStyles={styles.buttonText}>
          Alcohol
        </Button>
        <Button
          onPress={() => selectCategoryHandler(3)}
          newStyles={{
            backgroundColor: Colors.primaryDiet,
            width: Dimensions.get("window").width / 3,
          }}
          textStyles={styles.buttonText}>
          Diet
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  conainer: {
    borderRadius: 42,
    backgroundColor: Colors.primaryBackgroundLight,
    height: Dimensions.get("window").height / 6,
    width: Dimensions.get("window").width / 1.2,
    elevation: 2,
    shadowColor: "#333",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    //marginVertical: 0,
  },
  title: {
    textAlign: "center",
    fontFamily: "robotomono-bold",
    color: Colors.primaryText,
    marginTop: 6,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    margin: deviceHeight * 0.007,
  },
  buttonText: {
    fontFamily: "robotomono-bold",
    color: Colors.primaryText,
  },
  selectedButtonStyle: {
    borderWidth: 2,
    color: Colors.primaryGrey,
  },
});
export default CategoryPicker;
