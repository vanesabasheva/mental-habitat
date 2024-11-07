import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { Colors } from "../constants/Colors";
import ExerciseChart from "../components/Statistics/ExerciseChart";
import DietChart from "../components/Statistics/DietChart";
import SubstanceChart from "../components/Statistics/SubstanceChart";
import { useContext } from "react";
import { StatsContext } from "../store/stats-context";

function StatisticsScreen() {
  const statsCtx = useContext(StatsContext);
  const categories = statsCtx.categories;
  const stats = statsCtx.stats;
  console.log(stats);

  const hasDiet = categories.includes("Diet");
  const hasAlcohol = categories.includes("Alcohol");
  const hasSmoking = categories.includes("Smoking");
  const hasExercise = categories.includes("Exercise");

  console.log(hasAlcohol);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Your stats</Text>
        </View>
        <ScrollView>
          {hasDiet && <DietChart />}
          {hasSmoking && <SubstanceChart mode="Smoking" />}
          {hasAlcohol && <SubstanceChart mode="Alcohol" />}
          {hasExercise && <ExerciseChart />}
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
