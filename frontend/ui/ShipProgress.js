import { StyleSheet, View } from "react-native";
import { Colors } from "../constants/Colors";
import Button from "./Button";
import ProgressBar from "./ProgressBar";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

function ShipProgress(prop) {
  const stats = {
    engines: 10,
    energy: 10,
    fuel: 0,
    grip: 5,
  };

  const keysArray = Object.keys(stats);

  let progress = 0;
  keysArray.forEach((key) => {
    progress += stats[key];
  });

  const isDisabled = progress < 40;

  return (
    <View
      style={{
        gap: 10,
        alignItems: "stretch",
        borderWidth: 1,
        borderColor: Colors.primaryGrey,
        borderRadius: 32,
        padding: 10,
      }}>
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <MaterialCommunityIcons
          name="engine-outline"
          size={24}
          color={Colors.primaryBold}
        />
        <SimpleLineIcons name="energy" size={24} color={Colors.primaryBold} />
        <MaterialCommunityIcons
          name="fuel"
          size={24}
          color={Colors.primaryBold}
        />
        <FontAwesome5 name="grip-lines" size={24} color={Colors.primaryBold} />
      </View>

      <View style={styles.container}>
        {keysArray.map((item) => {
          return (
            <ProgressBar
              key={item}
              completedColor={Colors.primaryBold}
              incompletedColor={Colors.primaryGrey}
              percentage={stats[item] * 10}
            />
          );
        })}
      </View>

      <Button
        textStyles={{ fontFamily: "robotomono-bold", fontSize: 12 }}
        disabled={isDisabled}>
        Initiate Launch
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
});

export default ShipProgress;
