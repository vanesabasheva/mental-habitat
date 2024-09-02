const express = require("express");
const { getDb } = require("../util/database");
const router = express.Router();
//const User = require("../models/User");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    //const db = getDb();
    //const usersCollection = db.collection("User");
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

    const token = jwt.sign({ userId: user._id }, "your-secret-key", {
      expiresIn: "24h",
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

router.get("/user-token", (req, res, next) => {
  res.send();
});

router.get("/has-responded-to-survey", (req, res, next) => {
  res.send();
});

module.exports = router;
