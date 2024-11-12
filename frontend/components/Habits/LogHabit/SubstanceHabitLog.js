import { useState, useEffect } from "react";
import { View, Text, TextInput, FlatListComponent } from "react-native";
import IconButton from "../../../ui/ButtonIcon";
import { Colors } from "../../../constants/Colors";
import { deviceHeight, deviceWidth } from "../../../constants/Dimensions";
import { scheduleNotificationForHabit } from "../../../util/notifications";
import Button from "../../../ui/Button";

const getNotificationId = (habitEntryId, day) =>
  `substanceLog-${habitEntryId}-${day}`;

async function notifyUserForGoal(
  newConsumedToday,
  habitEntry,
  text,
  goal,
  day
) {
  const notificationId = getNotificationId(habitEntry._id, day);
  const title = `Hey, ${newConsumedToday} ${text} consumed today is over your goal of ${goal}.`;
  const body = "Remember why you do this, you got this!";
  const trigger = {
    seconds: 1,
  };
  await scheduleNotificationForHabit(notificationId, title, body, trigger);
}

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

  function increase() {
    setConsumedToday((prevState) => {
      const newState = (prevState += 1);

      return newState;
    });
  }

  function decrease() {
    setConsumedToday((prevState) => {
      const newState = prevState > 0 ? prevState - 1 : 0;

      return newState;
    });
    //  onLog({ consumedToday: consumedToday, notes: notes });
  }

  async function logHabit() {
    console.log("Logging habit..." + mode + " " + consumedToday);

    if (consumedToday >= goal) {
      await notifyUserForGoal(
        consumedToday,
        habitEntry,
        consumedText,
        goal,
        habitEntry.day
      );
    }

    if (mode === "Smoking") {
      onLog({
        numberOfSmokedCigarettes: consumedToday,
        notes: notes,
      });
    } else {
      onLog({
        numberOfConsumedDrinks: consumedToday,
        notes: notes,
      });
    }
  }

  return (
    <View style={{ alignItems: "center", paddingBottom: deviceHeight * 0.3 }}>
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
          marginBottom: 12,
          overflow: "hidden",
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
      <Button onPress={logHabit}>Save</Button>
    </View>
  );
}

export default SubstanceHabitLog;
