import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../../screens/Home";
import HabitsScreen from "../../screens/Habits";

const Drawer = createDrawerNavigator();

function DrawerNav() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Feed" component={HomeScreen} />
      <Drawer.Screen name="Article" component={HabitsScreen} />
    </Drawer.Navigator>
  );
}

export default DrawerNav;
