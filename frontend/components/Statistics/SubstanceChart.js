import { BarChart } from "react-native-gifted-charts";
import { Colors } from "../../constants/Colors";
import IconButton from "../../ui/ButtonIcon";
import { View, Text, TouchableOpacity } from "react-native";
import { useState, useEffect, useContext } from "react";
import { BACKEND_URL } from "@env";
import axios from "axios";
import { AuthContext } from "../../store/auth-context";
const backendUrl = BACKEND_URL + "/statistics";

const dummy_data = [
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

function SubstanceChart({ mode }) {
  const [chartData, setChartData] = useState(dummy_data);
  const [timePeriod, setTimePeriod] = useState("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentEndDate, setCurrentEndDate] = useState(new Date());
  const [average, setAverage] = useState(0);
  const [substanceFreeDays, setSubstanceFreeDays] = useState(0);

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
  }, []);

  // Helper Functions//
  /////////////////////
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

      const ending = mode === "Smoking" ? "/smoking" : "/alcohol";
      const response = await axios.get(backendUrl + ending, {
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
    const frontColor =
      mode === "Smoking" ? Colors.primarySmoking : Colors.primaryAlcohol;

    let barData = days.map((label) => ({
      label,
      value: 0,
      frontColor: frontColor,
    }));

    let totalConsumption = 0;
    let noSubstanceDays = 0;

    if (mode === "Smoking") {
      data.forEach((element) => {
        const dayIndex = element.day;
        barData[dayIndex].value = element.smokedCigarettes;
        totalConsumption += element.smokedCigarettes;
        if (element.smokedCigarettes === 0) noSubstanceDays += 1;
      });
    } else {
      data.forEach((element) => {
        const dayIndex = element.day;
        barData[dayIndex].value = element.numberOfConsumedDrinks;
        totalConsumption += element.numberOfConsumedDrinks;
        if (element.numberOfConsumedDrinks === 0) noSubstanceDays += 1;
      });
    }

    let newAverage = (totalConsumption / 7).toFixed(0);
    setAverage(newAverage);
    setSubstanceFreeDays(noSubstanceDays);
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

  const activeColor =
    mode === "Smoking" ? "rgba(208,235,255, 0.3)" : "rgba(255,201,201,0.3)";

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
        }}>
        {mode}
      </Text>

      <View
        style={{
          margin: 5,
          marginBottom: 20,
          padding: 18,
          borderRadius: 20,
          backgroundColor: activeColor,
        }}>
        <Text
          style={{
            fontFamily: "robotomono-bold",
            fontSize: 16,
          }}>
          No {mode === "Smoking" ? "cigarettes" : "alcohol"} for
        </Text>
        <Text
          style={{
            alignSelf: "flex-end",
            fontSize: 18,
            fontFamily: "robotomono-bold",
            color: Colors.primaryText,
          }}>
          {substanceFreeDays} days
        </Text>
      </View>

      <View
        style={{
          margin: 0,
          padding: 12,
          margin: 0,
          borderRadius: 20,
          backgroundColor: "rgba(208,235,255, 0.1)",
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
                marginBottom: 12,
              }}>
              {average} {mode === "Smoking" ? "cigarettes" : "drinks"}/day
            </Text>
          </View>
        </View>
        <BarChart
          data={chartData}
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

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
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
      </View>
    </View>
  );
}

export default SubstanceChart;
