// Setup Logger
const bunyan = require("bunyan");
const seq = require("bunyan-seq");

require("dotenv").config();

const logger2 = bunyan.createLogger({
  name: "MentalHabitat",
  streams: [
    {
      stream: process.stdout,
      level: process.env.NODE_ENV === "production" ? "error" : "warn",
    },
    seq.createStream({
      serverUrl: "http://localhost:5341",
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
    }),
  ],
});

const logger = {
  info: (object, message) => {},
  warn: (object, message) => {},
  error: (object, message) => {},
  debug: (object, message) => {},
};

/////////////////////////////////////////////
// Export logger to other parts of the app //
////////////////////////////////////////////
module.exports = logger;

///////////////////////////
// application's startup //
///////////////////////////
logger.info("Application starting...");

const express = require("express");
const app = express();

////////////////////
// Connect to DB //
///////////////////
const { connect } = require("./util/database");

////////////////
// Middleware //
////////////////
const cors = require("cors");
const helmet = require("helmet");
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

///////////////////
// Morgan logging//
///////////////////

const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(morgan("combined", { stream: accessLogStream }));
const PORT = process.env.PORT || 3000;

/////////////////////
// Route handlers //
////////////////////
const userRoutes = require("./routes/users");
const habitsRoutes = require("./routes/habits");
const gameRoutes = require("./routes/game");
const statisticsRoutes = require("./routes/statistics");

/////////////
// Routes //
////////////
app.use("/users", userRoutes); //Mount user routes at /users
app.use("/habits", habitsRoutes);
app.use("/game", gameRoutes);
app.use("/statistics", statisticsRoutes);

////////////////////
// Error handling //
////////////////////
app.use((err, req, res, next) => {
  logger.error("Unhandled exception", err);
  return res.status(500).send("Server error. Please try again later.");
});

async function startServer() {
  try {
    const client = await connect();
    app.listen(PORT, () => {
      logger.info(`Server running at http://localhost:${PORT}`);
    });

    // Handling shutdown
    const close = async () => {
      await client.close();
      logger.info("MongoDB connection closed");
      process.exit();
    };

    // Routes
    process.on("SIGINT", close);
    process.on("SIGTERM", close);
  } catch (error) {
    logger.error("Failed to start the server", error);
  }
}

startServer();
