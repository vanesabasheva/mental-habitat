const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema, model } = mongoose;
const Habit = require("./Habit");

const saltRounds = 10;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true },
    hasCompletedSurvey: { type: Boolean, default: false },
    habits: [{ type: Schema.Types.ObjectId, ref: "Habit" }],
    questionAnswers: [{ type: Schema.Types.ObjectId, ref: "Questionnaire" }],
    currentLevel: { type: Number, default: 1 },
    levelProgress: { type: Number, default: 0 },
    stats: {
      engines: { type: Number, default: 0 },
      energy: { type: Number, default: 0 },
      grip: { type: Number, default: 0 },
      fuel: { type: Number, default: 0 },
    },
  },
  { collection: "User" }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const hash = await bcrypt.hash(this.password, saltRounds);
    this.password = hash;
    // Store hash in your password DB.
  }
  next();
});

const User = model("User", userSchema);

module.exports = User;
