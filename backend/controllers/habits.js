const User = require("../models/User");
const Habit = require("../models/Habit");
const HabitEntry = require("../models/HabitEntry");
const WEEK_DAYS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
const logger = require("../app");
const { default: mongoose } = require("mongoose");

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

exports.putHabitEntry = async (req, res) => {
  const updateData = req.body;
  const title = updateData.title;
  const category = updateData.category;
  const selectedDaysOfWeek = updateData.selectedDaysOfWeek;

  const userId = req.user.userId;
  const habitId = req.params.habitId;
  const action = "put_habit_entry";

  let detailData;
  switch (category) {
    case "Smoking":
      detailData = { numberOfCigarettes: updateData.numberOfCigarettes };
      break;
    case "Alcohol":
      detailData = { numberOfDrinks: updateData.numberOfDrinks };
      break;
    case "Exercise":
      detailData = {
        duration: updateData.duration,
        distance: updateData.distance,
      };
      break;
    case "Diet":
      detailData = { habitType: updateData.habitType };
      break;
    default:
      detailData = {};
  }

  try {
    logger.info(
      { action: action, habitData: updateData, habitId: habitId },
      "Trying to update habit."
    );
    const updatedHabit = await Habit.findByIdAndUpdate(
      habitId,
      { title, category, details: detailData, selectedDaysOfWeek, userId },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedHabit) {
      return res.status(404).json({ message: "Habit not found" });
    }
    res.send(updatedHabit);
  } catch (error) {
    handleError(res, error, action);
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
    // TODO: delete all habit entries of this habit
    await user.save();
    res.status(204).send();
  } catch (error) {
    handleError(res, error, "delete_habit");
  }
};

exports.postHabitEntry = async (req, res) => {
  const { habitId, day } = req.body;

  try {
    if (!day || new Date(day).toString() === "Invalid Date") {
      console.log(day);
      return res.status(400).json({ message: "Invalid or missing date." });
    }

    logger.info(
      {
        action: "post_habit_entry",
        habitId: habitId,
        day: day,
      },
      "New Habit entry for the day requested."
    );

    const entry = await HabitEntry.findOne({
      habitId: habitId,
      day: day,
    });

    if (entry) {
      logger.warn(
        {
          action: "post_habit_entry",
          habitId: habitId,
          habitEntryId: entry._id,
        },
        "Habit already logged for today."
      );

      return res
        .status(200)
        .json({ message: "Habit already logged for today", habitEntry: entry });
    }

    const habit = await Habit.findById(habitId);
    if (!habit) {
      logger.warn(
        {
          action: "post_habit_entry",
          habitId: habitId,
        },
        "Habit not found."
      );
      return res.status(404).json({ message: "Habit not found" });
    }

    const normalizedDay = new Date(day);
    normalizedDay.setUTCHours(0, 0, 0, 0);

    let details = {};
    switch (habit.category) {
      case "Smoking":
        details = {
          numberOfSmokedCigarettes: 0,
          numberOfCigarettes: habit.details.numberOfCigarettes,
        };
        break;
      case "Exercise":
        const distance = habit.details.distance ? habit.details.distance : null;
        details = {
          duration: habit.details.duration,
          distance: distance,
        };
        break;
      case "Alcohol":
        details = {
          numberOfConsumedDrinks: 0,
          numberOfDrinks: habit.details.numberOfDrinks,
        };
        break;
      case "Diet":
        details = {
          habitType: habit.details.habitType,
        };
        break;
    }

    const newHabitEntry = await HabitEntry.create({
      habitId: habitId,
      day: normalizedDay,
      details: details,
    });

    logger.info(
      {
        action: "post_habit_entry",
        habitId: habitId,
        day: day,
        details: details,
      },
      "Habit entry log for the day successfully created."
    );
    res.status(201).json({ habitEntry: newHabitEntry });
  } catch (error) {
    handleError(res, error, "post_habit_entry");
  }
};

exports.patchHabitEntry = async (req, res) => {
  // STATS UPDATE ONLY ON isCompleted = true for the specific EntryID; i.e user has clicked the checkbox
  // why not foreach habit today, create new habitEntry at the beginning of the day. the frontend then checks, habitNetry.isCompleted
  // for completion of the habit
  const userId = req.user.userId;
  const { habitEntryId } = req.params;
  const { habitId, updates } = req.body;
  try {
    const habitEntry = await HabitEntry.findById(habitEntryId);

    if (!habitEntry) {
      logger.warn(
        {
          action: "patch_habit_entry",
          habitEntryId: habitId,
        },
        "Habit Entry not found."
      );
      return res.status(404).json({ message: "Habit Entry not found" });
    }

    // // check if the user is authorized to update this entry
    // if (habitEntry.userId.toString() !== userId) {
    //   return res.status(403).json({ message: "Unauthorized" });
    // }

    const habit = await Habit.findById(habitId);

    if (!habit) {
      logger.warn(
        {
          action: "patch_habit_entry",
          habitId: habitId,
        },
        "Habit not found."
      );
      return res.status(404).json({ message: "Habit not found" });
    }

    if (updates.isCompleted !== undefined) {
      habitEntry.isCompleted = updates.isCompleted; // update entry

      const user = await User.findById(userId);
      if (!user) {
        logger.warn(
          {
            action: "post_habit_entry",
            habitId: habitId,
          },
          "User not found."
        );
        return res.status(404).json({ message: "User not found" });
      }

      // increment stats only if isCompleted === true else decrement
      let statsUpdate;
      if (updates.isCompleted) {
        statsUpdate = await updateStats(habit.category, user, true);
      } else {
        statsUpdate = await updateStats(habit.category, user, false);
      }
      if (statsUpdate.error) {
        logger.warn(
          {
            action: "post_habit_entry",
            habitId: habitId,
          },
          "Error occurred whilst updating stats."
        );
        return res.status(500).json(statsUpdate);
      }

      logger.info(
        {
          action: "patch_habit_entry",
          habitId: habitId,
          details: habitEntry.details,
          isCompleted: habitEntry.isCompleted,
          updates: updates.details,
        },
        "Habit entry log for the day successfully updated."
      );
      await habitEntry.save();
      return res.status(200).json({ stats: statsUpdate });
    }

    if (updates) {
      habitEntry.details = { ...habitEntry.details, ...updates };
    }
    console.log("Updates" + JSON.stringify(updates));
    logger.info(
      {
        action: "patch_habit_entry",
        habitId: habitId,
        details: habitEntry.details,
        updates: updates,
      },
      "Habit entry log for the day successfully updated."
    );
    await habitEntry.save();
    res.status(200).json({ habitEntry: habitEntry });
  } catch (error) {
    handleError(res, error, "patch_habit_entry");
  }
};

exports.getHabitEntry = async (req, res) => {
  const { habitId, day } = req.query;
  try {
    logger.info(
      {
        action: "get_habit_entry",
        habitId: habitId,
        day: day,
      },
      "Habit entry log requested for the day."
    );

    const normalizedDay = new Date(day);
    normalizedDay.setUTCHours(0, 0, 0, 0);

    const habitEntry = await HabitEntry.findOne({
      habitId: habitId,
      day: normalizedDay,
    });

    if (!habitEntry) {
      logger.info(
        {
          action: "get_habit_entry",
          habitId: habitId,
          day: day,
        },
        "Habit entry does not exist for the day."
      );
      return res.status(404).json({ message: "Habit entry not found" });
    }
    logger.info(
      {
        action: "get_habit_entry",
        habitId: habitId,
        day: day,
      },
      "Sending Habit entry for the day..."
    );

    return res.status(200).json(habitEntry);
  } catch (error) {
    handleError(res, error, "get_habit_entry");
  }
};

exports.deleteHabitEntry = async (req, res, next) => {
  const { habitEntryId } = req.params;

  logger.info(
    { action: "delete_habit_entry", habitEntryId: habitEntryId },
    "Attempt to delete habit entry for the day"
  );
  try {
    const habitEntry = await HabitEntry.findById(habitEntryId);
    if (!habitEntry) {
      logger.warn(
        { action: "delete_habit_entry", habitEntryId },
        "Habit entry not found."
      );
      return res.status(404).json({ message: "Habit entry not found" });
    }

    const userId = req.user.userId;
    const user = await User.findById(userId);
    const habitWithUser = await Habit.findById(habitEntry.habitId);

    logger.info(
      { action: "delete_habit_entry", habit: habitWithUser },
      "Habit and user found."
    );

    const result = await HabitEntry.findByIdAndDelete(habitEntryId);
    logger.info(
      { action: "delete_habit_entry", habitEntryId },
      "Habit entry deleted successfully."
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

exports.getHabitCategoriesForUser = async (req, res, next) => {
  const userId = req.user.userId;
  let stringUserId = userId.toString();
  try {
    const habitCategories = await Habit.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId.createFromHexString(stringUserId),
        },
      },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    logger.info(
      {
        action: "get_habit_ategiries",
        user: userId,
        habitCategories: habitCategories,
      },
      "Habit categories for user successfully fetched."
    );
    return res.status(200).json({ habitCategories: habitCategories });
  } catch (error) {
    handleError(res, error, "get_habit_categories");
  }
};

///////////////////////
// Helper Functions //
//////////////////////
async function updateStats(category, user, isIncrementing) {
  try {
    level = user.currentLevel;
    const multiplier = 5 / level;
    const increment = Math.ceil(multiplier);
    let updatedStat;
    let actualIncrement = 0;

    const applyIncrement = (currentValue, incrementValue) => {
      // Increment, but cap the value at 10
      const newValue = Math.min(currentValue + incrementValue, 10);

      actualIncrement = newValue - currentValue;
      return newValue;
    };

    const applyDecrement = (currentValue, decrementValue) => {
      const newValue = Math.max(currentValue - decrementValue, 0);
      actualIncrement = currentValue - newValue; // Negative because it's a decrement

      return newValue;
    };

    switch (category) {
      case "Smoking":
        if (isIncrementing) {
          user.stats.engines = applyIncrement(user.stats.engines, increment);
        } else {
          user.stats.engines = applyDecrement(user.stats.engines, increment);
        }
        updatedStat = "engines";
        break;
      case "Exercise":
        if (isIncrementing) {
          user.stats.energy = applyIncrement(user.stats.energy, increment);
        } else {
          user.stats.energy = applyDecrement(user.stats.energy, increment);
        }
        updatedStat = "energy";
        break;
      case "Alcohol":
        if (isIncrementing) {
          user.stats.fuel = applyIncrement(user.stats.fuel, increment);
        } else {
          user.stats.fuel = applyDecrement(user.stats.fuel, increment);
        }
        updatedStat = "fuel";
        break;
      case "Diet":
        if (isIncrementing) {
          user.stats.grip = applyIncrement(user.stats.grip, increment);
        } else {
          user.stats.grip = applyDecrement(user.stats.grip, increment);
        }
        updatedStat = "grip";
        break;
      default:
        return { error: "Invalid category" };
    }

    await user.save();
    return {
      updatedStat: updatedStat,
      increment: isIncrementing ? actualIncrement : -actualIncrement,
    };
  } catch (error) {
    return { error: "Error updating user stats", details: error.message };
  }
}

function handleError(res, error, action) {
  logger.error({ error, action: action }, "An error occurred.");
  res.status(500).json({ error: "Server error!", error });
}
