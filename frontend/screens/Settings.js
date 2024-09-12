import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/Colors";

function Settings() {
  return (
    <View style={styles.container}>
      <View>
        <Text>George Johnson Name</Text>
        <Text>George.Johnson@email.com</Text>
      </View>
      <View>
        <Text>Statistics</Text>
        <Text>Achievements</Text>
        <Text>Settings</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackgroundLight,
    paddingTop: 64,
    padding: 16,
  },
});

export default Settings;
