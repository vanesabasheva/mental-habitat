import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import Button from "../../ui/Button";
import Input from "./Input";
import { DismissKeyboard } from "../../screens/QuestionsScreen";

function AuthForm({ isLogin, onSubmit, credentialsInvalid }) {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [fullName, setEnteredFullName] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");

  const { email: emailIsInvalid, password: passwordIsInvalid } =
    credentialsInvalid;

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case "email":
        setEnteredEmail(enteredValue);
        break;
      case "fullName":
        setEnteredFullName(enteredValue);
        break;
      case "password":
        setEnteredPassword(enteredValue);
        break;
    }
  }

  function submitHandler() {
    onSubmit({
      email: enteredEmail,
      fullName: fullName,
      password: enteredPassword,
    });
  }

  return (
    <ScrollView automaticallyAdjustKeyboardInsets={true} style={styles.form}>
      <DismissKeyboard>
        <View>
          {!isLogin && (
            <Input
              label="Full Name"
              onUpdateValue={updateInputValueHandler.bind(this, "fullName")}
              value={fullName}
            />
          )}
          <Input
            label="Email"
            onUpdateValue={updateInputValueHandler.bind(this, "email")}
            value={enteredEmail}
            keyboardType="email-address"
            isInvalid={emailIsInvalid}
          />

          <Input
            label="Password"
            onUpdateValue={updateInputValueHandler.bind(this, "password")}
            secure
            value={enteredPassword}
            isInvalid={passwordIsInvalid}
          />

          <View style={styles.buttons}>
            <Button onPress={submitHandler}>
              {isLogin ? "Log In" : "Sign Up"}
            </Button>
          </View>
        </View>
      </DismissKeyboard>
    </ScrollView>
  );
}

export default AuthForm;

const styles = StyleSheet.create({
  buttons: {
    marginTop: 12,
  },
});
