const logger = require("../app");
const HabitEntry = require("../models/HabitEntry");
const Habit = require("../models/Habit");

exports.getSmokingStats = async (req, res) => {
  const userId = req.user.userId;
  const action = "get_smoking_stats";
  const { startDate, endDate } = req.query;
  const normalizedStartDate = new Date(startDate);
  const normalizedEndDate = new Date(endDate);
  normalizedStartDate.setUTCHours(0, 0, 0, 0);
  normalizedEndDate.setUTCHours(0, 0, 0, 0);

  try {
    logger.info({ action: action, userId: userId }, "Smoking stats requested.");
    // Find all smoking-related habits for the user
    const smokingHabit = await Habit.findOne({ userId, category: "Smoking" });

    if (!smokingHabit) {
      return res.status(404).json({ message: "No smoking habits found" });
    }

    const smokingEntries = await HabitEntry.find({
      habitId: smokingHabit._id,
      day: {
        $gte: normalizedStartDate,
        $lte: normalizedEndDate,
      },
      isCompleted: true,
    });

    logger.info(
      {
        action: action,
        userId: userId,
        startDate: startDate,
        endDate: endDate,
        smokingEntries: smokingEntries,
      },
      "Smoking entries for week requested."
    );

    // const totalSmokedCigarettes = smokingEntries.reduce(
    //   (sum, entry) => sum + (entry.details.numberOfSmokedCigarettes || 0),
    //   0
    // );

    // const totalGoal = smokingEntries.reduce(
    //   (sum, entry) => sum + entry.numberOfCigarettes || 0,
    //   0
    // );

    let data = [];

    for (let index = 0; index < smokingEntries.length; index++) {
      const element = smokingEntries[index];
      data[index] = {
        day: index,
        smokedCigarettes: element.details.numberOfSmokedCigarettes,
      };
    }
    // for each day index [{day: 0 smokedCigarettes: 0}, {day: 1, smokedCigarettes: 1}, {day: 2, smokedCigarettes: 4} ...]
    return res.status(200).json(data);
  } catch (error) {
    handleError(res, error, "get_smoking_stats");
  }
};

exports.getAlcoholStats = async (req, res) => {
  const userId = req.user.userId;
  const action = "get_alcohol_stats";
  const { startDate, endDate } = req.query;
  const normalizedStartDate = new Date(startDate);
  const normalizedEndDate = new Date(endDate);
  normalizedStartDate.setUTCHours(0, 0, 0, 0);
  normalizedEndDate.setUTCHours(0, 0, 0, 0);
  try {
    logger.info({ action: action, userId: userId }, "Alcohol stats requested.");
    // Find an alcohol-related habit for the user
    const alcoholHabit = await Habit.findOne({ userId, category: "Alcohol" });

    if (!alcoholHabit) {
      return res.status(404).json({ message: "No alcohol habits found" });
    }

    const alcoholEntries = await HabitEntry.find({
      habitId: alcoholHabit._id,
      day: {
        $gte: normalizedStartDate,
        $lte: normalizedEndDate,
      },
      isCompleted: true,
    });

    logger.info(
      {
        action: action,
        userId: userId,
        startDate: startDate,
        endDate: endDate,
        alcoholEntries: alcoholEntries,
      },
      "Alcohol entries for week requested."
    );

    let data = [];

    for (let index = 0; index < alcoholEntries.length; index++) {
      const element = alcoholEntries[index];
      data[index] = {
        day: index,
        numberOfConsumedDrinks: element.details.numberOfConsumedDrinks,
      };
    }

    return res.status(200).json(data);
  } catch (error) {
    handleError(res, error, action);
  }
};

exports.getExerciseStats = async (req, res) => {
  const userId = req.user.userId;
  const action = "get_exercise_stats";
  const { startDate, endDate } = req.query;
  const normalizedStartDate = new Date(startDate);
  const normalizedEndDate = new Date(endDate);
  normalizedStartDate.setUTCHours(0, 0, 0, 0);
  normalizedEndDate.setUTCHours(0, 0, 0, 0);

  try {
    logger.info(
      { action: action, userId: userId, startDate: normalizedStartDate },
      "Exercise stats requested."
    );
    // Find all exercise-related habits for the user
    const habits = await Habit.find({
      userId: userId,
      category: "Exercise",
    }).select("_id");

    const habitIds = habits.map((habit) => habit._id);

    // Aggregate entries from HabitEntries
    const data = await HabitEntry.aggregate([
      {
        $match: {
          habitId: { $in: habitIds },
          day: { $gte: normalizedStartDate, $lte: normalizedEndDate },
          isCompleted: true,
        },
      },
      {
        $project: {
          dayOfWeek: {
            $cond: {
              if: { $eq: [{ $dayOfWeek: "$day" }, 1] }, // If the day of the week is Sunday (1)
              then: 7, // Set it to 7
              else: { $subtract: [{ $dayOfWeek: "$day" }, 1] }, // Otherwise, subtract 1 (making Monday = 1, etc.)
            },
          },
          duration: { $toDecimal: "$details.duration" }, // Convert duration to integer
          distance: { $toDecimal: "$details.distance" }, // Convert distance to integer   details: "$details", // Project the entire details object for debugging // Default distance to 0 if null
        },
      },
      {
        $group: {
          _id: "$dayOfWeek",
          totalDuration: { $sum: { $ifNull: ["$duration", 0] } },
          totalDistance: { $sum: { $ifNull: ["$distance", 0] } },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by day of the week
      },
    ]);

    logger.warn(
      { action: action, exerciseStats: data },
      "Exercise stats computed for each day of week."
    );
    return res.status(200).json(data);
  } catch (error) {
    handleError(res, error, action);
  }
};

exports.getDietStats = async (req, res) => {
  const userId = req.user.userId;
  const action = "get_diet_stats";
  const { startDate, endDate } = req.query;
  const normalizedStartDate = new Date(startDate);
  const normalizedEndDate = new Date(endDate);
  normalizedStartDate.setUTCHours(0, 0, 0, 0);
  normalizedEndDate.setUTCHours(0, 0, 0, 0);

  try {
    logger.info(
      { action: action, userId: userId, startDate: normalizedStartDate },
      "Diet stats requested."
    );
    // Find all diet-related habits for the user
    const dietHabits = await Habit.find({
      userId: userId,
      category: "Diet", // Assuming 'Diet' is the category for diet habits
    }).select("_id");

    const habitIds = dietHabits.map((habit) => habit._id);

    // Aggregate entries for these habits within the date range
    const entries = await HabitEntry.aggregate([
      {
        $match: {
          habitId: { $in: habitIds },
          day: { $gte: normalizedStartDate, $lte: normalizedEndDate },
        },
      },
      {
        $project: {
          dayOfWeek: {
            $cond: {
              if: { $eq: [{ $dayOfWeek: "$day" }, 1] }, // If the day of the week is Sunday (1)
              then: 7, // Set it to 7
              else: { $subtract: [{ $dayOfWeek: "$day" }, 1] }, // Otherwise, subtract 1 (making Monday = 1, etc.)
            },
          },
          details: 1, // Include details
          day: 1, // Include the date of the entry
          isCompleted: 1,
        },
      },
    ]);

    console.log(entries);
    res.status(200).json(entries);
  } catch (error) {
    handleError(res, error, action);
  }
};

function handleError(res, error, action) {
  logger.error({ error, action: action }, "An error occurred.");
  res.status(500).json({ error: "Server error!", error });
}
