import { StyleSheet, View } from "react-native";
import { Colors } from "../constants/Colors";
import Button from "./Button";
import ProgressBar from "./ProgressBar";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Spaceship from "../assets/svgs/Spaceship.svg";
import { deviceWidth, deviceHeight } from "../constants/Dimensions";
import { BACKEND_URL } from "@env";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../store/auth-context";
const backendURL = BACKEND_URL + "/game";

function ShipProgress({
  stats,
  setCurrentLevel,
  setLevelProgress,
  categories,
}) {
  const keysArray = Object.keys(stats);
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;

  let progress = 0;
  keysArray.forEach((key) => {
    progress += stats[key];
  });
  console.log("In ship progress, categories forwarded...");

  const isDisabled =
    progress < categories.length * 10 || categories.length == 0;

  async function initiateMissionHandler() {
    try {
      const response = await axios.post(
        `${backendURL}/use-resources`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      console.log(response.data.levelProgress);
      console.log(response.data.currentLevel);

      const levelProgress = response.data.levelProgress;
      const currentLevel = response.data.currentLevel;
      setLevelProgress(levelProgress);
      setCurrentLevel(currentLevel);
    } catch (error) {
      console.log(error);
    }
  }
  const isSmokingPresent = categories.some(
    (category) => category._id === "Smoking"
  );
  const isExercisePresent = categories.some(
    (category) => category._id === "Exercise"
  );
  const isAlcoholPresent = categories.some(
    (category) => category._id === "Alcohol"
  );
  const isDietPresent = categories.some((category) => category._id === "Diet");

  return (
    <View style={{ alignItems: "center" }}>
      <View
        style={{
          borderWidth: 1,
          borderColor: Colors.greyLight,
          borderRadius: 32,
          padding: 10,
          paddingHorizontal: 20,
          flexDirection: "row",
          justifyContent: "",
          gap: 20,
          marginBottom: 5,
          width: deviceWidth * 0.7,
        }}>
        <View style={{ flexDirection: "column", gap: 10 }}>
          <MaterialCommunityIcons
            name="engine-outline"
            size={24}
            color={Colors.primaryBold}
          />
          <FontAwesome5
            name="grip-lines"
            size={24}
            color={Colors.primaryBold}
          />
          <MaterialCommunityIcons
            name="fuel"
            size={24}
            color={Colors.primaryBold}
          />
          <SimpleLineIcons name="energy" size={24} color={Colors.primaryBold} />
        </View>
        {/*Progress bar one*/}

        <View style={{ justifyContent: "space-around" }}>
          <ProgressBar
            key="engine"
            completedColor={Colors.primaryBold}
            incompletedColor={Colors.primaryGrey}
            percentage={isSmokingPresent ? stats["engines"] * 10 : 100}
            isVertical={true}
            gap={2}
          />
          <ProgressBar
            key="grip"
            completedColor={Colors.primaryBold}
            incompletedColor={Colors.primaryGrey}
            percentage={isDietPresent ? stats["grip"] * 10 : 100}
            isVertical={true}
            gap={2}
          />
          <ProgressBar
            key="fuel"
            completedColor={Colors.primaryBold}
            incompletedColor={Colors.primaryGrey}
            percentage={isAlcoholPresent ? stats["fuel"] * 10 : 100}
            isVertical={true}
            gap={2}
          />
          <ProgressBar
            key="energy"
            completedColor={Colors.primaryBold}
            incompletedColor={Colors.primaryGrey}
            percentage={isExercisePresent ? stats["energy"] * 10 : 100}
            isVertical={true}
            gap={2}
          />
        </View>
      </View>
      <Button
        newStyles={{ width: deviceWidth * 0.6, alignSelf: "center" }}
        textStyles={{ fontFamily: "robotomono-bold", fontSize: 12 }}
        disabled={isDisabled}
        onPress={initiateMissionHandler}>
        Initiate Launch
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    //flexDirection: "column",
    //justifyContent: "space-around",
  },
});

export default ShipProgress;
