import { FlatList } from "react-native";
import HabitItem from "./HabitItem";

function HabitsList({ habits }) {
  function renderHabitItem(itemData) {
    return <HabitItem habit={itemData.item} />;
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
