import { View } from "react-native";

function ProgressBar({ value, percentage, completedColor, incompletedColor }) {
  const width = value ? value : 40;
  const steps = [];
  for (let index = 0; index < 10; index++) {
    steps.push(index);
  }

  return (
    <View
      style={{
        width: width,
        //backgroundColor: "grey",
        justifyContent: "space-between",
        gap: 15,
        borderRadius: 0.5,
      }}>
      {steps.map((item) => {
        return (
          <View
            key={item}
            style={{
              transform: [{ rotate: "90deg" }],
              width: width / 2.5,
              height: 6,
              backgroundColor:
                item * 10 < percentage ? completedColor : incompletedColor,
              borderRadius: 4,
            }}
          />
        );
      })}
    </View>
  );
}

export default ProgressBar;
