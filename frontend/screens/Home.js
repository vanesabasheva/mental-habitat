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
  Image,
  ScrollView,
} from "react-native";
import { AuthContext } from "../store/auth-context";
import { StatsContext } from "../store/stats-context";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../constants/Colors";
import { useAssets } from "expo-asset";
import { deviceHeight, deviceWidth } from "../constants/Dimensions";

import Carousel from "react-native-reanimated-carousel";
import Ionicons from "@expo/vector-icons/Ionicons";
import PlanetLevel1 from "../assets/svgs/LevelsIcons/PlanetLevel1.svg";
import PlanetLevel2 from "../assets/svgs/LevelsIcons/PlanetLevel2.svg";
import PlanetLevel3 from "../assets/svgs/LevelsIcons/PlanetLevel3.svg";
import PlanetLevel4 from "../assets/svgs/LevelsIcons/PlanetLevel4.svg";

import GreyPlanet from "../assets/svgs/GreyPlanet.svg";
import ProgressStarsBackground from "../assets/svgs/ProgressStarsBackground.svg";
import BackgroundStarsBig from "../assets/svgs/BackgroundStarsBig.svg";

import ProgressBar from "../ui/ProgressBar";
import ShipProgress from "../ui/ShipProgress";
import axios from "axios";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
import { EXPO_PUBLIC_API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const LEVELS = [
  {
    icon: <PlanetLevel1 width={200} height={200} />,
    planetName: "KP403",
    planetDescription: "a place of peace and quite",
    story:
      "Planet KP403, known to the interstellar community as Whisper, has long been shrouded in mystery. Ancient space records hint at a civilization that once thrived here, skilled in harmonizing technology with nature. However, hundreds of years ago, a sudden and unexplained silence fell over the planet, and it has since been left untouched and forgotten by the wider galaxy. Legend has it that KP403 was a hub for the brightest minds, a place where scientists and artists alike gathered to share knowledge and ideas. Their cities were said to glow gently at night, a testament to their commitment to balance and peace. However one fateful day... balance and peace. However one fateful day...,balance and peace. However one fateful day...,balance and peace. However one fateful day...,balance and peace. However one fateful day...",
    images: [
      require("../assets/imgs/level1.webp"),
      require("../assets/imgs/level1-2.webp"),
      require("../assets/imgs/level1-3.webp"),
    ],
  },
  {
    icon: <PlanetLevel2 width={200} height={200} />,
    planetName: "Veloria",
    planetDescription: "a mesmerizing sea of soft pink grass and pink skies",
    story:
      "Captain Starling and his crew were awestruck as they approached the vivid horizon of Veloria—a planet of legends, said to be both a paradise and a peril. Swirling mists of soft pink light enveloped the planet, casting an otherworldly glow across the sleek hull of their ship as they descended. Beneath them stretched an endless expanse of pink grass, interwoven with rivers that shimmered like liquid stardust under the strange twilight skies. But the peaceful exterior masked an ancient enigma, with eerie tales of explorers who had come seeking rest and never left. As the crew stepped foot on Veloria’s surface, they were instantly enveloped in a sense of calm, but something stirred beneath the soil. The shimmering rivers seemed to pulse with life, and the soft breeze carried whispers in a language none of them could understand. The deeper they ventured into Veloria’s heart, the more they sensed the planet was watching, waiting. Just beyond the pink hills, a towering monument emerged—an alien structure etched in symbols too ancient to decipher. It wasn’t long before Captain Starling realized: Veloria wasn’t a sanctuary. It was a trial, a test for those who dared to uncover its truths. The lamma-like creatures, once peaceful, began to follow, their glowing eyes watching every move. They were no longer the serene creatures the crew had first encountered. They were sentinels, guarding the mysteries that had remained unsolved for eons.",
    images: [
      require("../assets/imgs/level2.webp"),
      require("../assets/imgs/level2-2.webp"),
      require("../assets/imgs/level2-3.webp"),
    ],
  },
  {
    icon: <PlanetLevel3 width={230} height={230} />,
    planetName: "Eclipsion",
    planetDescription: " a soft and fluffy world shrouded in mystery",
    story:
      "As your ship touched down on the velvety surface, the crew was greeted by a seemingly peaceful scene. Fluffy, pastel-colored cats with luminous eyes watched curiously from a distance. Their fur rippled in shades of brown, white, and peach, almost as if the planet’s strange energy flowed through them. But Captain Starling could feel it in the air—a tension, a secret buried beneath the calm. The crew soon discovered that these creatures weren’t just passive observers... The creatures, known as the Niyari began to follow the crew. In a race against time, Captain Starling and his team found themselves trapped between the planet’s peaceful allure and the deadly threat of the Nyari. The closer they got to the ruins, the more the landscape twisted—trees became towering shadows, and the once-gentle rivers roared with unearthly force. The Nyari, no longer simply guardians, had become hunters, protecting their world from those who dared to uncover its ancient power. But Captain Starling was determined. Eclipsion's secrets were worth the risk. In the end, it wasn’t the planet’s beauty or its peaceful facade that would define their journey, but whether they could escape the relentless pursuit of its guardians and claim the secrets of time itself before they were lost forever in Eclipsion’s mysterious, ever-changing grasp.",
    images: [
      require("../assets/imgs/level3.webp"),
      require("../assets/imgs/level3-2.webp"),
    ],
  },
  {
    icon: <PlanetLevel4 width={250} height={250} />,
    planetName: "Aquila-9",
    planetDescription: "an archipelago of islands suspended in a sea of mist",
    story:
      "Aquila-9 was a world of beauty and peril, its skies alive with the hypnotic choreography of the Lyran birds. As Captain Starling’s ship touched down on one of the floating islands, the crew found themselves in a place of serene majesty. Towering cliffs, lush vegetation, and thundering waterfalls surrounded them. But this was no ordinary mission of exploration—this was a race against time to preserve the fragile balance of Aquila-9. The crew’s mission was to stabilize Aquila-9’s faltering ecosystem. The planet’s incredible abundance of waterfalls and rivers was fueled by subterranean geysers that, if left unchecked, would flood the islands and send them crashing into the ocean below. The cause? The Lyran birds. These dazzling creatures weren’t predators but terraformers. As they flocked together in massive formations, their synchronized movements triggered vibrations that caused tectonic shifts, disrupting the geysers and sending tremors across the fragile cliffs. Starling and his team had to tread carefully. The birds were not hostile, but their instincts posed a monumental threat. Their elegant dances, breathtaking to witness, were the very thing destabilizing the planet. The crew’s task was to redirect the Lyran migration patterns without upsetting the delicate harmony of Aquila-9’s ecosystem. As they worked to deploy sonic devices designed to guide the flocks, the Lyran birds, though graceful and majestic, were unpredictable—soaring too close to the ship and its equipment, their vibrations threatening to topple their carefully placed devices. Starling and his team had to learn to move with the rhythm of the planet, to work alongside its creatures rather than against them.",
    images: [
      require("../assets/imgs/level4.webp"),
      require("../assets/imgs/level4-2.webp"),
      require("../assets/imgs/level4-3.webp"),
    ],
  },
];

function HomeScreen() {
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const [userFirstName, setUserFirstName] = useState("George");

  const [modalVisible, setModalVisible] = useState(false);

  /////////////////////////////////////////////
  // Initialize User Progress and stats (resources) //
  ////////////////////////////////////////////
  const {
    stats,
    categories,
    incrementStat,
    setAllStats,
    setAllCategories,
    currentLevel,
    setCurrentLevel,
  } = useContext(StatsContext);
  // const [currentLevel, setCurrentLevel] = useState(1);
  const [levelProgress, setLevelProgress] = useState(0);

  ////// HOOKS /////
  //////////////////
  useEffect(() => {
    console.log(EXPO_PUBLIC_API_URL);
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          `${EXPO_PUBLIC_API_URL}/game/progress`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("FETCHING CATEGORIES OF USER...");

        const categoriesResponse = await axios.get(
          `${EXPO_PUBLIC_API_URL}/habits/habitCategories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(categoriesResponse.data);
        const fetchedCategories = categoriesResponse.data.habitCategories;
        console.log(fetchedCategories);
        const idsOfCategories = fetchedCategories.map((item) => item._id);
        console.log("UPDATED CATEGORY OBJECT " + idsOfCategories);
        setAllCategories(idsOfCategories);
        setAllStats(response.data.stats);
        setLevelProgress(response.data.levelProgress);
        setCurrentLevel(response.data.currentLevel);

        console.log(categories);

        const storedName = await AsyncStorage.getItem("fullName");
        if (storedName) {
          setUserFirstName(storedName);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, [levelProgress]);

  const level = LEVELS[currentLevel - 1];

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
          <ScrollView
            contentContainerStyle={styles.centeredView}
            style={{ flexGrow: 1 }}>
            <View style={styles.modalView}>
              <Pressable
                style={({ pressed }) => (pressed ? [{ opacity: 0.7 }] : null)}
                onPress={() => setModalVisible(!modalVisible)}>
                <Ionicons name="remove" size={32} color="black" />
              </Pressable>
              <Text style={styles.modalText}>MISSION {currentLevel}</Text>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "robotomono-bold",
                  marginBottom: 10,
                }}>
                Planet {level.planetName}'s Story
              </Text>
              <Carousel
                loop
                width={screenWidth / 1.2}
                height={screenWidth / 1.5}
                autoPlay={true}
                scrollAnimationDuration={2500}
                data={level.images}
                snapEnabled={true}
                onSnapToItem={(index) => {}}
                mode="parallax"
                renderItem={({ index }) => (
                  <View
                    style={{
                      flex: 1,
                      //borderWidth: 1,
                      justifyContent: "center",
                      // backgroundColor: defaultDataWith6Colors[index],
                      borderRadius: 12,
                    }}>
                    <Image
                      style={{
                        width: screenWidth / 1.2,
                        height: screenWidth / 1.5,
                        overflow: "hidden",
                        borderRadius: 12,
                        // resizeMode: "contain",
                      }}
                      source={level.images[index]}
                    />
                  </View>
                )}
              />
              <Text style={{ fontSize: 14, fontFamily: "robotomono-regular" }}>
                {level.story}
              </Text>
            </View>
          </ScrollView>
        </Modal>

        <View style={{ zIndex: 2 }}>
          <Text style={styles.welcomeMessage}>
            Welcome back, {userFirstName}!
          </Text>
          {/* {Engines} */}
          <ShipProgress
            stats={stats}
            categories={categories}
            setLevelProgress={setLevelProgress}
            setCurrentLevel={setCurrentLevel}></ShipProgress>
        </View>

        <View style={{ alignSelf: "flex-end", zIndex: 2, marginBottom: 12 }}>
          <GreyPlanet width={150} height={150} />
        </View>

        <View
          style={{
            position: "absolute",
            bottom: deviceHeight / 3,
            zIndex: 0,
          }}>
          <BackgroundStarsBig width={deviceWidth} height={deviceHeight} />
        </View>

        <View
          style={{
            flexDirection: "row",
            alignSelf: "baseline",
            marginHorizontal: screenWidth * 0.03,
            zIndex: 3,
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
            {level.icon}
          </Pressable>

          {/* {SpaceShip} */}
          <View
            style={{
              transform: [{ rotate: "220deg" }],
              position: "absolute",
              left: screenWidth * 0.5,
              bottom: screenHeight * 0.18,
              zIndex: 10,
            }}>
            <ProgressBar
              percentage={levelProgress}
              completedColor={Colors.primaryBold}
              incompletedColor={Colors.primaryGrey}
              stepStyle={{ transform: [{ rotate: "90deg" }] }}
              gap={15}
              ship={true}
            />
          </View>
        </View>

        <View style={styles.messageContainer}>
          <LinearGradient
            colors={["white", Colors.primaryBackgroundLight]}
            style={styles.background}
          />

          <Text style={{ fontFamily: "robotomono-regular", fontSize: 12 }}>
            You've landed on {level.planetName}, {level.planetDescription}.
            Click on the planet to reveal its secrets!
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
    paddingTop: screenHeight * 0.05,
    gap: screenHeight * 0.02,
    backgroundColor: Colors.primaryBackgroundLight,
  },
  welcomeMessage: {
    fontFamily: "robotomono-bold",
    fontSize: 24,
    marginBottom: 10,
    marginHorizontal: 15,
  },
  description: {
    fontFamily: "robotomono-regular",
    fontSize: 14,
    textAlign: "left",
  },
  centeredView: {
    flexGrow: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  modalView: {
    //height: screenHeight * 0.9,
    marginTop: 30,
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
    backgroundColor: Colors.primaryBackgroundLight,
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
    position: "absolute",
    bottom: screenHeight * 0.05,
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
