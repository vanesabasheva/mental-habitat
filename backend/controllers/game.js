const User = require("../models/User");

exports.postUseResources = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);

    Object.keys(user.stats).forEach((resource) => (user.stats[resource] = 0));
    user.levelProgress += 25;
    if (user.levelProgress === 100) {
      user.currentLevel += 1;
      user.levelProgress = 0;
    }

    await user.save();
    res.status(200).json({
      message: "Resources used. Progress updated",
      currentLevel: user.currentLevel,
      levelProgress: user.levelProgress,
    });
  } catch (error) {
    console.error(error);
    res.send(500).json({ error: "Failed to use resources" });
  }
};
