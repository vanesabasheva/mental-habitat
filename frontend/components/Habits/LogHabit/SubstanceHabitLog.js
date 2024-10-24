import { useState, useEffect } from "react";
import { View, Text, TextInput, FlatListComponent } from "react-native";
import IconButton from "../../../ui/ButtonIcon";
import { Colors } from "../../../constants/Colors";
import { deviceHeight, deviceWidth } from "../../../constants/Dimensions";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function SubstanceHabitLog({ mode, habitEntry, onLog }) {
  const [consumedToday, setConsumedToday] = useState(0);
  const [notes, setNotes] = useState("");
  const [goal, setGoal] = useState(0);

  useEffect(() => {
    if (habitEntry) {
      if (mode === "Smoking") {
        setConsumedToday(parseInt(habitEntry.details.numberOfSmokedCigarettes));
        setGoal(parseInt(habitEntry.details.numberOfCigarettes));
      } else {
        setConsumedToday(parseInt(habitEntry.details.numberOfConsumedDrinks));
        setGoal(parseInt(habitEntry.details.numberOfDrinks));
      }
      if (habitEntry.details.notes) {
        setNotes(habitEntry.details.notes);
      }
    }
  }, [habitEntry]);

  let buttonColor = consumedToday <= goal ? "#087f5b" : "#fa5252";
  let backgroundColor = consumedToday <= goal ? "#e6fcf5" : "#ffe3e3";
  let text;
  if (mode === "Smoking") {
    goal === 1 ? (text = "cigarette") : (text = "cigarettes");
  } else {
    goal === 1 ? (text = "drink") : (text = "drinks");
  }

  let consumedText;
  if (mode === "Smoking") {
    consumedToday === 1
      ? (consumedText = "cigarette")
      : (consumedText = "cigarettes");
  } else {
    consumedToday === 1 ? (consumedText = "drink") : (consumedText = "drinks");
  }

  async function notifyUserForGoal(newConsumedToday) {
    Notifications.scheduleNotificationAsync({
      content: {
        title: `Hey, ${newConsumedToday} ${text} consumed today is over your goal of ${goal}.`,
        body: "Remember your motivation, you got this!",
      },
      trigger: {
        seconds: 1,
      },
    });
    console.log(
      `Hey, ${newConsumedToday} ${text} consumed today is over your goal of ${goal}.`
    );
    console.log("Goal not met!!!!!!!" + newConsumedToday + text + goal);
  }
  function increase() {
    setConsumedToday((prevState) => {
      const newState = (prevState += 1);
      if (mode === "Smoking") {
        onLog({
          numberOfSmokedCigarettes: newState,
          notes: notes,
        });
      } else {
        onLog({
          numberOfConsumedDrinks: newState,
          notes: notes,
        });
      }

      if (newState >= goal) {
        notifyUserForGoal(newState);
      }

      return newState;
    });
  }

  function decrease() {
    setConsumedToday((prevState) => {
      const newState = prevState > 0 ? prevState - 1 : 0;

      if (mode === "Smoking") {
        onLog({
          numberOfSmokedCigarettes: newState,
          notes: notes,
        });
      } else {
        onLog({
          numberOfConsumedDrinks: newState,
          notes: notes,
        });
      }

      return newState;
    });
    //  onLog({ consumedToday: consumedToday, notes: notes });
  }

  return (
    <View style={{ alignItems: "center" }}>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <Text style={{ fontFamily: "robotomono-regular", marginBottom: 12 }}>
          {" "}
          Your Goal:
        </Text>
        <Text style={{ fontFamily: "robotomono-bold" }}>
          {goal} {text}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 24,
        }}>
        <IconButton
          icon="remove-circle"
          size={42}
          color={Colors.greyLight}
          onPress={decrease}
        />
        <View style={{ gap: 8, justifyContent: "center" }}>
          <View
            style={{
              borderRadius: 120,
              backgroundColor: backgroundColor,
            }}>
            <Text
              style={{
                paddingTop: 6,
                width: 70,
                height: 70,
                textAlign: "center",
                fontFamily: "robotomono-bold",
                fontSize: 40,
                color: buttonColor,
              }}>
              {consumedToday}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 12,
              textAlign: "center",
              fontFamily: "robotomono-regular",
            }}>
            {consumedText}
          </Text>
        </View>

        <IconButton
          icon="add-circle"
          size={60}
          color={buttonColor}
          onPress={increase}
        />
      </View>

      <View
        style={{
          marginTop: 32,
          backgroundColor: Colors.primaryBackgroundLight,
          width: deviceWidth * 0.7,
          height: deviceHeight * 0.3,
          borderRadius: 32,
        }}>
        <Text
          style={{
            padding: 14,
            backgroundColor: Colors.primaryGrey,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            fontFamily: "robotomono-bold",
          }}>
          Notes
        </Text>
        <TextInput
          multiline
          editable
          numberOfLines={5}
          value={notes}
          onChangeText={(text) => setNotes(text)}
          maxLength={400}
          style={{ padding: 10 }}
        />
      </View>
    </View>
  );
}

export default SubstanceHabitLog;
