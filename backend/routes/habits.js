const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/is-auth"); // middleware for authentication
const habitsController = require("../controllers/habits");

router.use(isAuth); //users need to be authenticated for all routes

router.get("/", habitsController.getHabits);

router.post("/", habitsController.postHabit);

router.get("/:date", habitsController.getHabitsByDate);

module.exports = router;
