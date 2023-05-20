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
const Rating = require("./models/Rating");
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
  username: { type: String, unique: true, required: true },
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Spot",
    },
  ],
  ratings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rating",
    },
  ],
  //GoogleId: String,
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

app.post("/spots/:id/rating", async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;

  try {
    // Find the spot by id
    const spot = await Spot.findById(id);

    // Add the new rating to the array and recalculate the average
    spot.ratings.push(rating);
    spot.avgRating =
      spot.ratings.reduce((a, b) => a + b, 0) / spot.ratings.length;

    // Save the updated spot
    await spot.save();

    res.status(200).send(spot);
  } catch (error) {
    res.status(400).json({ message: "Error updating rating" });
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
    //console.log(user.favorites);
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
    console.log("spotId " + spotId);
    const username = req.params.username;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const index = user.favorites.indexOf(spotId);
    if (index !== -1) {
      user.favorites.splice(index, 1);
      console.log("favorite " + user.favorites);
      await user.save();
    }
    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});

app.get("/users/:username/ratings", async (req, res) => {
  const { username } = req.params;
  console.log(username);
  try {
    // Find the user by their username
    const user = await User.findOne({ username: username }); // Make sure you find the user by the appropriate attribute (email in this case)

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userRatings = await Rating.find({ _id: { $in: user.ratings }});
    // Return the user's ratings
    console.log(userRatings);
    res.status(200).send(userRatings);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "Error fetching user's ratings", error: error.message });
  }
});

app.post("/users/:username/rating", async (req, res) => {
  const { username } = req.params;
  const { spotId, rating } = req.body;
  console.log(req.params);
  console.log(req.body);
  try {
    // Find the user by their username
    const user = await User.findOne({ username: username }).populate('ratings');
    console.log("USER " + user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the spot by its ID
    const spot = await Spot.findById(spotId);
    console.log("SPOT " + spot)
    if (!spot) {
      return res.status(404).json({ message: "Spot not found" });
    }
    let userRating = await Rating.findOne({ username: username, spotId: spotId });
    console.log("USER RATING 1 " + userRating);
    if (!userRating) {
      userRating = new Rating({ username: username, spotId: spotId, rating: rating });
      user.ratings.push(userRating._id);
      console.log("USER RATING 2: " + userRating);
    } else {
      userRating.rating = rating;
      console.log("USER RATING 3: " + userRating);
    }

    await userRating.save();
    await user.save();

    spot.ratings.push(userRating._id);
    //await spot.save();

    spot.avgRating = await Rating.aggregate([
      { $match: { _id: { $in: spot.ratings }}},
      { $group: { _id: null, avgRating: { $avg: "$rating" }}}
    ]).then(result => result[0]?.avgRating || 0);
       
    await spot.save();
    console.log(spot.avgRating);
    res.status(200).send({ avgRating: spot.avgRating });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error rating spot", error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
