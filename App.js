import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Colors } from "./constants/Colors";
import AuthContextProvider, { AuthContext } from "./store/auth-context";
import HomeScreen from "./screens/Home";
import SignInScreen from "./screens/SignIn";
import SignUpScreen from "./screens/SignUp";

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
            <Stack.Screen name="Home" component={HomeScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <>
      <StatusBar />
      <AuthContextProvider>
        <Navigation />
      </AuthContextProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
