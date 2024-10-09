import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import { Dimensions } from "react-native";
import HomeScreen from "../../screens/Home";
import HabitsScreen from "../../screens/Habits";
import DrawerNav from "./Drawer";
import MessagesScreen from "../../screens/Messages";
import Settings from "../../screens/Settings";
import StatisticsScreen from "../../screens/Statistics";

const screenWidth = Dimensions.get("window").width;
const iconSize = screenWidth * 0.08; // 9% of screen width

const Tab = createBottomTabNavigator();
function BottomTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Habits") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "Drawer") {
            iconName = focused ? "person-circle" : "person-circle-outline";
          } else if (route.name === "Messages") {
            iconName = focused
              ? "chatbubble-ellipses"
              : "chatbubble-ellipses-outline";
          } else if (route.name === "Statistics") {
            iconName = focused ? "stats-chart" : "stats-chart-outline";
          }

          return <Ionicons name={iconName} size={iconSize} color={color} />;
        },
        tabBarStyle: {
          position: "absolute",
          margin: screenWidth * 0.05,
          paddingHorizontal: screenWidth * 0.03,
          borderTopWidth: 0,
          borderRadius: 42,
          elevation: 1,
          shadowColor: Colors.primaryBold,
          shadowRadius: 4,
          shadowOffset: { width: 1, height: 1 },
          shadowOpacity: 0.2,
          height: screenWidth * 0.17,
        },
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.primaryBold,
        tabBarInactiveTintColor: Colors.primaryGrey,
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Habits" component={HabitsScreen} />
      <Tab.Screen name="Statistics" component={StatisticsScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Drawer" component={Settings} />
    </Tab.Navigator>
  );
}

export default BottomTab;
