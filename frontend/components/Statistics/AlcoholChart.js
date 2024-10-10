import { BarChart } from "react-native-gifted-charts";
import { Colors } from "../../constants/Colors";
import { View, Text } from "react-native";
function AlcoholChart({ data }) {
  // for customising the point
  const timeFrame = "30/09 - 06/10";
  let average = 18 / 7;
  average = average.toFixed(1);
  const alcoholFree = 2;

  const customDataPoint = () => {
    return (
      <View
        style={{
          width: 20,
          height: 20,
          backgroundColor: "white",
          borderWidth: 4,
          borderRadius: 10,
          borderColor: Colors.primaryBackground,
        }}
      />
    );
  };

  // for date in the x-Axis
  const customLabel = (val) => {
    return (
      <View style={{ width: 70, marginLeft: 7 }}>
        <Text style={{ color: "white", fontWeight: "bold" }}>{val}</Text>
      </View>
    );
  };

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
          fontWeight: "bold",
          marginBottom: 12,
          fontFamily: "robotomono-bold",
        }}>
        Alcohol
      </Text>

      <View
        style={{
          margin: 5,
          marginBottom: 20,
          padding: 18,
          borderRadius: 20,
          backgroundColor: "rgba(255,201,201,0.3)",
        }}>
        <Text
          style={{
            fontWeight: "bold",
            color: Colors.primaryText,
            fontSize: 14,
            fontFamily: "robotomono-regular",
          }}>
          Drink-free days
        </Text>
        <Text
          style={{
            alignSelf: "flex-end",
            fontSize: 18,
            fontFamily: "robotomono-bold",
            color: Colors.primaryText,
          }}>
          {alcoholFree} {alcoholFree == 1 ? "day" : "days"}
        </Text>
      </View>

      <View
        style={{
          padding: 20,
          gap: 20,
          backgroundColor: "rgba(255,201,201,0.1)",
          borderRadius: 20,
        }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text style={{ color: "grey", marginBottom: 2 }}>Average </Text>
            <Text
              style={{
                color: Colors.primaryText,
                fontWeight: "bold",
                fontSize: 16,
                fontFamily: "robotomono-regular",
              }}>
              {average} drinks/day
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
        <BarChart
          data={data}
          barWidth={14}
          initialSpacing={0}
          spacing={26}
          hideRules
          showVerticalLines
          verticalLinesShift={20}
          barBorderRadius={32}
          //showGradient
          yAxisThickness={0}
          xAxisThickness={0}
          yAxisTextStyle={{ color: "lightgrey" }}
          stepValue={2}
          maxValue={12}
          noOfSections={1}
          showValuesAsTopLabel
          topLabelTextStyle={{ color: "grey", fontSize: 10 }}
          yAxisLabelTexts={["0", "2", "4", "6", "8", "10", "12"]}
          labelWidth={20}
          xAxisLabelTextStyle={{
            color: "grey",
            textAlign: "center",
            fontSize: 10,
          }}
        />
      </View>
    </View>
  );
}

export default AlcoholChart;
