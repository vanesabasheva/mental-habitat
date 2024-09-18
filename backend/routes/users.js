const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const authController = require("../controllers/auth");
const bcrypt = require("bcrypt");

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

//router.post("/login", authController.postLogin);

router.post("/signup", authController.postSignup);

router.post("/logout", authController.postLogout);

router.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    const { email, firstName, password } = req.body;
    if (!email || !firstName || !password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
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
    if (e.code === 11000) {
      res.status(400).json({
        error:
          "Email already used with another account. Please use a different email",
      });
    } else {
      console.log(e);
      res.status(500).json({ error: "Server error!" });
    }
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  try {
    if (!user) {
      return res
        .status(401)
        .json({ error: "User does not exist. Please sign up." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ error: "Authentication failed. Wrong Password." });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "90d",
    });

    res.json({ accessToken: token });
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
