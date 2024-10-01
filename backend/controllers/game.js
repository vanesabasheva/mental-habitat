const User = require("../models/User");
const logger = require("../app");
exports.postUseResources = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    logger.info(
      { action: "use_resources", userId: userId },
      "User resource usage initiated."
    );
    const user = await User.findById(userId);

    logger.debug(
      {
        action: "check_user_stats",
        userId: userId,
        stats: user.stats,
      },
      "Checking user stats before resetting."
    );

    Object.keys(user.stats).forEach((resource) => (user.stats[resource] = 0));
    user.levelProgress += 25;

    logger.debug(
      {
        action: "update_level_progress",
        userId: userId,
        levelProgress: user.levelProgress,
        stats: user.stats,
      },
      "Updated level progress."
    );

    if (user.levelProgress === 100) {
      logger.info(
        {
          action: "use_resources; level_up",
          userId: userId,
          newLevel: user.currentLevel + 1,
        },
        "User leveled up."
      );

      user.currentLevel += 1;
      user.levelProgress = 0;
    } else {
      logger.debug(
        {
          action: "use_resources; progress_update",
          userId: userId,
          levelProgress: user.levelProgress,
        },
        "User progress updated."
      );
    }

    await user.save();
    logger.info(
      {
        action: "use_resources; resources_used",
        userId: userId,
        currentLevel: user.currentLevel,
        levelProgress: user.levelProgress,
      },
      "Resources used and progress updated successfully."
    );

    res.status(200).json({
      message: "Resources used. Progress updated",
      currentLevel: user.currentLevel,
      levelProgress: user.levelProgress,
    });
  } catch (error) {
    logger.error({ error, action: { use_resources } }, "An error occurred.");
    res.send(500).json({ error: "Failed to use resources" });
  }
};
