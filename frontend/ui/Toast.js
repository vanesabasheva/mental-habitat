import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useEffect } from "react";
const Toast = ({ setToast, icon, text }) => {
  const bottom = React.useRef(new Animated.Value(280)).current;
  const opacity = React.useRef(new Animated.Value(1)).current;

  function animate() {
    Animated.timing(bottom, {
      toValue: 20,
      duration: 1000,
      useNativeDriver: false,
    }).start(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: false,
      }).start(() => {
        setToast(false);
      });
    });
  }

  useEffect(() => {
    animate();
  }, [text, icon]);

  return (
    <Animated.View style={[styles.container, { bottom, opacity }]}>
      {icon}
      <View style={{ marginLeft: 12 }}>
        <Text
          style={{
            color: "grey",
            fontSize: 14,
            fontFamily: "robotomono-bold",
          }}>
          {text}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    position: "absolute",
    alignItems: "center",
  },
});

export default Toast;
