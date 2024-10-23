import { BarChart } from "react-native-gifted-charts";
import { Colors } from "../../constants/Colors";
import { View, Text, TouchableOpacity } from "react-native";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../store/auth-context";
import { BACKEND_URL } from "@env";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import IconButton from "../../ui/ButtonIcon";
const backendUrl = BACKEND_URL + "/statistics/diet";
import axios from "axios";

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

function DietChart() {
  const [chartData, setChartData] = useState(stackDietData);
  const [timePeriod, setTimePeriod] = useState("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentEndDate, setCurrentEndDate] = useState(new Date());
  const [completionRate, setCompletionRate] = useState(0);
  const [typeData, setTypeData] = useState("Duration");

  const authCtx = useContext(AuthContext);
  const token = authCtx.token;

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
  }, [typeData]);

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
      stacks: [
        {
          value: 0, // Provide a default minimal value
          color: "transparent", // Set a transparent color to effectively hide it
        },
      ],
      label: label,
    }));

    let completedHabits = 0;

    data.forEach((element) => {
      const dayIndex = element.dayOfWeek - 1;

      let completedColor = Colors.primaryDiet;
      const uncompletedColor = Colors.greyLight;

      if (element.details) {
        completedColor =
          element.details.habitType === "old"
            ? Colors.primaryAlcohol
            : Colors.primaryDiet;
      }

      // Push a new stack element for each entry
      barData[dayIndex].stacks.push({
        value: 1, // Assuming each stack represents one habit, always with a value of 1
        color: element.isCompleted ? completedColor : uncompletedColor,
      });

      if (element.isCompleted) completedHabits += 1;
    });

    setCompletionRate(((completedHabits / data.length) * 100).toFixed(0));
    if (!data || data.length === 0) setCompletionRate(0);

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
            {completionRate}% of diet habits
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
            stackData={chartData}
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

        <Text
          style={{
            // alignSelf: "flex-end",
            fontSize: 14,
            fontFamily: "robotomono-bold",
            color: Colors.primaryText,
          }}>
          {currentDate.toLocaleDateString("en-US", { month: "short" })}{" "}
          {currentDate.getDate()} -{" "}
          {currentEndDate.toLocaleDateString("en-US", { month: "short" })}{" "}
          {currentEndDate.getDate()}
        </Text>

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

export default DietChart;
