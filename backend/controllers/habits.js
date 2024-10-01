const User = require("../models/User");
const Habit = require("../models/Habit");
const HabitEntry = require("../models/HabitEntry");
const WEEK_DAYS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
const logger = require("../app");

exports.getHabits = async (req, res) => {
  const userId = req.user.userId; // Extracted from decoded JWT
  logger.info({ action: "get_habits", userId }, "Fetching user habits.");
  try {
    const userWithHabits = await User.findById(userId).populate("habits");
    if (!userWithHabits) {
      logger.warn({ action: "get_habits", userId }, "User not found.");
      return res.status(404).json({ message: "User not found" });
    }
    logger.info(
      { action: "get-habits", userId, count: userWithHabits.habits.length },
      "User habits retrieved successfully."
    );
    res.json({ habits: userWithHabits.habits });
  } catch (error) {
    handleError(res, error, "get-habits");
  }
};

exports.getHabitsByDate = async (req, res) => {
  const date = req.params.date;
  const dateObject = new Date(date);
  logger.debug(
    { action: "parse_date", date, dateObject },
    "Date parsing from path parameter."
  );

  try {
    const index = dateObject.getDay();
    const dayOfWeek = WEEK_DAYS[index];
    logger.debug(
      { action: "find_habits_by_day", dayOfWeek },
      "Fetching habits available for day of week."
    );

    // Using $in to find documents where the dayOfWeek is in the selectedDaysOfWeek array
    const habits = await Habit.find({
      selectedDaysOfWeek: { $in: [dayOfWeek] },
      userId: req.user.userId,
    });
    logger.info(
      { action: "habits_by_date", dayOfWeek, count: habits.length },
      "Habits for day fetched."
    );
    res.json({ habits });
  } catch (error) {
    handleError(res, error, "habits_by_date");
  }
};

exports.postHabit = async (req, res) => {
  const habit = req.body;

  const title = habit.title;
  const category = habit.category;
  const userId = req.user.userId;

  logger.info({ action: "post_habit", userId, title }, "Creating new habit.");

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

    logger.info(
      { action: "post_habit", habitId: newHabit._id },
      "Habit created successfully."
    );

    // Update the User document to include this new habit's ID in the 'habits' array
    const user = await User.findById(userId);
    if (!user) {
      logger.warn({ action: "post_habit", userId }, "User does not exist.");
      return res.status(404).json({ error: "User not found" });
    }

    user.habits.push(newHabit._id);
    await user.save();

    res.status(201).json({
      message: "Habit created successfully!",
      habit: newHabit,
    });
  } catch (error) {
    handleError(res, error, "post_habit");
  }
};

exports.deleteHabit = async (req, res) => {
  const { habitId } = req.params;
  const userId = req.user.userId;

  logger.info(
    { action: "delete_habit", userId, habitId },
    "Attempting to delete habit."
  );

  try {
    const result = await Habit.findByIdAndDelete(habitId);
    logger.info(
      { action: "habit_deleted", habitId },
      "Habit deleted successfully."
    );

    const user = await User.findById(userId);

    user.habits = user.habits.filter((habit) => habit.toString() !== habitId);

    await user.save();
    res.status(204).send();
  } catch (error) {
    handleError(res, error, "delete_habit");
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
    logger.info(
      { action: "post_habit_entry", habitId: newHabit._id },
      "Habit created successfully."
    );

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

    logger.info(
      { action: "delete_habit_entry", habit: habitWithUser },
      "Habit and user found."
    );
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

function handleError(res, error, action) {
  logger.error({ error, action: action }, "An error occurred.");
  res.status(500).json({ error: "Server error!" });
}
