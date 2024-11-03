const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const logger = require("../app");

exports.postRegister = async (req, res) => {
  const { email, fullName, password } = req.body;
  try {
    if (!email || !fullName || !password) {
      logger.warn(
        { error: "Invalid credentials provided", action: "register" },
        "Validation failed during user registration."
      );
      return res.status(400).json({ error: "Invalid credentials" });
    }

    logger.info(
      { action: "register", email },
      "Registration attempt for email."
    );

    const newUser = new User({
      email: email,
      fullName: fullName,
      password: password,
    });

    const savedUser = await newUser.save();
    const token = generateToken(savedUser._id);
    return res.status(201).json({ accessToken: token });
  } catch (e) {
    if (e.code === 11000) {
      logger.warn({ action: "register", email }, "Email already in use.");
      return res.status(400).json({
        error:
          "Email already used with another account. Please use a different email",
      });
    } else {
      handleError(res, e);
    }
  }
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  logger.info({ action: "login", email }, "Login attempt.");
  const user = await User.findOne({ email });
  try {
    if (!user) {
      logger.warn({ action: "login", email }, "User does not exist.");

      return res
        .status(401)
        .json({ error: "User does not exist. Please sign up." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      logger.warn({ action: "login", email }, "Password does not match.");
      return res
        .status(401)
        .json({ error: "Authentication failed. Wrong Password." });
    }

    const token = generateToken(user._id);
    logger.info({ action: "login", email }, "Login successful.");
    return res.json({ accessToken: token });
  } catch (error) {
    handleError(res, error);
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
};

// helper functions

function generateToken(userId) {
  return jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
    expiresIn: "90d",
  });
}

function handleError(res, error) {
  logger.error({ error }, "An error occurred.");
  res.status(500).json({ error: "Server error!" });
}
