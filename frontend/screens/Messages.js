import { FlatList, View, Text, StyleSheet, SafeAreaView } from "react-native";
import { Colors } from "../constants/Colors";

function MessagesScreen() {
  let messages = [{ id: 1 }, { id: 2 }, { id: 3 }];
  function renderMessageItem(itemData) {
    return (
      <View style={styles.messageContainer}>
        <Text>{itemData.id}</Text>
        <Text>Lorem ipsum Lorem ipsum! This is a message blablablablabla</Text>
      </View>
    );
  }
  let displayMessages;
  if (messages.length > 0) {
    displayMessages = (
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
      />
    );
  } else {
    displayMessages = <Text>No new messages</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Messages</Text>
      {displayMessages}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 64,

    backgroundColor: Colors.primaryBackgroundLight,
  },
  messageContainer: {
    backgroundColor: Colors.primaryGrey,
    marginVertical: 12,
    padding: 16,
    borderRadius: 32,
  },
  headerText: {
    fontSize: 24,
    fontFamily: "robotomono-bold",
  },
});

export default MessagesScreen;
