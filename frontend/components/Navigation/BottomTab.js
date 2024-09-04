import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../../screens/Home";
const Tab = createBottomTabNavigator();
import { Ionicons } from "@expo/vector-icons";
import HabitsScreen from "../../screens/Habits";
import DrawerNav from "./Drawer";
import { Colors } from "../../constants/Colors";

function BottomTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Habits") {
            iconName = focused ? "bookmark" : "bookmark-outline";
          } else if (route.name === "Drawer") {
            iconName = "menu";
          }

          return <Ionicons name={iconName} size={32} color={color} />;
        },
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.primaryBold,
        tabBarInactiveTintColor: Colors.primaryGrey,
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarShowLabel: false,
        }}
      />
      <Tab.Screen
        name="Habits"
        component={HabitsScreen}
        options={{
          tabBarShowLabel: false,
          //tabBarIcon: () => <Ionicons name="bookmark-outline" size={32} />,
        }}
      />
      <Tab.Screen
        name="Drawer"
        component={DrawerNav}
        options={{
          tabBarShowLabel: false,
          //tabBarIcon: () => <Ionicons name="menu-outline" size={32} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomTab;
