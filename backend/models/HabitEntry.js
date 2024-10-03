const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const habitEntrySchema = new Schema({
  habitId: { type: Schema.Types.ObjectId, ref: "Habit", required: true }, // Reference to the Habit Model
  day: { type: Date, default: Date.now() },
  details: { type: Schema.Types.Mixed },
});

// Ensure that there can only be one entry per habit per day
habitEntrySchema.index({ habitId: 1, day: 1 }, { unique: true });

const HabitEntry = model("HabitEntry", habitEntrySchema);
module.exports = HabitEntry;
