const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//const routesHandler = require('./routes/auth.js');
//const Schemas = require("../models/Schemas.js");
const Spot = require("./models/Spot");
//const User = require("./models/User");
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
  email: { type: String, unique: true },
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Spot",
    },
  ],
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
    //console.log(req.user);
    next();
  });
};

app.get("/login", authenticateJWT, (req, res) => {
  res.status(200).send({
    message: "User is still logged in ",
    user: { username: req.user.username, favorites: req.user.favorites },
    loggedIn: true,
  });
});

// app.post("/login", (req, res) => {
//   const user = new User({
//     username: req.body.username,
//     password: req.body.password,
//   });

//   req.login(user, function (err) {
//     console.log(user)
//     if (err) {
//       console.log(err);
//       res.status(400).send({
//         success: false,
//         message: "Failed to login user. Error " + err,
//       });
//     } else {
//       passport.authenticate("local")(req, res, function () {
//         const token = jwt.sign(
//           { userId: user._id.toString(), username: user.username },
//           process.env.SECRETJWT,
//           { expiresIn: "4h" }
//         );
//         const time = 60 * 60 * 4 * 1000; //4 hours in milliseconds
//         const expirationDate = new Date(Date.now() + time);

//         res.cookie("token", token, {
//           httpOnly: true,
//           sameSite: "strict",
//           expires: expirationDate,
//         });
//         res.status(200).send({
//           success: true,
//           message: "Authentication successful",
//           token: token,
//           user: { userId: user._id.toString(), username: user.username },
//         });
//         console.log("before " + user);
//         req.session.user = { userId: user._id.toString(), username: user.username };
//         console.log("after " +req.session.user);
//       });
//     }
//   });
// });

app.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Find the user in the database
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Check the password
    const isMatch = await user.authenticate(password);

    if (!isMatch) {
      return res.status(400).send({
        success: false,
        message: "Invalid username or password",
      });
    }

    // If the password is correct, proceed with the authentication
    req.login(user, function (err) {
      if (err) {
        console.log(err);
        return res.status(400).send({
          success: false,
          message: "Failed to login user. Error " + err,
        });
      }

      passport.authenticate("local")(req, res, function () {
        const token = jwt.sign(
          { userId: user._id, username: user.username },
          process.env.SECRETJWT,
          { expiresIn: "4h" }
        );
        const time = 60 * 60 * 4 * 1000; //4 hours in milliseconds
        const expirationDate = new Date(Date.now() + time);

        res.cookie("token", token, {
          httpOnly: true,
          sameSite: "strict",
          expires: expirationDate,
        });
        res.status(200).send({
          success: true,
          message: "Authentication successful",
          token: token,
          user: { userId: user._id, username: user.username },
        });
        req.session.user = {
          userId: user._id.toString(),
          username: user.username,
        };
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
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
});

app.get("/spots", async (req, res) => {
  const spots = await Spot.find({});
  res.send(spots);
});

app.post("/spot", async (req, res) => {
  try {
    const { name, latitude, longitude, description, whenToGo, imageUrl } =
      req.body;
    const spot = new Spot({
      name,
      latitude,
      longitude,
      description,
      whenToGo,
      imageUrl,
    });
    await spot.save();
    res.send(spot);
  } catch (err) {
    console.log(err);
  }
});

app.get("/spots/:id", async (req, res) => {
  try {
    const spot = await Spot.findById(req.params.id);
    if (!spot) {
      return res.status(404).send({ message: "Spot not found" });
    }
    res.send(spot);
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
});

app.get("/users/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(user);
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
});

app.get("/users/:username/favorites", async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(user.favorites);
    console.log(user.favorites);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal server error" });
  }
});

app.post("/users/:username/favorites", async (req, res) => {
  try {
    const { spotId } = req.body;
    const username = req.params.username;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    if (!user.favorites.includes(spotId)) {
      user.favorites.push(spotId);
      await user.save();
    }
    res.send(user);
  } catch (err) {
    console.log(err);
  }
});

app.delete("/users/:username/favorites", async (req, res) => {
  try {
    const { spotId } = req.body;
    const username = req.params.username;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Remove spotId from favorites
    user.favorites = user.favorites.filter((id) => id !== spotId);
    await user.save();

    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
