import { useContext, useEffect, useState } from "react";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Colors } from "../constants/Colors";
import Button from "../ui/Button";
import { AnswersContext } from "../store/answers-context";
import { deviceWidth, deviceHeight } from "../constants/Dimensions";

export const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const questions = [
  {
    id: 1,
    type: "multipleChoice",
    question: "What are your primary goals for improving your health?",
    options: [
      "Quit Smoking",
      "Increase Physical Activity",
      "Minimize Alcohol Consumption",
      "Improve Nutrition",
    ],
  },
  {
    id: 2,
    type: "choice",
    question: "How would you describe your current diet?",
    options: ["Mostly Healthy", "Balanced (50/50)", "Mostly Processed"],
  },
  {
    id: 3,
    type: "choice",
    question:
      "How important do you believe nutrition is to your overall health",
    options: [
      "No strong opinion",
      "Very important",
      "There are more significant factors",
    ],
  },
  {
    id: 4,
    type: "choice",
    question: "What does your typical exercise routine look like?",
    options: ["Workout weekly", "Workout seldom", "I don't workout"],
  },
  {
    id: 5,
    type: "choice",
    question:
      "What are your thoughts regarding the importance of physical activity?",
    options: ["No strong opinion", "Very important", "Not so important"],
  },
  {
    id: 6,
    type: "choice",
    question: "How often do you experience stress?",
    options: [
      "Rarely/Never",
      "Constantly",
      "Occasionally during certain periods",
    ],
  },
  {
    id: 7,
    type: "multipleChoice",
    question: "What methods do you typically use to manage stress?",
    options: [
      "Smoking",
      "Alcohol",
      "Food",
      "Physical Activity",
      "Digital Distractions",
      "Social Interaction",
    ],
  },
  {
    id: 8,
    type: "text",
    question:
      "Have you attempted to make lifestyle changes in the past? What were the outcomes?",
  },
  {
    id: 9,
    type: "text",
    question: "What motivates you to make these health changes now?",
  },
  {
    id: 10,
    type: "text",
    question: "What is your most important health goal at the moment?",
  },
  {
    id: 11,
    type: "text",
    question:
      "What are the main obstacles you face in achieving your health goals",
  },
  {
    id: 12,
    type: "text",
    question: "How would you describe your ideal healthy lifestyle?",
  },
  {
    id: 13,
    type: "text",
    question:
      "How do you expect changes in your diet and lifestyle to affect other areas of your life?",
  },
  // {
  //   id: 14,
  //   type: "scale",
  //   question:
  //     "On a scale of 1-10, how confident are you in your ability to make lasting changes to your diet and lifestyle?",
  // },
  // {
  //   id: 15,
  //   type: "scale",
  //   question:
  //     "On a scale of 1-10, how important is it for you to achieve your health goals?",
  // },
];

function QuestionsScreen({ route, navigation }) {
  const { questionId } = route.params;
  const question = questions.find((q) => q.id === questionId);
  const answersCtx = useContext(AnswersContext);
  const answers = answersCtx.answers[questionId];

  const currentAnswer = answersCtx.answers[questionId] || "";
  const [textInput, setTextInput] = useState(currentAnswer);

  const handleSelectOption = (option) => {
    console.log(option);
    if (answers.includes(option)) {
      answersCtx.removeAnswer(questionId, option);
    } else {
      answersCtx.addAnswer(questionId, option);
    }
  };

  const handleSingleChoice = (option) => {
    if (answers.length !== 0) {
      answersCtx.replaceAnswer(questionId, option);
    } else {
      answersCtx.addAnswer(questionId, option);
    }
  };

  const renderAnswerField = () => {
    switch (question.type) {
      case "multipleChoice":
        return (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-around",
              maxWidth: "70%",
              minWidth: "70%",
              gap: 15,
              marginBottom: 12,
            }}>
            {question.options.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => handleSelectOption(option)}
                style={{
                  padding: 25,
                  backgroundColor: answers.includes(option)
                    ? Colors.primaryBold
                    : Colors.primaryGrey,
                  maxWidth: "50%",
                  borderRadius: 12,
                }}>
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case "choice":
        return (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-around",
              maxWidth: "70%",
              gap: 12,
              marginBottom: 12,
            }}>
            {question.options.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => handleSingleChoice(option)}
                style={{
                  padding: 15,
                  backgroundColor: answers.includes(option)
                    ? Colors.primaryBold
                    : Colors.primaryGrey,
                  minWidth: "80%",
                  borderRadius: 12,
                }}>
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case "yesno":
        return (
          <View
            style={{ flexDirection: "row", justifyContent: "space-around" }}>
            <Button
              title="Yes"
              onPress={() => setAnswers("Yes")}
              color={answers === "Yes" ? "blue" : "gray"}
            />
            <Button
              title="No"
              onPress={() => setAnswers("No")}
              color={answers === "No" ? "blue" : "gray"}
            />
          </View>
        );
      case "text":
        return (
          <DismissKeyboard>
            <View
              style={{
                marginTop: 32,
                backgroundColor: "white",
                width: deviceWidth * 0.7,
                height: deviceHeight * 0.25,
                borderRadius: 32,
                marginBottom: 12,
                padding: 12,
              }}>
              <TextInput
                multiline
                numberOfLines={4}
                editable
                value={textInput}
                onChangeText={(text) => setTextInput(text)}
                style={{ padding: 10 }}
              />
            </View>
          </DismissKeyboard>
        );
      default:
        return null;
    }
  };

  const goToNextQuestion = () => {
    if (questionId < questions.length) {
      if (question.type === "text") {
        console.log("Trying to pass text input:" + textInput);
        if (answers.length !== 0) {
          console.log("there is already an answer");
          answersCtx.replaceAnswer(questionId, textInput);
        } else {
          answersCtx.addAnswer(questionId, textInput);
        }
      }
      navigation.push("QuestionScreen", { questionId: questionId + 1 });
    } else {
      answersCtx.addAnswer(questionId, textInput);
      console.log("All answers submitted.");
      console.log(answersCtx.answers);
      navigation.navigate("StoryScreen");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question.question}</Text>
      {renderAnswerField()}
      <Button onPress={goToNextQuestion}>Next</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primaryBackgroundLight,
  },
  question: {
    fontWeight: "bold",
    fontSize: 18,
    padding: 20,
    textAlign: "center",
  },
});

export default QuestionsScreen;
