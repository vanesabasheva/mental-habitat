const express = require("express");
const router = express.Router();
const User = require("../models/User");
const crypto = require("crypto");
const authController = require("../controllers/auth");

router.post("/register", authController.postRegister);

router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

router.get("/user-token", (req, res, next) => {
  res.send();
});

router.get("/has-responded-to-survey", async (req, res, next) => {
  try {
    // Find the user by ID
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Send the hasRespondedToSurvey field as part of the response
    res.send({ hasRespondedToSurvey: user.hasCompletedSurvey });
  } catch (error) {
    console.error("Failed to retrieve survey status:", error);
  }
});

router.post("/reset", async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = User.findOne(email);
    if (!user) {
      return res
        .status(404)
        .json({ error: "Could not find user with this email address" });
    }

    crypto.randomBytes(32, (error, buffer) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
      }

      const token = buffer.toString("hex");
    });
  } catch (e) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
