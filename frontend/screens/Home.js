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
import ProgressStarsBackground from "../assets/svgs/ProgressStarsBackground.svg";
import ProgressBar from "../ui/ProgressBar";
import { useAssets } from "expo-asset";
import ShipProgress from "../ui/ShipProgress";
import Button from "../ui/Button";

const imageSrc = require("../assets/imgs/level1.png");
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
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

  return (
    <>
      <View style={styles.container}>
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

        <View style={{ alignSelf: "flex-end", zIndex: 10 }}>
          <GreyPlanet width={150} height={150} />
        </View>

        <View
          style={{
            flexDirection: "row",
            alignSelf: "baseline",
            marginHorizontal: screenWidth * 0.03,
          }}>
          <View
            style={{
              position: "absolute",
              left: screenWidth * 0.2,
              bottom: screenHeight * 0.1,
            }}>
            <ProgressStarsBackground />
          </View>
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

          {/* {Engines} */}
          <View
            style={{
              transform: [{ rotate: "220deg" }],
              position: "absolute",
              left: screenWidth * 0.5,
              bottom: screenHeight * 0.18,
            }}>
            <ProgressBar
              percentage={20}
              completedColor={Colors.primaryBold}
              incompletedColor={Colors.primaryGrey}
              stepStyle={{ transform: [{ rotate: "90deg" }] }}
              gap={15}
            />
          </View>
        </View>

        <View
          style={{
            // transform: [{ rotate: "90deg" }],
            position: "absolute",
            left: screenWidth * 0.55,
            bottom: screenHeight * 0.25,
          }}>
          <ShipProgress></ShipProgress>
        </View>

        <View style={styles.messageContainer}>
          <LinearGradient
            // Background Linear Gradient
            colors={["white", Colors.primaryBackgroundLight]}
            style={styles.background}
          />

          <Text style={{ fontFamily: "robotomono-regular", fontSize: 12 }}>
            You've landed on the KP403, a place of peace and quiet. Click on the
            planet to reveal its secrets!
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 70,
    gap: screenHeight * 0.04,
    backgroundColor: Colors.primaryBackgroundLight,
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
  },
  modalView: {
    height: screenHeight * 0.7,
    width: screenWidth,
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
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  messageContainer: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: 50,
    backgroundColor: Colors.primaryBackgroundLight,
    marginHorizontal: screenWidth * 0.05,
    height: screenHeight * 0.15,
    paddingTop: screenWidth * 0.07,
    paddingHorizontal: screenWidth * 0.05,
  },
});

export default HomeScreen;
