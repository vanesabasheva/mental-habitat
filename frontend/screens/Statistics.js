import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { Colors } from "../constants/Colors";
import { BarChart } from "react-native-gifted-charts";
import ExerciseChart from "../components/Statistics/ExerciseChart";
import SmokingChart from "../components/Statistics/SmokingChart";
import AlcoholChart from "../components/Statistics/AlcoholChart";
import DietChart from "../components/Statistics/DietChart";

function StatisticsScreen() {
  const data = [
    {
      value: 45,
      frontColor: Colors.primaryBackground,
      gradientColor: Colors.primaryLight,
      spacing: 8,
      label: "07/09",
    },
    // { value: 2400, frontColor: "#3BE9DE", gradientColor: "#93FCF8" },

    {
      value: 60,
      frontColor: Colors.primaryBackground,
      gradientColor: Colors.primaryLight,
      spacing: 8,
      label: "08/09",
    },
    //    { value: 3000, frontColor: "#3BE9DE", gradientColor: "#93FCF8" },

    {
      value: 65,
      frontColor: Colors.primaryBackground,
      gradientColor: Colors.primaryLight,
      spacing: 8,
      label: "09/09",
    },
    // { value: 4000, frontColor: "#3BE9DE", gradientColor: "#93FCF8" },

    {
      value: 80,
      frontColor: Colors.primaryBackground,
      gradientColor: Colors.primaryLight,
      spacing: 8,
      label: "10/09",
    },
    //  { value: 4900, frontColor: "#3BE9DE", gradientColor: "#93FCF8" },

    {
      value: 0,
      frontColor: Colors.primaryBackground,
      gradientColor: Colors.primaryLight,
      spacing: 8,
      label: "11/09",
    },
    {
      value: 75,
      frontColor: Colors.primaryBackground,
      gradientColor: Colors.primaryLight,
      spacing: 8,
      label: "12/09",
    },
    {
      value: 50,
      frontColor: Colors.primaryBackground,
      gradientColor: Colors.primaryLight,
      spacing: 8,
      label: "13/09",
    },
    //  { value: 2800, frontColor: "#3BE9DE", gradientColor: "#93FCF8" },
  ];

  const smokingData = [
    { value: 0, frontColor: Colors.primaryAlcohol, label: "Mo" },
    {
      value: 1,
      frontColor: Colors.primarySmoking,
      label: "Tu",
    },
    {
      value: 3,
      frontColor: Colors.primarySmoking,
      label: "We",
    },
    {
      value: 6,
      frontColor: Colors.primarySmoking,
      label: "Th",
    },
    {
      value: 2,
      frontColor: Colors.primarySmoking,
      label: "Fr",
    },
    {
      value: 6,
      frontColor: Colors.primarySmoking,
      label: "Sat",
    },
    {
      value: 0,
      frontColor: Colors.primarySmoking,
      label: "Sun",
    },
  ];

  const alcoholData = [
    { value: 0, frontColor: Colors.primaryAlcohol, label: "Mo" },
    {
      value: 1,
      frontColor: Colors.primaryAlcohol,
      label: "Tu",
    },
    {
      value: 3,
      frontColor: Colors.primaryAlcohol,
      label: "We",
    },
    {
      value: 6,
      frontColor: Colors.primaryAlcohol,
      label: "Th",
    },
    {
      value: 2,
      frontColor: Colors.primaryAlcohol,
      label: "Fr",
    },
    {
      value: 6,
      frontColor: Colors.primaryAlcohol,
      label: "Sat",
    },
    {
      value: 0,
      frontColor: Colors.primaryAlcohol,
      label: "Sun",
    },
  ];

  const stackDietData = [
    {
      stacks: [
        { value: 1, color: Colors.primaryDiet },
        { value: 1, color: Colors.primaryDiet, marginBottom: 2 },
        { value: 1, color: Colors.primaryAlcohol, marginBottom: 2 },
      ],
      label: "Mo",
    },
    {
      stacks: [{ value: 1, color: Colors.greyLight }],
      label: "Tu",
    },
    {
      stacks: [
        { value: 1, color: Colors.primaryDiet },
        { value: 1, color: Colors.primaryDiet, marginBottom: 2 },
      ],
      label: "We",
    },
    {
      stacks: [
        { value: 1, color: Colors.primaryDiet },
        { value: 1, color: Colors.greyLight, marginBottom: 2 },
        { value: 1, color: Colors.primaryAlcohol, marginBottom: 2 },
      ],
      label: "Tu",
    },
    {
      stacks: [
        { value: 1, color: Colors.primaryDiet },
        { value: 1, color: Colors.primaryDiet, marginBottom: 2 },
      ],
      label: "Fr",
    },
    {
      stacks: [
        { value: 1, color: Colors.primaryAlcohol },
        { value: 1, color: Colors.primaryDiet, marginBottom: 2 },
      ],
      label: "Sa",
    },
    {
      stacks: [{ value: 3, color: Colors.primaryBackgroundLight }],
      label: "Su",
    },
  ];

  const dietData = [
    {
      value: 2,
      frontColor: Colors.primaryDiet,
      label: "Mo",
      dataPointText: "1",
    },
    {
      value: 1,
      frontColor: Colors.primaryDiet,
      label: "Tu",
      dataPointText: "1",
    },
    {
      value: 1,
      frontColor: Colors.primaryDiet,
      label: "We",
      dataPointText: "3",
    },
    {
      value: 1,
      frontColor: Colors.greyLight,
      label: "Th",
      dataPointText: "6",
    },
    {
      value: 1,
      frontColor: Colors.primaryDiet,
      label: "Fr",
      dataPointText: "2",
    },
    {
      value: 1,
      frontColor: Colors.primaryDiet,
      label: "Sat",
      dataPointText: "6",
    },
    {
      value: 1,
      frontColor: Colors.greyLight,
      label: "Sun",
      dataPointText: "0",
    },
  ];

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Your stats</Text>
        </View>
        <ScrollView>
          <ExerciseChart data={data} />
          <SmokingChart data={smokingData} />
          <AlcoholChart data={alcoholData} />
          <DietChart data={stackDietData} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackgroundLight,
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
