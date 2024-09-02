const uri = process.env.MONGO_URI.replace(
  "${MONGO_PASSWORD}",
  process.env.MONGO_PASSWORD
);
const { MongoClient, ServerApiVersion } = require("mongodb");
const mongoose = require("mongoose");

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db = null;

async function connect() {
  try {
    const conn = await mongoose.connect(uri, {
      serverApi: ServerApiVersion.v1,
      autoIndex: true,
    });
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }
}

function getDb() {
  if (!db) {
    throw new Error("No database connection");
  }
  return db;
}

//run().catch(console.dir);

module.exports = { connect, getDb };
