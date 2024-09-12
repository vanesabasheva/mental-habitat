const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    const { email, firstName, password } = req.body;

    //const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email: email,
      firstName: firstName,
      password: password,
      hasCompletedSurvey: false,
    });

    const savedUser = await newUser.save();
    console.log(savedUser);
    res.status(201).json({ message: "User registered" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server error!" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  try {
    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

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
    res.send({ hasRespondedToSurvey: user.hasRespondedToSurvey });
  } catch (error) {
    console.error("Failed to retrieve survey status:", error);
  }
});

module.exports = router;
