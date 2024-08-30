require("dotenv").config();
const express = require("express");
const { connect } = require("./util/database");

const app = express();
const port = 3000;
// const userRoutes = require("./routes/users");
// const mongoConnect = require("./util/database");

// app.use(userRoutes);

// app.use((req, res, next) => {
//   res.status(404).send();
//   //...
// });

async function startServer() {
  try {
    const client = await connect();
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });

    // Handling shutdown
    const close = async () => {
      await client.close();
      console.log("MongoDB connection closed");
      process.exit();
    };

    process.on("SIGINT", close);
    process.on("SIGTERM", close);
  } catch (error) {
    console.error("Failed to start the server", error);
  }
}

startServer();
