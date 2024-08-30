const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.MONGO_URI.replace(
  "${MONGO_PASSWORD}",
  process.env.MONGO_PASSWORD
);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connect() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }
}
//run().catch(console.dir);

module.exports = { connect };
