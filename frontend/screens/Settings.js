import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/Colors";
import IconButton from "../ui/ButtonIcon";
import { useContext } from "react";
import { AuthContext } from "../store/auth-context";
import Ionicons from "@expo/vector-icons/Ionicons";

function Settings() {
  const authCtx = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <View>
        <Text style={{ fontFamily: "robotomono-bold", fontSize: 20 }}>
          George Johnson{" "}
        </Text>
        <Text>George.Johnson@email.com</Text>
      </View>
      <View>
        <Text>
          <Ionicons name="planet-outline" size={24} color="black" />{" "}
          Achievements
        </Text>
        <Text>
          <Ionicons name="cog-outline" size={24} color="black" />
          Settings
        </Text>
      </View>
      <IconButton
        icon="exit-outline"
        size={32}
        color={Colors.primaryBold}
        onPress={authCtx.signOut}
      />
    </View>
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
});

export default Settings;
