import "./gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useContext, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Colors } from "./constants/Colors";
import AuthContextProvider, { AuthContext } from "./store/auth-context";
import HomeScreen from "./screens/Home";
import SignInScreen from "./screens/SignIn";
import SignUpScreen from "./screens/SignUp";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { View, Text } from "react-native";
import IconButton from "./ui/ButtonIcon";
import BottomTab from "./components/Navigation/BottomTab";
import DrawerNav from "./components/Navigation/Drawer";
//SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

function Navigation() {
  const authCtx = useContext(AuthContext);
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primaryBackgroundLight },
          headerTintColor: "white",
          contentStyle: { backgroundColor: Colors.primaryBackgroundLight },
        }}>
        {authCtx.isSignedIn ? (
          <>
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
          </>
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
        <Navigation />
      </AuthContextProvider>
    </>
  );
}
