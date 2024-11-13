import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";
import { useContext } from "react";
import { StatsContext } from "../store/stats-context";
import { LEVELS } from "./Home";
import Ionicons from "@expo/vector-icons/Ionicons";
import { deviceHeight } from "../constants/Dimensions";
import React from "react";
import GreyPlanet from "../assets/svgs/GreyPlanet.svg";
function Achievements({ navigation }) {
  const statsCtx = useContext(StatsContext);
  const level = statsCtx.currentLevel;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={30} color={Colors.primaryText} />
      </TouchableOpacity>
      <View style={{ alignItems: "center" }}>
        <Text style={styles.title}>Achievements</Text>
        <Text
          style={{
            fontFamily: "robotomono-regular",
            fontSize: 16,
            marginBottom: 6,
          }}>
          Unlocked Planets
        </Text>
        <Text
          style={{
            fontFamily: "robotomono-regular",
            fontSize: 14,
          }}>
          {level} of 4
        </Text>
      </View>
      <View style={styles.planetRowContainer}>
        {LEVELS.slice(0, level).map((level, index) => (
          <View key={index} style={{ alignItems: "center" }}>
            <View style={styles.planetContainer}>
              {React.cloneElement(level.icon, { width: 150, height: 150 })}
            </View>
            <Text
              style={{
                fontFamily: "robotomono-regular",
                fontSize: 14,
                textAlign: "center",
                marginBottom: 20,
              }}>
              {level.planetName}
            </Text>
          </View>
        ))}

        {LEVELS.slice(level - 1, LEVELS.length - 1).map((level, index) => (
          <View
            key={index}
            style={[
              styles.planetContainer,
              {
                backgroundColor: Colors.greyLight,
                borderRadius: 500,
                marginBottom: 20,
                marginRight: 1,
              },
            ]}>
            <GreyPlanet width={140} height={140} style={{ opacity: 0.7 }} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackgroundLight,
    paddingTop: deviceHeight * 0.07,
    gap: 50,
    padding: 32,
    alignItems: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    position: "absolute",
    backgroundColor: Colors.greyLight,
    borderRadius: 50,
    padding: 8,
    marginHorizontal: 20,
    top: deviceHeight * 0.1,
  },
  title: {
    fontSize: 24,
    fontFamily: "robotomono-bold",
    color: Colors.primaryText,
    marginBottom: 10,
  },
  planetRowContainer: {
    flexDirection: "row", // Align children in a row
    flexWrap: "wrap", // Allow multiple rows
    justifyContent: "space-between", // Evenly space items within each row
    alignItems: "flex-start",
  },
  planetContainer: {
    width: "45%", // Each planet takes half the row width
    alignItems: "center", // Center content horizontally
    marginBottom: 0, // Margin between rows
    //marginHorizontal: 16,

    borderRadius: 500,
  },
});

export default Achievements;
