const express = require("express");
const router = express.Router();
const isAth = require("../middleware/is-auth");
const gameController = require("../controllers/game");

router.use(isAth);

router.get("/progress", gameController.getUserProgress);

router.post("/use-resources", gameController.postUseResources);

module.exports = router;
