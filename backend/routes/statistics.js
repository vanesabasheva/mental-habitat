const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/is-auth");
const statisticsController = require("../controllers/statistics");

router.use(isAuth);

router.get("/smoking", statisticsController.getSmokingStats);

router.get("/alcohol", statisticsController.getAlcoholStats);

module.exports = router;
