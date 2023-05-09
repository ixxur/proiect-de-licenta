const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const { MongoClient } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));


const uri =
  "mongodb+srv://ruxio2000:7czCGPYqRCom2oZU@cluster0.4ms0hf0.mongodb.net/licenta?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connectToMongoDB = async() => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
}

connectToMongoDB();

app.use(cors());
app.use(bodyParser.json());

app.get("/api", (req, res) => {
  res.json({ message: "Hello from the server!" });
});

app.get("/addData", async (req, res) => {
  try {
    const collection = client.db("licenta").collection("users");
    const data = { key: "value" };
    const result = await collection.insertOne(data);
    res.send(`Data inserted with id: ${result.insertedId}`);
  } catch (error) {
    console.error("Error inserting data", error);
    res.status(500).send("Error inserting data");
  }
});

app.post('/register', (req, res) => {
  try {
    const collection = client.db('licenta').collection('users');
    const data = {email: }
  } catch (error) {
    console.error("Error inserting data", error);
    res.status(500).send("Error inserting data");
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
