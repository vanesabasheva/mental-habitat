import { FlatList } from "react-native";
import HabitItem from "./HabitItem";

function HabitsList() {
  const habits = [{ id: 1 }, { id: 2 }, { id: 3 }];

  function renderHabitItem(itemData) {
    return <HabitItem />;
  }

  return (
    <FlatList
      data={habits}
      renderItem={renderHabitItem}
      keyExtractor={(item) => item.id}
    />
  );
}

export default HabitsList;
