// Setup Logger
const bunyan = require("bunyan");
const seq = require("bunyan-seq");
require("dotenv").config();

const logger = bunyan.createLogger({
  name: "MentalHabitat",
  streams: [
    {
      stream: process.stdout,
      level: "warn",
    },
    seq.createStream({
      serverUrl: "http://localhost:5341",
      level: "info",
    }),
  ],
});

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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;

/////////////////////
// Route handlers //
////////////////////
const userRoutes = require("./routes/users");
const habitsRoutes = require("./routes/habits");
const gameRoutes = require("./routes/game");

/////////////
// Routes //
////////////
app.use("/users", userRoutes); //Mount user routes at /users
app.use("/habits", habitsRoutes);
app.use("/game", gameRoutes);

////////////////////
// Error handling //
////////////////////
app.use((err, req, res, next) => {
  logger.error("Unhandled exception", err);
  res.status(500).send("Server error. Please try again later.");
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
