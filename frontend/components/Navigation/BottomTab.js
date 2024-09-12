import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../../screens/Home";
import { Ionicons } from "@expo/vector-icons";
import HabitsScreen from "../../screens/Habits";
import DrawerNav from "./Drawer";
import { Colors } from "../../constants/Colors";
import MessagesScreen from "../../screens/Messages";
import Settings from "../../screens/Settings";

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
            iconName = focused ? "bookmark" : "bookmark-outline";
          } else if (route.name === "Drawer") {
            iconName = focused ? "person-circle" : "person-circle-outline";
          } else if (route.name === "Messages") {
            iconName = focused
              ? "chatbubble-ellipses"
              : "chatbubble-ellipses-outline";
          }

          return <Ionicons name={iconName} size={32} color={color} />;
        },
        tabBarStyle: {
          position: "absolute",
          margin: 40,
          paddingTop: 20,
          borderTopWidth: 0,
          borderRadius: 42,
          elevation: 1,
          shadowColor: Colors.primaryBold,
          shadowRadius: 4,
          shadowOffset: { width: 1, height: 1 },
          shadowOpacity: 0.2,
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
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen
        name="Drawer"
        component={Settings}
        options={{
          tabBarShowLabel: false,
          //tabBarIcon: () => <Ionicons name="menu-outline" size={32} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomTab;
