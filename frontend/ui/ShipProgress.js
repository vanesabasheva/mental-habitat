import { StyleSheet, View } from "react-native";
import { Colors } from "../constants/Colors";
import Button from "./Button";
import ProgressBar from "./ProgressBar";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { deviceWidth, deviceHeight } from "../constants/Dimensions";
function ShipProgress(prop) {
  const stats = {
    engines: 10,
    energy: 10,
    grip: 5,
    fuel: 0,
  };

  const keysArray = Object.keys(stats);

  let progress = 0;
  keysArray.forEach((key) => {
    progress += stats[key];
  });

  const isDisabled = progress < 40;

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
          <SimpleLineIcons name="energy" size={24} color={Colors.primaryBold} />
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
        </View>
        {/*Progress bar one*/}

        <View style={{ justifyContent: "space-around" }}>
          {keysArray.map((item) => {
            return (
              <ProgressBar
                key={item}
                completedColor={Colors.primaryBold}
                incompletedColor={Colors.primaryGrey}
                percentage={stats[item] * 10}
                isVertical={true}
                gap={2}
              />
            );
          })}
        </View>
      </View>
      <Button
        newStyles={{ width: deviceWidth * 0.6, alignSelf: "center" }}
        textStyles={{ fontFamily: "robotomono-bold", fontSize: 12 }}
        disabled={isDisabled}>
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
