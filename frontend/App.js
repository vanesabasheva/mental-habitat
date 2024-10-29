import "./gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useContext, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Colors } from "./constants/Colors";
import AuthContextProvider, { AuthContext } from "./store/auth-context";
import StatsContextProvider from "./store/stats-context";
import AnswersContextProvider, {
  AnswersContext,
} from "./store/answers-context";
import SignInScreen from "./screens/SignIn";
import SignUpScreen from "./screens/SignUp";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { View, Text, SafeAreaView } from "react-native";
import IconButton from "./ui/ButtonIcon";
import BottomTab from "./components/Navigation/BottomTab";
import * as Notifications from "expo-notifications";
import WizzardStack from "./components/Navigation/WizzardStack";
//SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

function Navigation() {
  const authCtx = useContext(AuthContext);
  const answersCtx = useContext(AnswersContext);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primaryBackgroundLight },
          headerTintColor: "white",
          contentStyle: { backgroundColor: Colors.primaryBackgroundLight },
        }}>
        {authCtx.isSignedIn ? (
          answersCtx.hasCompletedSurvey ? (
            <Stack.Screen
              name="Root"
              component={BottomTab}
              options={{
                headerShown: false,
                headerRight: () => (
                  <IconButton
                    icon="exit-outline"
                    size={32}
                    color={Colors.primaryBold}
                    onPress={authCtx.signOut}
                  />
                ),
              }}
            />
          ) : (
            <>
              <Stack.Screen
                options={{
                  headerShown: false,
                }}
                name="Wizzard"
                component={WizzardStack}
              />
            </>
          )
        ) : (
          <>
            <Stack.Screen name="Sign In" component={SignInScreen} />
            <Stack.Screen name="Sign Up" component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [loaded, error] = useFonts({
    "robotomono-bold": require("./assets/fonts/RobotoMono-Bold.ttf"),
    "robotomono-regular": require("./assets/fonts/RobotoMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return (
      <View>
        <Text>Fonts not loaded</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar />
      <AuthContextProvider>
        <AnswersContextProvider>
          <StatsContextProvider>
            <SafeAreaView
              style={{
                flex: 1,
                backgroundColor: Colors.primaryBackgroundLight,
              }}>
              <Navigation />
            </SafeAreaView>
          </StatsContextProvider>
        </AnswersContextProvider>
      </AuthContextProvider>
    </>
  );
}

async function registerForPushNotificationsAsync() {
  let token;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    alert("Failed to get push token for push notification!");
    return;
  }
  token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log(token);
  return token;
}
