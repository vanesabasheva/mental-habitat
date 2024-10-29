const express = require("express");
const router = express.Router();
const User = require("../models/User");
const crypto = require("crypto");
const authController = require("../controllers/auth");
const logger = require("../app");

router.post("/register", authController.postRegister);

router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

router.get("/user-token", (req, res, next) => {
  // res.send();
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
        logger.error({ error }, "Could not generate random bytes with crypto.");
        return res.status(500).json({ error: "Internal server error" });
      }

      const token = buffer.toString("hex");
    });
  } catch (e) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
