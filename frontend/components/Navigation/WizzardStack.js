import { createNativeStackNavigator } from "@react-navigation/native-stack";
import QuestionsScreen from "../../screens/QuestionsScreen";
import Story from "../../screens/Story";
import { Colors } from "../../constants/Colors";

const Stack = createNativeStackNavigator();

function WizzardStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitle: "Questionnaire",
        headerStyle: { backgroundColor: Colors.primaryBackgroundLight },
        headerTintColor: Colors.primaryBold,
      }}>
      <Stack.Screen
        name="QuestionScreen"
        component={QuestionsScreen}
        initialParams={{ questionId: 1 }}
      />
      <Stack.Screen
        options={{
          headerTitle: "Story",
        }}
        name="StoryScreen"
        component={Story}
        initialParams={{ story: 1 }}
      />
    </Stack.Navigator>
  );
}

export default WizzardStack;
