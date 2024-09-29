const express = require("express");
const router = express.Router();
const isAth = require("../middleware/is-auth");
const gameController = require("../controllers/game");

router.use(isAth);

router.post("/use-resources", gameController.postUseResources);

module.exports = router;
