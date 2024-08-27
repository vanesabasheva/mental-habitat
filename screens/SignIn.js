import { AuthContext } from "../store/auth-context";
import { useContext, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import AuthForm from "../components/Auth/AuthForm";
import FlatButton from "../ui/ButtonFlat";
import LoadingOverlay from "../ui/LoadingOverlay";
import { signInUser } from "../util/auth";

function SignInScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
  });
  const authCtx = useContext(AuthContext);

  async function authenticateHandler() {
    setIsLoading(true);
    try {
      const token = await signInUser(email, password);
      authCtx.signIn(token);
    } catch (e) {
      //TODO: add error message
      Alert.alert(
        "Signing In failed!",
        "Could not log you in. Please check again later or check credentials. "
      );
      setIsLoading(false);
    }
  }

  function submitHandler(credentials) {
    let { email, fullName, password } = credentials;
    email = email.trim();
    password = password.trim();

    const emailIsValid = email.includes("@");
    const passwordIsValid = password.length > 6;

    if (!emailIsValid || !passwordIsValid) {
      setCredentialsInvalid({
        email: !emailIsValid,
        password: !passwordIsValid,
      });
      return;
    }
    authenticateHandler();
  }

  function changeSignMode() {
    navigation.navigate("SignUp");
  }

  if (isLoading) {
    return <LoadingOverlay message={"Logging you in..."} />;
  }

  return (
    <>
      <Text style={styles.label}>RETURN TO YOUR SPACE MISSION</Text>
      <View style={styles.authContent}>
        <AuthForm
          isLogin={true}
          onSubmit={submitHandler}
          credentialsInvalid={credentialsInvalid}
        />
        <View style={styles.buttons}>
          <Text style={{ fontFamily: "RobotoMono-Bold" }}>
            DON'T HAVE A MISSION?
          </Text>
          <FlatButton onPress={changeSignMode}>{"Register"}</FlatButton>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  authContent: {
    marginTop: 16,
    marginHorizontal: 36,
    padding: 16,
    borderRadius: 8,
    //backgroundColor: Colors.primaryLight,
    elevation: 2,
    shadowColor: "black",
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
  label: {
    fontFamily: "RobotoMono-Bold",
    fontSize: 32,
    marginLeft: 42,
    marginRight: 200,
    marginTop: 32,
  },
});

export default SignInScreen;
