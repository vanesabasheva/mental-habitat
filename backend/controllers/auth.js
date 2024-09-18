const User = require("../models/User");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("5bab316ce0a7c75f783cb8a8")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        console.log(err);
        res.redirect("/");
      });
    })
    .catch((err) => console.log(err));
};

exports.postSignup = async (req, res, next) => {
  try {
    console.log(req.body);
    const { email, firstName, password } = req.body;

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
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
