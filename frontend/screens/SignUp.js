import { Colors } from "../constants/Colors";
import { useContext, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { AuthContext } from "../store/auth-context";
import AuthForm from "../components/Auth/AuthForm";
import FlatButton from "../ui/ButtonFlat";
import { signUpUser } from "../util/auth";
import LoadingOverlay from "../ui/LoadingOverlay";
import { Alert } from "react-native";

function SignUpScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
  });
  const authCtx = useContext(AuthContext);

  async function authenticateHandler(email, password, fullName) {
    setIsLoading(true);
    try {
      const token = await signUpUser(email, password, fullName);
      authCtx.signIn(token);
    } catch (error) {
      //TODO: add error message
      Alert.alert(
        "Signing Up failed!",
        "Could not sign you up. Please check again later or check credentials. "
      );
      setIsLoading(false);
    }
  }

  function submitHandler(credentials) {
    let { email, fullName, password } = credentials;
    email = email.trim();
    password = password.trim();
    fullName = fullName.trim();

    const emailIsValid = email.includes("@");
    const passwordIsValid = password.length > 6;

    if (!emailIsValid || !passwordIsValid) {
      setCredentialsInvalid({
        email: !emailIsValid,
        password: !passwordIsValid,
      });
      return;
    }
    authenticateHandler(email, password, fullName);
  }

  function changeSignMode() {
    navigation.navigate("Sign In");
  }

  if (isLoading) {
    return <LoadingOverlay message={"Logging you in..."} />;
  }

  return (
    <>
      <Text style={styles.label}>GET STARTED</Text>

      <View style={styles.authContent}>
        <AuthForm
          isLogin={false}
          onSubmit={submitHandler}
          credentialsInvalid={credentialsInvalid}
        />
        <View style={styles.buttons}>
          <Text style={{ fontFamily: "robotomono-bold" }}>
            ALREADY HAVE A MISSION?
          </Text>
          <FlatButton onPress={changeSignMode}>{"Log in instead"}</FlatButton>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: "robotomono-bold",
    fontSize: 32,
    marginLeft: 36,
    marginRight: 200,
    marginTop: 32,
  },
  authContent: {
    marginTop: 16,
    marginHorizontal: 32,
    padding: 16,
    borderRadius: 8,

    shadowColor: "grey",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  buttons: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SignUpScreen;
