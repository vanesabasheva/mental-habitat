const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.postRegister = async (req, res) => {
  try {
    const { email, fullName, password } = req.body;
    console.log(email + " " + password + " " + fullName);
    if (!email || !fullName || !password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const newUser = new User({
      email: email,
      fullName: fullName,
      password: password,
    });

    const savedUser = await newUser.save();

    console.log(savedUser);
    const token = generateToken(savedUser._id);

    res.json({ accessToken: token });
  } catch (e) {
    if (e.code === 11000) {
      res.status(400).json({
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

    const token = generateToken(user._id);
    res.json({ accessToken: token });
  } catch (error) {
    handleError(res, error);
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
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
  console.error(error);
  res.status(500).json({ error: "Server error!" });
}
