import { BarChart } from "react-native-gifted-charts";
import { Colors } from "../../constants/Colors";
import { View, Text } from "react-native";
function ExerciseChart({ data }) {
  return (
    <View
      style={{
        margin: 10,
        padding: 16,
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255, 0.5)",
      }}>
      <Text
        style={{
          color: Colors.primaryText,
          fontSize: 16,
          fontWeight: "bold",
        }}>
        Exercise
      </Text>
      <View style={{ padding: 20, alignItems: "center" }}>
        <BarChart
          data={data}
          initialSpacing={10}
          spacing={14}
          barBorderRadius={4}
          //showGradient
          yAxisThickness={0}
          xAxisType={"dashed"}
          xAxisColor={"lightgray"}
          yAxisTextStyle={{ color: "lightgray" }}
          stepValue={30}
          maxValue={120}
          noOfSections={5}
          yAxisLabelTexts={["0", "30m", "1h", "90m", "2h"]}
          labelWidth={40}
          xAxisLabelTextStyle={{
            color: "lightgray",
            textAlign: "center",
            fontSize: 10,
          }}
          showLine
          lineConfig={{
            color: Colors.primaryAlcohol,
            thickness: 3,
            curved: true,
            hideDataPoints: true,
            shiftY: 20,
            initialSpacing: -30,
          }}
        />
      </View>
    </View>
  );
}

export default ExerciseChart;
