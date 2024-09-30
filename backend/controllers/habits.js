const User = require("../models/User");
const Habit = require("../models/Habit");
const HabitEntry = require("../models/HabitEntry");
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

exports.deleteHabit = async (req, res) => {
  const { habitId } = req.params;
  const userId = req.user.userId;

  try {
    const habitToDel = await Habit.findById(habitId);

    const result = await Habit.findByIdAndDelete(habitId);

    const user = await User.findById(userId);

    user.habits = user.habits.filter((habit) => habit.toString() !== habitId);

    await user.save();
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Server error. Could not delete habit" + error });
  }
};

exports.postHabitEntry = async (req, res) => {
  try {
    const { habitId } = req.body;
    const userId = req.user.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // reset time to start of the day (one habit entry per day allowed)

    const entry = HabitEntry.findOne({
      habitId: habitId,
      day: today,
    });

    if (entry) {
      return res
        .status(400)
        .json({ message: "Habit already logged for today" });
    }

    const habit = await Habit.findById(habitId);
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const newHabitEntry = await HabitEntry.create({
      habitId: habitId,
      day: today,
      //details: details ? details : null,
    });

    const user = await User.findByI(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const statsUpdate = await updateStats(habit.category, user, true);

    if (statsUpdate.error) {
      res.status(500).json(statsUpdate);
    }
    res.status(201).json({ habitEntry: newHabitEntry, stats: statsUpdate });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Server error. Could not save habit: " + error });
  }
};

exports.deleteHabitEntry = async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const { habitId } = req.body;
    const result = await HabitEntry.deleteOne({
      habitId: habitId,
      day: today,
    });

    const userId = req.user.userId;
    const user = await User.findById(userId);

    const habitWithUser = await Habit.findById(habitId);

    console.log("Habit:" + JSON.stringify(habitWithUser));
    const statsUpdate = await updateStats(habitWithUser.category, user, false);

    res.status(200).json({
      message: "Habit entry deleted successfully",
      stats: statsUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Server error. Could not delete habit entry" + error });
  }
};

async function updateStats(category, user, isIncrementing) {
  try {
    level = user.currentLevel;
    const multiplier = 5 / level;
    const increment = Math.ceil(multiplier);
    let updatedStat;
    switch (category) {
      case "Smoking":
        user.stats.engines = isIncrementing
          ? user.stats.engines + increment
          : user.stats.engines - increment;
        updatedStat = "engines";
        break;
      case "Exercise":
        user.stats.energy = isIncrementing
          ? user.stats.energy + increment
          : user.stats.energy - increment;
        updatedStat = "energy";
        break;
      case "Alcohol":
        user.stats.fuel = isIncrementing
          ? user.stats.fuel + increment
          : user.stats.fuel - increment;
        updatedStat = "fuel";
        break;
      case "Diet":
        user.stats.grip = isIncrementing
          ? user.stats.grip + increment
          : user.stats.grip - increment;
        updatedStat = "grip";
        break;
      default:
        return { error: "Invalid category" };
    }

    await user.save();
    return {
      updatedStat: updatedStat,
      increment: increment,
    };
  } catch (error) {
    return { error: "Error updating user stats", details: error.message };
  }
}
