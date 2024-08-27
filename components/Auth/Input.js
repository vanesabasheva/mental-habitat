import { View, Text, TextInput, StyleSheet } from "react-native";
import { Colors } from "../../constants/Colors";

function Input({
  label,
  keyboardType,
  secure,
  onUpdateValue,
  value,
  isInvalid,
}) {
  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, isInvalid && styles.labelInvalid]}>
        {label}
      </Text>
      <TextInput
        style={[styles.input, isInvalid && styles.inputInvalid]}
        autoCapitalize={false}
        keyboardType={keyboardType}
        secureTextEntry={secure}
        onChangeText={onUpdateValue}
        value={value}
      />
    </View>
  );
}

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 8,
  },
  label: {
    color: "black",
    marginBottom: 4,
    fontFamily: "robotomono-bold",
  },
  labelInvalid: {
    color: Colors.error500,
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: "white",
    borderRadius: 12,
    fontSize: 16,
  },
  inputInvalid: {
    backgroundColor: Colors.error100,
    borderColor: Colors.error100,
    borderWidth: 1,
  },
});
