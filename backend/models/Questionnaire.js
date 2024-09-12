const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const questionnaireSchema = new Schema({
  question1: String,
  question2: String,
  question3: String,
  question4: String,
  question5: String,
  question6: String,
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});

const Questionnaire = model("Questionnaire", questionnaireSchema);

module.exports = Questionnaire;
