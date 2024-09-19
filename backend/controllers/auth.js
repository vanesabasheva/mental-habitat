const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

exports.postRegister = async (req, res) => {
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
};

exports.postLogin = async (req, res) => {
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
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
