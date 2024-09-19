const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const DUMMY_HABITS = [
  { title: "Stop Smoking", category: "Smoking" },
  { title: "Eat a salad", category: "Diet" },
];

const habitSchema = new Schema({
  title: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ["Smoking", "Exercise", "Alcohol", "Diet"],
  },
  details: { type: Schema.Types.Mixed },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User model
});

const Habit = model("Habit", habitSchema);
module.exports = Habit;
