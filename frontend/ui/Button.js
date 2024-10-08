import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "../constants/Colors";

function Button({ children, onPress, newStyles, textStyles, disabled }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        newStyles,
        disabled && styles.disabled,
      ]}
      disabled={disabled ? true : false}
      onPress={onPress}>
      <View>
        <Text style={[styles.buttonText, textStyles]}>{children}</Text>
      </View>
    </Pressable>
  );
}

export default Button;

const styles = StyleSheet.create({
  button: {
    borderRadius: 32,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: Colors.primaryBold,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 14,
    //fontWeight: "bold",
  },
  disabled: {
    // Styles for disabled button, e.g., lower opacity
    backgroundColor: Colors.primaryGrey,
    opacity: 0.5,
  },
});
