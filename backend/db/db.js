import { MongoClient, ServerApiVersion } from "mongodb";

const URI = "mongodb+srv://antony:antony@cluster0.gf1z8yk.mongodb.net/";
const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

try {
  await client.connect();
  await client.db("OLX").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
} catch (err) {
  console.error(err);
}

let db = client.db("Users");

export default db;
