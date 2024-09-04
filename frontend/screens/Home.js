import { useContext, useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { AuthContext } from "../store/auth-context";

function HomeScreen() {
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const userFirstName = "George";
  const [fetchedMessage, setFetchedMessage] = useState("");
  useEffect(() => {
    // fetch(
    //   "https://react-native-course-c14bc-default-rtdb.firebaseio.com/messages.json"
    // )
    //   .then((response) => response.json())
    //   .then((data) => setFetchedMessage(data));
    //console.log(response);
    //console.log(fetchedMessage);
  }, []);
  return (
    <>
      <View style={styles.container}>
        <View>
          <Text style={styles.welcomeMessage}>
            Welcome back to your mission, {userFirstName}!
          </Text>
          <Text style={styles.description}>Log actions towards your goals</Text>
          <Text style={styles.description}>to unlock the next planet.</Text>
        </View>
        <Button title="Sign out" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  welcomeMessage: {
    fontFamily: "robotomono-bold",
    fontSize: 24,
  },
  description: {
    fontFamily: "robotomono-regular",
    fontSize: 14,
    textAlign: "left",
  },
});

export default HomeScreen;
