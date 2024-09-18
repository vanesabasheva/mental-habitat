import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, Alert } from "react-native";
import { Colors } from "../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { SwipeListView } from "react-native-swipe-list-view";
import IconButton from "../ui/ButtonIcon";
import Ionicons from "@expo/vector-icons/Ionicons";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

function MessagesScreen() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      message: "Lorem ipsum Lorem ipsum! This is a message blablablablabla",
    },
    {
      id: 2,
      message:
        "VirtualizedList: You have a large list that is slow to update - makesure your renderItem function renders components that follow Reactperformance best practices",
    },
    {
      id: 3,
      message:
        "VirtualizedList: You have a large list that is slow to update - make sure your renderItem function renders components that follow React performance best practices",
    },
  ]);

  const renderMessageItem = (data) => {
    return (
      <View style={styles.messageContainer}>
        <LinearGradient
          colors={["white", Colors.primaryBackgroundLight]}
          style={styles.background}
        />
        <Text style={styles.messageTitle}>{data.item.id}</Text>
        <Text style={styles.messageText}>{data.item.message}</Text>
      </View>
    );
  };

  const renderHiddenItem = (data, rowMap) => {
    return (
      <View style={styles.hiddenContainer}>
        <Text
          style={styles.backRightBtn}
          onPress={() => deleteMessage(rowMap, data.item.id)}>
          <Ionicons
            name="trash"
            size={screenWidth * 0.08}
            color={Colors.primaryBold}
          />
        </Text>
      </View>
    );
  };

  const deleteMessage = (rowMap, messageId) => {
    Alert.alert(
      "Delete Message",
      "Are you sure you want to delete this message?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            const newMessages = messages.filter(
              (item) => item.id !== messageId
            );
            setMessages(newMessages);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Messages</Text>
      <SwipeListView
        data={messages}
        renderItem={renderMessageItem}
        renderHiddenItem={renderHiddenItem}
        leftOpenValue={75}
        rightOpenValue={-75}
        disableRightSwipe={true}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: screenWidth * 0.05,
    paddingTop: screenHeight * 0.05,
    backgroundColor: Colors.primaryBackgroundLight,
    overflow: "hidden",
    elevation: 1,
    shadowColor: Colors.primaryBackground,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.9,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    borderRadius: 32,
    borderTopRightRadius: 32,
  },
  messageContainer: {
    backgroundColor: "white",
    marginVertical: 12,
    paddingHorizontal: screenWidth * 0.1,
    paddingVertical: screenHeight * 0.02,
    borderRadius: 32,
  },
  headerText: {
    fontSize: 24,
    fontFamily: "robotomono-bold",
  },
  messageTitle: {
    fontFamily: "robotomono-bold",
  },
  messageText: {
    fontFamily: "robotomono-regular",
    fontSize: 12,
  },
  hiddenContainer: {
    backgroundColor: "white",
    marginVertical: 12,
    paddingHorizontal: screenWidth * 0.1,
    paddingVertical: screenHeight * 0.02,
    borderRadius: 32,
    alignItems: "center",
    overflow: "hidden",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backRightBtn: {
    position: "absolute",
    right: 20,
  },
});

export default MessagesScreen;
