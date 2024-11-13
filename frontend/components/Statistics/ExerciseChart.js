import { BarChart } from "react-native-gifted-charts";
import { Colors } from "../../constants/Colors";
import { View, Text, TouchableOpacity } from "react-native";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../store/auth-context";
import { EXPO_PUBLIC_API_URL } from "@env";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import IconButton from "../../ui/ButtonIcon";
const backendUrl = EXPO_PUBLIC_API_URL + "/statistics/exercise";
import axios from "axios";
import { StatsContext } from "../../store/stats-context";

const exerciseData = [
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

function ExerciseChart() {
  const [chartData, setChartData] = useState(exerciseData);
  const [timePeriod, setTimePeriod] = useState("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentEndDate, setCurrentEndDate] = useState(new Date());
  const [average, setAverage] = useState(0);
  const [typeData, setTypeData] = useState("Duration");

  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const statsCtx = useContext(StatsContext);
  const stats = statsCtx.stats;

  const fetchData = async (currentDate) => {
    if (timePeriod === "week") {
      const { startDate, endDate } = getWeekRange(currentDate);

      setCurrentDate(() => new Date(startDate));
      setCurrentEndDate(() => new Date(endDate));
      const data = await fetchWeeklyData(startDate, endDate);

      if (data.error) {
        // TODO: handle errors
        return;
      }
      setChartData(data);
    }
  };

  useEffect(() => {
    fetchData(currentDate);
  }, [typeData, stats]);

  const getWeekRange = (date) => {
    const startOfWeek = new Date(
      date.setDate(date.getDate() - date.getDay() + 1)
    );
    const endOfWeek = new Date(date.setDate(startOfWeek.getDate() + 6));
    return {
      startDate: startOfWeek,
      endDate: endOfWeek,
    };
  };

  const fetchWeeklyData = async (startDate, endDate) => {
    try {
      const params = {
        startDate: startDate,
        endDate: endDate,
      };

      const response = await axios.get(backendUrl, {
        params: params,
        headers: { Authorization: `Bearer ${token}` },
      });

      return processWeeklyData(response.data);
    } catch (error) {
      console.log(error);
      return { error: "An Error Occured: " + error };
    }
  };

  const processWeeklyData = (data) => {
    const days = ["Mo", "Tu", "We", "Th", "Fr", "Sat", "Sun"];

    let barData = days.map((label) => ({
      label,
      value: 0,
      frontColor: Colors.primaryExercise,
    }));

    let totalDuration = 0;
    let totalDistance = 0;
    if (typeData === "Duration") {
      data.forEach((element) => {
        const dayIndex = element._id - 1;

        // Convert Decimal128 value to a number for usage
        const totalDurationValue = parseFloat(
          element.totalDuration.$numberDecimal
        );

        barData[dayIndex].value = totalDurationValue;

        // Update totalDuration sum, ensure it handles NaN cases gracefully
        totalDuration += totalDurationValue || 0;
      });
    } else {
      data.forEach((element) => {
        const dayIndex = element._id - 1;

        // Convert Decimal128 value to a number for usage
        console.log(JSON.stringify(element));

        let totalDistanceValue = 0;
        if (element.totalDistance.$numberDecimal) {
          totalDistanceValue = parseFloat(element.totalDistance.$numberDecimal);
        }

        barData[dayIndex].value = totalDistanceValue;

        totalDistance += totalDistanceValue || 0;
      });
    }

    return barData;
  };

  const previousWeek = () => {
    const newDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
    fetchData(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentDate.setDate(currentDate.getDate() + 7));
    fetchData(newDate);
  };

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
      <Text
        style={{
          color: Colors.primaryText,
          fontSize: 14,
          fontFamily: "robotomono-bold",
        }}>
        {chartData.reduce((total, item) => total + item.value, 0).toFixed(0)}{" "}
        {typeData === "Duration" ? "min" : "km"}
      </Text>
      <Text
        style={{
          alignSelf: "flex-end",
          fontSize: 14,
          fontFamily: "robotomono-bold",
          color: Colors.primaryText,
          marginHorizontal: 12,
        }}>
        {currentDate.toLocaleDateString("en-US", { month: "short" })}{" "}
        {currentDate.getDate()} -{" "}
        {currentEndDate.toLocaleDateString("en-US", { month: "short" })}{" "}
        {currentEndDate.getDate()}
      </Text>

      <View style={{ padding: 20, alignItems: "center" }}>
        <BarChart
          data={chartData}
          initialSpacing={10}
          spacing={10}
          barBorderRadius={4}
          //showGradient
          yAxisThickness={0}
          xAxisType={"dashed"}
          xAxisColor={"lightgray"}
          yAxisTextStyle={{ color: "lightgray" }}
          stepValue={typeData === "Duration" ? 30 : 3}
          maxValue={typeData === "Duration" ? 150 : 15}
          noOfSections={5}
          yAxisLabelTexts={
            typeData === "Duration"
              ? ["0", "30m", "1h", "90m", "2h", "150m"]
              : ["0km", "3km", "6km", "9km", "12km", "15km"]
          }
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
            initialSpacing: 10,
          }}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          marginTop: 12,
        }}>
        <TouchableOpacity
          style={{ borderRadius: 50, backgroundColor: Colors.greyLight }}>
          <IconButton
            icon="chevron-back"
            color="grey"
            size={24}
            onPress={previousWeek}
          />
        </TouchableOpacity>

        <SegmentedControl
          values={["Duration", "Distance"]}
          style={{ width: 200 }}
          selectedIndex={typeData === "Duration" ? 0 : 1}
          onChange={(event) => {
            const index = event.nativeEvent.selectedSegmentIndex;
            if (index === 0) {
              setTypeData("Duration");
            } else {
              setTypeData("Distance");
            }
          }}
        />

        <TouchableOpacity
          style={{
            borderRadius: 50,
            backgroundColor: Colors.greyLight,
          }}>
          <IconButton
            icon="chevron-forward"
            color="grey"
            size={24}
            onPress={nextWeek}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          //marginTop: 12,
          marginHorizontal: 10,
        }}>
        <Text style={{ fontSize: 11, color: "gray" }}>Prev week</Text>
        <Text style={{ fontSize: 11, color: "gray" }}>Next week</Text>
      </View>
    </View>
  );
}

export default ExerciseChart;
