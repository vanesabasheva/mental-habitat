import { useContext, useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { AuthContext } from "../store/auth-context";

function HomeScreen() {
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const [fetchedMessage, setFetchedMessage] = useState("");
  useEffect(() => {
    fetch(
      "https://react-native-course-c14bc-default-rtdb.firebaseio.com/messages.json"
    )
      .then((response) => response.json())
      .then((data) => setFetchedMessage(data));
    //console.log(response);

    console.log(fetchedMessage);
  }, []);
  return (
    <View>
      <Text>{fetchedMessage}</Text>
      <Button title="Sign out" />
    </View>
  );
}

export default HomeScreen;
