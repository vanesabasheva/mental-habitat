const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const habitEntrySchema = new Schema({
  habitId: { type: Schema.Types.ObjectId, ref: "Habit", required: true }, // Reference to the Habit Model
  day: { type: Date, default: Date.now() },
  details: { type: Schema.Types.Mixed },
});

const HabitEntry = mongoose.model("HabitEntry", habitEntrySchema);
module.exports = HabitEntry;
