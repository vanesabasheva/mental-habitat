import { BarChart } from "react-native-gifted-charts";
import { Colors } from "../../constants/Colors";
import { View, Text } from "react-native";
function DietChart({ data }) {
  const completionRate = 75;
  const timeFrame = "30/09 - 06/10";
  return (
    <View
      style={{
        margin: 10,
        padding: 25,
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255, 0.5)",
      }}>
      <Text
        style={{
          color: Colors.primaryText,
          fontSize: 16,
          marginBottom: 12,
          fontFamily: "robotomono-bold",
        }}>
        Diet
      </Text>

      <View
        style={{
          margin: 5,
          marginBottom: 20,
          padding: 18,
          borderRadius: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          alignContent: "center",
          //backgroundColor: "rgba(216,245,162,0.3)",
        }}>
        <View>
          <Text
            style={{
              color: Colors.primaryText,
              fontSize: 14,
              fontFamily: "robotomono-bold",
            }}>
            {completionRate}% diet habits
          </Text>
          <Text
            style={{
              color: Colors.primaryText,
              fontSize: 14,
              fontFamily: "robotomono-bold",
            }}>
            completed
          </Text>
        </View>

        <Text
          style={{
            alignSelf: "flex-end",
            fontSize: 14,
            fontFamily: "robotomono-bold",
            color: Colors.primaryText,
          }}>
          {timeFrame}
        </Text>
      </View>

      <View
        style={{
          padding: 20,
          gap: 20,
          backgroundColor: "rgba(216,245,162, 0.1)",
          borderRadius: 20,
        }}>
        <View style={{ alignItems: "center" }}>
          <BarChart
            stackData={data}
            barWidth={14}
            initialSpacing={10}
            spacing={26}
            hideRules
            showVerticalLines
            verticalLinesShift={20}
            barBorderRadius={32}
            //showGradient
            yAxisThickness={0}
            xAxisThickness={0}
            yAxisTextStyle={{ color: "lightgrey" }}
            stepValue={1}
            maxValue={3}
            noOfSections={1}
            hideYAxisText
            labelWidth={20}
            xAxisLabelTextStyle={{
              color: "grey",
              textAlign: "center",
              fontSize: 10,
            }}
          />
        </View>
      </View>
    </View>
  );
}

export default DietChart;
