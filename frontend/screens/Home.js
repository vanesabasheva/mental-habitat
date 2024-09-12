import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Modal,
  Alert,
  ImageBackground,
} from "react-native";
import { AuthContext } from "../store/auth-context";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import PlanetLevel1 from "../assets/svgs/PlanetLevel1.svg";
import GreyPlanet from "../assets/svgs/GreyPlanet.svg";
import ProgressBar from "../ui/ProgressBar";
import { useAssets } from "expo-asset";

const imageSrc = require("../assets/imgs/level1.png");

function HomeScreen() {
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const userFirstName = "George";
  const [fetchedMessage, setFetchedMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [assets, error] = useAssets([require("../assets/imgs/level1.png")]);
  useEffect(() => {
    // fetch(
    //   "https://react-native-course-c14bc-default-rtdb.firebaseio.com/messages.json"
    // )
    //   .then((response) => response.json())
    //   .then((data) => setFetchedMessage(data));
    //console.log(response);
    //console.log(fetchedMessage);
  }, []);

  function openStoryHandler() {
    console.log("Planet clicked");
    setModalVisible(true);
  }

  return (
    <>
      <View style={styles.container}>
        <LinearGradient
          // Background Linear Gradient
          colors={[Colors.primaryBackgroundLight, "white"]}
          style={styles.background}
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {/* {assets ? (
                <ImageBackground
                  source={assets[0]}
                  style={{
                    flex: 1,
                    resizeMode: "cover",
                    justifyContent: "center",
                  }}
                />
              ) : null} */}
              <Pressable
                style={({ pressed }) => (pressed ? [{ opacity: 0.7 }] : null)}
                onPress={() => setModalVisible(!modalVisible)}>
                <Ionicons name="remove" size={32} color="black" />
              </Pressable>
              <Text style={styles.modalText}>MISSION 1</Text>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "robotomono-bold",
                  marginBottom: 10,
                }}>
                Planet KP403 Story
              </Text>
              <Text style={{ fontSize: 14, fontFamily: "robotomono-regular" }}>
                Planet KP403, known to the interstellar community as "Whisper,"
                has long been shrouded in mystery. Ancient space records hint at
                a civilization that once thrived here, skilled in harmonizing
                technology with nature. However, hundreds of years ago, a sudden
                and unexplained silence fell over the planet, and it has since
                been left untouched and forgotten by the wider galaxy. Legend
                has it that KP403 was a hub for the brightest minds, a place
                where scientists and artists alike gathered to share knowledge
                and ideas. Their cities were said to glow gently at night, a
                testament to their commitment to balance and peace. However one
                fateful day...
              </Text>
            </View>
          </View>
        </Modal>

        <View>
          <Text style={styles.welcomeMessage}>
            Welcome back to your mission, {userFirstName}!
          </Text>
          <Text style={styles.description}>Log actions towards your goals</Text>
          <Text style={styles.description}>to unlock the next planet.</Text>
        </View>

        <View style={{ alignSelf: "flex-end" }}>
          <GreyPlanet width={150} height={150} />
        </View>

        <View style={{ flexDirection: "row", alignSelf: "center" }}>
          <Pressable
            android_ripple={{ radius: 2, color: Colors.primaryGrey }}
            onPress={() => setModalVisible(true)}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.7 : 1,
              },
              styles.wrapperCustom,
            ]}>
            <PlanetLevel1 width={200} height={200} />
          </Pressable>
          <Text>The engines will be placed here</Text>
          <View
            style={{
              transform: [{ rotate: "220deg" }],
              position: "absolute",
              left: 200,
              bottom: 160,
            }}>
            <ProgressBar
              percentage={20}
              completedColor={Colors.primaryBold}
              incompletedColor={Colors.primaryGrey}
            />
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: "",
    alignItems: "center",
    paddingTop: 70,
    gap: 100,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: Dimensions.get("window").height,
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
  centeredView: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    //marginTop: 22,
  },
  modalView: {
    height: Dimensions.get("window").height / 1.5,
    width: Dimensions.get("window").width,
    margin: 0,
    backgroundColor: "white",
    borderRadius: 20,
    paddingTop: 10,
    padding: 40,
    alignItems: "center",
    shadowColor: "#333",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 24,
    fontFamily: "robotomono-bold",
  },
});

export default HomeScreen;
