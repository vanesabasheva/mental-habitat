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

    const totalSmokedCigarettes = smokingEntries.reduce(
      (sum, entry) => sum + (entry.details.numberOfSmokedCigarettes || 0),
      0
    );

    const totalGoal = smokingEntries.reduce(
      (sum, entry) => sum + entry.numberOfCigarettes || 0,
      0
    );

    let data = [];

    for (let index = 0; index < smokingEntries.length; index++) {
      const element = smokingEntries[index];
      data[index] = {
        day: index,
        smokedCigarettes: element.details.numberOfSmokedCigarettes,
      };
    }

    //
    // for each day index [{day: 0 smokedCigarettes: 0}, {day: 1, smokedCigarettes: 1}, {day: 2, smokedCigarettes: 4} ...]
    //
    //        {monthly: 12, 10, 10, 5 for each week of the month}
    //        {yearly: 120, 120, 10, 100, 50, 30, 49, 90 ... for each month of the year}
    // return average per day (totalSmokedCigarettes / (endDate - startDate))
    //

    return res.status(200).json(data);
  } catch (error) {
    handleError(res, error, "get_smoking_stats");
  }
};

function handleError(res, error, action) {
  logger.error({ error, action: action }, "An error occurred.");
  res.status(500).json({ error: "Server error!", error });
}
