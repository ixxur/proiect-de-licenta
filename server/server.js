const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
//const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
//const routesHandler = require('./routes/auth.js');
//const Schemas = require("../models/Schemas.js");
const findOrCreate = require("mongoose-findorcreate");
const passportLocalMongoose = require("passport-local-mongoose");
require("dotenv/config");

const app = express();
const port = process.env.PORT || 5000;

app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
//app.use('/', routesHandler);
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

const uri = process.env.DB_URI;

// mongoose.connect(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

const connectToMongoose = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};
connectToMongoose();

const userSchema = new mongoose.Schema({
  // _id
  email: { type: String },
  password: { type: String },
  //GoogleId: String,
  //spots: {type: [Schema.Types.ObjectId], ref: 'spots'}
});

// const userSchema = new mongoose.Schema({
//   email: String,
//   password: String,
// });

userSchema.plugin(findOrCreate);
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("users", userSchema);

passport.use(User.createStrategy());
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const connectToMongoDB = async() => {
//   try {
//     await client.connect();
//     console.log("Connected to MongoDB");
//   } catch (error) {
//     console.error("Error connecting to MongoDB", error);
//     process.exit(1);
//   }
// }

// connectToMongoDB();

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/api", (req, res) => {
  res.json({ message: "Hello from the server!" });
});

// app.get("/addData", async (req, res) => {
//   try {
//     const collection = client.db("licenta").collection("users");
//     const data = { key: "value" };
//     const result = await collection.insertOne(data);
//     res.send(`Data inserted with id: ${result.insertedId}`);
//   } catch (error) {
//     console.error("Error inserting data", error);
//     res.status(500).send("Error inserting data");
//   }
// });

// app.post("/register", (req, res) => {
//   try {
//     const collection = client.db("licenta").collection("users");
//     const data = { email: "" };
//   } catch (error) {
//     console.error("Error inserting data", error);
//     res.status(500).send("Error inserting data");
//   }
// });

// app.post("/register", (req, res) => {
//   try {User.register(
//     { username: req.body.username, password: req.body.password }} catch {

//     }
//     function (err, user) {
//       if (err) {
//         console.log(err);
//         //res.redirect("/register");
//       }
//       // } else {
//       //   passport.authenticate("local")(req, res, function () {
//       //     res.redirect("/secrets");
//       //   });
//       // }
//     }
//   );
// });
app.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        res.end(user.username + " is logged in");
      });
    }
  });
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  User.register(new User({ username }), password, (err, user) => {
    if (err) {
      console.log(err);
      res.send("Failed to register user");
    }
    passport.authenticate("local")(req, res, () => {
      res.send("Success registering user");
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
