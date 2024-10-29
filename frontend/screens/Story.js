import { View, StyleSheet, Text } from "react-native";
import { screenHeight, screenWidth } from "../constants/Dimensions";
import { Colors } from "../constants/Colors";
import ZenithIcon from "../assets/svgs/StoryIcons/Zenith.svg";
import TulipsPlanet from "../assets/svgs/StoryIcons/TulipsPlanet.svg";
import UFOPlanet from "../assets/svgs/StoryIcons/UFOPlanet.svg";
import CaptainStarling from "../assets/svgs/StoryIcons/CaptainStarling.svg";
import Startup from "../assets/svgs/StoryIcons/Startup.svg";
import PlanetLevel1 from "../assets/svgs/LevelsIcons/PlanetLevel1.svg";
import FlatButton from "../ui/ButtonFlat";
import BackgroundStarsBig from "../assets/svgs/BackgroundStarsBig.svg";
import { useContext } from "react";
import { AnswersContext } from "../store/answers-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const story = [
  {
    id: 1,
    title: "LIFE ON ZENITH",
    plot: "Mike Starling has spent his life on the peaceful planet of Zenith, a world known for its serene landscapes and tranquil living. ",
    background: (
      <View>
        <ZenithIcon width={240} height={240} />
        <View style={{ position: "absolute" }}>
          <TulipsPlanet width={240} height={240} />
        </View>
      </View>
    ),
  },
  {
    id: 2,
    title: "LONGING TO EXPLORE",
    plot: "Despite the comfort and simplicity of life on Zenith, Starling has always felt a deep, irresistible urge to explore beyond the ordinary.He believes that true adventure lies in the unknown and that the universe holds secrets only the brave can uncover.",
    background: (
      <View>
        <View style={{ position: "absolute", top: -200, right: -100 }}>
          <BackgroundStarsBig />
        </View>
        <UFOPlanet width={200} height={200} />
        <CaptainStarling width={200} height={200} />
      </View>
    ),
  },
  {
    id: 3,
    title: "SPEEDING TO SPACE",
    plot: "Encouraged by tales of ancient explorers and driven by his innate curiosity, Starling enrolls in the Interstellar Exploration Program, quickly rising through the ranks with his keen intellect and unwavering determination. As the newly appointed captain of the spacecraft Odyssey, he now stands ready for a brand new mission. And you, George, are a Lead Operations Commander in captain Starling's team, traveling across the cosmos, seeking new worlds.",
    background: (
      <View>
        <View style={{ position: "absolute", top: -400, right: -100 }}>
          <BackgroundStarsBig />
        </View>
        <Startup />
      </View>
    ),
  },
  {
    id: 4,
    title: "ODYSSEY'S FIRST MISSION",
    plot: "The Odyssey's first big trip, under the directive of the Galactic Exploration Authority, is to investigate the new territories of the Caelus System, starting with the distant and mysterious planet KP403. Not much is known about KP403, except that it's quiet and doesn't seem to pose any dangers from what we can see. As you approach KP403, Captain Starling gathers the crew for a briefing: Team, we all chose this journey to find the new and unknown. KP403 is our first stop, a place no one else has seen in our time. Let's be careful but curious as we unravel the mysteries that this planet holds.",
    background: (
      <View>
        <View style={{ position: "absolute", top: -400, right: -100 }}>
          <BackgroundStarsBig />
        </View>
        <PlanetLevel1 />
      </View>
    ),
  },
];

function Story({ route, navigation }) {
  const storyPart = route.params.story;
  const storyline = story.find((subStory) => subStory.id === storyPart);

  let buttonText = storyPart !== 4 ? "Continue" : "Launch Mission";
  const answersCtx = useContext(AnswersContext);

  const nextScreenHandler = async () => {
    if (storyPart !== 4) {
      navigation.push("StoryScreen", { story: storyPart + 1 });
    } else {
      console.log(answersCtx);

      // store data on the device so that when app is closed, the answers persist
      const answersString = JSON.stringify(answersCtx.answers);
      await AsyncStorage.setItem("hasCompletedSurvey", "true");
      await AsyncStorage.setItem("answers", answersString);

      //TODO: post request to /post habit for initial 2-3 habits

      answersCtx.setHasCompletedSurvey(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{storyline.title}</Text>
        <Text style={styles.plot}>{storyline.plot}</Text>
      </View>
      {storyline.background}
      <FlatButton onPress={nextScreenHandler}>{buttonText} &rarr;</FlatButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.primaryBackgroundLight,
    paddingHorizontal: 24,
    paddingTop: 32,
    gap: 12,
  },
  textContainer: {
    zIndex: 10,
    gap: 12,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: "robotomono-bold",
    fontSize: 18,
  },
  plot: {
    fontFamily: "robotomono-regular",
    fontSize: 16,
  },
});
export default Story;
