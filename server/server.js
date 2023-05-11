const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const jwt = require("jsonwebtoken");
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

userSchema.plugin(findOrCreate);
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("users", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const authenticateJWT = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.SECRETJWT, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    req.user = decoded;
    next();
  });
};

app.get("/api", (req, res) => {
  res.json({ message: "Hello from the server!" });
});

app.get("/login", authenticateJWT, (req, res) => {
  res.status(200).send({
    message: "User is still logged in ",
    user: { username: req.user.username },
    loggedIn: true,
  });
});

app.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, function (err) {
    if (err) {
      console.log(err);
      res.status(400).send({
        success: false,
        message: "Failed to login user. Error " + err,
      });
    } else {
      passport.authenticate("local")(req, res, function () {
        const token = jwt.sign(
          { userId: user._id, username: user.username },
          process.env.SECRETJWT,
          { expiresIn: "1h" }
        );
        const oneHour = 60 * 60 * 1000; //one hour in milliseconds
        const expirationDate = new Date(Date.now() + oneHour);

        res.cookie("token", token, {
          httpOnly: true,
          sameSite: "strict",
          expires: expirationDate,
        });
        res.status(200).send({
          success: true,
          message: "Authentication successful",
          token: token,
          user: { username: user.username },
        });
        req.session.user = { username: user.username };
        //console.log(req.session.user);
      });
    }
  });
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  User.register(new User({ username }), password, (err, user) => {
    if (err) {
      console.log(err);
      res.status(400).send({
        success: false,
        message: "Failed to register new user. Error " + err,
      });
    }
    passport.authenticate("local")(req, res, () => {
      res
        .status(200)
        .send({ success: true, message: "Success registering new user" });
    });
  });
});

app.get("/home", (req, res) => {
  res.status(200).send({ success: true, message: "Here is the home page" });
  console.log("HOME PAGE");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
