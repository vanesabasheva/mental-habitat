const User = require("../models/User");
const Habit = require("../models/Habit");
exports.getHabits = async (req, res) => {
  const userId = req.user.userId; // Extracted from decoded JWT

  try {
    const userWithHabits = await User.findById(userId).populate("habits");
    if (!userWithHabits) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ habits: userWithHabits.habits });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching user habits" });
  }
};

exports.postHabit = async (req, res) => {
  const habit = req.body;
  console.log("in /POST habits: " + JSON.stringify(habit));

  const title = habit.title;
  const category = habit.category;
  const userId = req.user.userId;

  try {
    let detailData;
    switch (category) {
      case "Smoking":
        detailData = { numberOfCigarettes: habit.numberOfCigarettes };
        break;
      case "Alcohol":
        detailData = { numberOfDrinks: habit.numberOfDrinks };
        break;
      case "Exercise":
        detailData = {
          selectedDaysOfWeek: habit.selectedDaysOfWeek,
          duration: habit.duration,
          distance: habit.distance,
        };
        break;
      case "Diet":
        detailData = {
          selectedDaysOfWeek: habit.selectedDaysOfWeek,
          habitType: habit.habitType,
        };
    }
    const newHabit = new Habit({
      title,
      category,
      details: detailData,
      userId,
    });

    console.log(newHabit);
    await newHabit.save();

    // Now, update the User document to include this new habit's ID in the 'habits' array
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.habits.push(newHabit._id);
    await user.save();

    res.status(201).json({
      message: "Habit created successfully!",
      habit: newHabit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create habit" });
  }
};
