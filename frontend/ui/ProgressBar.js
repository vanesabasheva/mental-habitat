import { View } from "react-native";
function ProgressBar({
  value,
  percentage,
  completedColor,
  incompletedColor,
  stepStyle,
  gap,
  isVertical,
}) {
  const width = value ? value : 40;
  const steps = [];
  for (let index = 0; index < 10; index++) {
    steps.push(index);
  }
  return (
    <View
      style={[
        {
          width: width,
          //backgroundColor: "grey",
          justifyContent: "space-between",
          gap: gap ? gap : 5,
          borderRadius: 0.5,
          //alignItems: "center",
        },

        isVertical ? { flexDirection: "row" } : null,
      ]}>
      {steps.map((item) => {
        return (
          <View
            key={item}
            style={[
              {
                width: width / 2.5,
                height: 6,
                backgroundColor:
                  item * 10 < percentage ? completedColor : incompletedColor,
                borderRadius: 4,
              },
              stepStyle,
              isVertical ? { transform: [{ rotate: "180deg" }] } : null,
            ]}
          />
        );
      })}
    </View>
  );
}

export default ProgressBar;
