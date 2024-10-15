const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const DUMMY_Entries = [
  {
    habitId: "someRefToSmokingHabitId",
    day: "2024-10-11",
    details: { numberOfCigarettes: 5, currentNumberOfSmokedCigarettes: 3 },
    isCompleted: false,
  },
];

const habitEntrySchema = new Schema({
  habitId: { type: Schema.Types.ObjectId, ref: "Habit", required: true }, // Reference to the Habit Model
  day: { type: Date, default: Date.now() },
  details: { type: Schema.Types.Mixed },
  isCompleted: { type: Boolean, default: false },
});

// Ensure that there can only be one entry per habit per day
habitEntrySchema.index({ habitId: 1, day: 1 }, { unique: true });

const HabitEntry = model("HabitEntry", habitEntrySchema);
module.exports = HabitEntry;
