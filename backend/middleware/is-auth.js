const logger = require("../app");

const jwt = require("jsonwebtoken");
logger.info("Exporting auth middleware");
module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Authentication failed" });

  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) return res.status(403).json({ error: "Token is invalid" });
    req.user = user;
    next();
  });
};
