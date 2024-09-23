const User = require("../models/User");
const Habit = require("../models/Habit");
const WEEK_DAYS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

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

exports.getHabitsByDate = async (req, res) => {
  const date = req.params.date;
  const dateObject = new Date(date);
  console.log("Date from path param: " + date);
  console.log("Date object: " + dateObject);

  try {
    const index = dateObject.getDay();
    console.log("Index of day " + index);
    const dayOfWeek = WEEK_DAYS[index];
    console.log(dayOfWeek);

    // Using $in to find documents where the dayOfWeek is in the selectedDaysOfWeek array
    const habits = await Habit.find({
      selectedDaysOfWeek: { $in: [dayOfWeek] },
      userId: req.user.userId,
    });
    console.log(habits);
    res.json({ habits });
  } catch (error) {
    console.error("Error retrieving habits:", error);
    res
      .status(500)
      .json({ error: "Error fetching user habits for specified date" });
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
        detailData = {
          numberOfCigarettes: habit.numberOfCigarettes,
        };
        break;
      case "Alcohol":
        detailData = {
          numberOfDrinks: habit.numberOfDrinks,
        };
        break;
      case "Exercise":
        detailData = {
          duration: habit.duration,
          distance: habit.distance,
        };
        break;
      case "Diet":
        detailData = {
          habitType: habit.habitType,
        };
    }
    const newHabit = new Habit({
      title,
      category,
      selectedDaysOfWeek: habit.selectedDaysOfWeek
        ? habit.selectedDaysOfWeek
        : WEEK_DAYS,
      details: detailData,
      userId,
    });
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
