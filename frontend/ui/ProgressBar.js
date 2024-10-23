import { View } from "react-native";
import Spaceship from "../assets/svgs/Spaceship.svg";
import React from "react";

function ProgressBar({
  value,
  percentage,
  completedColor,
  incompletedColor,
  stepStyle,
  gap,
  isVertical,
  ship,
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
        // Determine if the current step is completed
        const isCompleted = item * 10 <= percentage;

        return (
          <React.Fragment key={item}>
            <View
              key={item}
              style={[
                {
                  width: width / 2.5,
                  height: 3,
                  backgroundColor:
                    item * 10 < percentage ? completedColor : incompletedColor,
                  borderRadius: 4,
                },
                stepStyle,
                isVertical ? { transform: [{ rotate: "180deg" }] } : null,
              ]}
            />
            {ship &&
              isCompleted &&
              (item === steps.length - 1 ||
                steps[item + 1] * 10 > percentage) && (
                <View
                  style={{
                    transform: [{ rotate: "120deg" }],
                    zIndex: 10,
                  }}>
                  <Spaceship width={90} height={50} />
                </View>
              )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

export default ProgressBar;
