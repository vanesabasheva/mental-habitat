const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema, model } = mongoose;

const saltRounds = 10;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    password: { type: String, required: true },
    hasCompletedSurvey: Boolean,
    habits: [{ habitId: { type: Schema.Types.ObjectId, ref: "Habit" } }],
    questionAnswers: [
      { answerId: { type: Schema.Types.ObjectId, ref: "Questionnaire" } },
    ],
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
