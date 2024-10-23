import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Colors } from "../constants/Colors";
import IconButton from "../ui/ButtonIcon";
import { useContext } from "react";
import { AuthContext } from "../store/auth-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Achievements from "./Achievements";

const Stack = createNativeStackNavigator();

function SettingsPage({ navigation }) {
  const authCtx = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          <Text style={{ fontFamily: "robotomono-bold", fontSize: 20 }}>
            George Johnson{" "}
          </Text>
          <Text>George.Johnson@email.com</Text>
        </View>
        <View>
          <IconButton
            icon="exit-outline"
            size={32}
            color={Colors.primaryBold}
            onPress={authCtx.signOut}
          />
        </View>
      </View>
      <View style={{ gap: 12 }}>
        <TouchableOpacity
          onPress={() => navigation.push("Achievements")}
          style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
          <Ionicons
            name="planet-outline"
            size={24}
            color={Colors.primaryBold}
          />
          <Text style={styles.screenText}>Achievements</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
          <Ionicons name="cog-outline" size={24} color={Colors.primaryBold} />
          <Text style={styles.screenText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Settings({ navigation }) {
  //navigation.navigate()

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Page" component={SettingsPage} />
      <Stack.Screen name="Achievements" component={Achievements} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackgroundLight,
    paddingTop: 70,
    gap: 50,
    padding: 32,
    // alignItems: "flex-start",
  },
  screenText: {
    fontSize: 16,
    fontFamily: "robotomono-bold",
    color: Colors.primaryText,
  },
});

export default Settings;
