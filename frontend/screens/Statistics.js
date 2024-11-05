import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { Colors } from "../constants/Colors";
import { BarChart } from "react-native-gifted-charts";
import ExerciseChart from "../components/Statistics/ExerciseChart";
import DietChart from "../components/Statistics/DietChart";
import SubstanceChart from "../components/Statistics/SubstanceChart";

function StatisticsScreen() {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Your stats</Text>
        </View>
        <ScrollView>
          <DietChart />
          <SubstanceChart mode="Smoking" />
          <SubstanceChart mode="Alcohol" />
          <ExerciseChart />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackgroundLight,
    paddingBottom: 84,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 24,
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontFamily: "robotomono-bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    //marginTop: 22,
  },
});
export default StatisticsScreen;
