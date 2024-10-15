const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const DUMMY_HABITS = [
  {
    title: "Stop Smoking",
    category: "Smoking",
    details: { numberOfCigarettes: 5 },
  },
  { title: "Eat a salad", category: "Diet" },
];

// Custom validator function to ensure the array does not exceed 7 elements
function arrayLimit(val) {
  return val.length <= 7;
}

const habitSchema = new Schema({
  title: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ["Smoking", "Exercise", "Alcohol", "Diet"],
  },
  details: { type: Schema.Types.Mixed },
  selectedDaysOfWeek: {
    type: [String],
    enum: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"], // Validate allowed days
    validate: [arrayLimit, "{PATH} exceeds the limit of 7"],
  }, // Custom validator to check array length},
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User model
});

const Habit = model("Habit", habitSchema);
module.exports = Habit;
