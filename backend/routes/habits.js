const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/is-auth"); // middleware for authentication
const habitsController = require("../controllers/habits");

router.use(isAuth); //users need to be authenticated for all routes

//Specific routes
router.get("/habitEntry", habitsController.getHabitEntry);

router.post("/habitEntry", habitsController.postHabitEntry);

router.patch("/habitEntry/:habitEntryId", habitsController.patchHabitEntry);

router.delete("/habitEntry/:habitEntryId", habitsController.deleteHabitEntry);

router.get("/habitCategories", habitsController.getHabitCategoriesForUser);

router.get("/", habitsController.getHabits);

router.post("/", habitsController.postHabit);

router.put("/:habitId", habitsController.putHabitEntry);

router.delete("/:habitId", habitsController.deleteHabit);

router.get("/:date", habitsController.getHabitsByDate);

module.exports = router;
