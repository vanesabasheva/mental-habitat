import { View, StyleSheet, Text } from "react-native";
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
import { BACKEND_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../store/auth-context";
const backendURL = `${BACKEND_URL}/habits`;

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

const prefillHabits = async (answers, token) => {
  try {
    const answerQ1 = answers[1];
    console.log("Habit answer 1" + answerQ1);

    const habitObjects = answerQ1
      .map((answer) => {
        let habitObject = {};
        switch (answer) {
          case "Quit Smoking":
            habitObject.title = "Have healthy lungs";
            habitObject.category = "Smoking";
            habitObject.numberOfCigarettes = "2";
            break;
          case "Increase Physical Activity":
            habitObject.title = "Walking";
            habitObject.category = "Exercise";
            habitObject.duration = "30";
            habitObject.distance = "3";
            break;
          case "Minimize Alcohol Consumption":
            habitObject.title = answers[9];
            habitObject.category = "Alcohol";
            habitObject.numberOfDrinks = 2;
            break;
          case "Improve Nutrition":
            habitObject.title = "Eat 5 veggies today";
            habitObject.category = "Diet";
            habitObject.habitType = "new";
            break;
          default:
            return null;
        }
        return habitObject;
      })
      .filter((h) => h !== null);

    console.log(habitObjects);
    if (!habitObjects) {
      console.log("No habits were set.");
      return;
    }
    if (habitObjects.length > 0) {
      // loop through habitObjects to send multiple requests
      habitObjects.forEach(async (habitObject) => {
        const response = await axios.post(backendURL, habitObject, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Habit is set: " + response.data);
      });
    }
  } catch (error) {
    console.log(error);
  }
};

function Story({ route, navigation }) {
  const storyPart = route.params.story;
  const storyline = story.find((subStory) => subStory.id === storyPart);

  let buttonText = storyPart !== 4 ? "Continue" : "Launch Mission";
  const answersCtx = useContext(AnswersContext);
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;

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
      await prefillHabits(answersCtx.answers, token);
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
