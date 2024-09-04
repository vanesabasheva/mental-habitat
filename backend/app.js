require("dotenv").config();
const express = require("express");
const { connect } = require("./util/database");
const userRoutes = require("./routes/users");
const mongoose = require("mongoose");
const uri = process.env.MONGO_URI.replace(
  "${MONGO_PASSWORD}",
  process.env.MONGO_PASSWORD
);
const { ServerApiVersion } = require("mongodb");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 3000;

app.use("/users", userRoutes); //Mount user routes at /users

// const conn = mongoose
//   .connect(uri, {
//     serverApi: ServerApiVersion.v1,
//     autoIndex: true,
//   })
//   .then((result) => {
//     console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
//     app.listen(port, () => {
//       console.log(`Server running at http://localhost:${port}`);
//     });
//   });

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

    // Routes
    process.on("SIGINT", close);
    process.on("SIGTERM", close);
  } catch (error) {
    console.error("Failed to start the server", error);
  }
}

startServer();