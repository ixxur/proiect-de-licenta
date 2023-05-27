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
const Spot = require("./models/Spot");
const Rating = require("./models/Rating");
const Comment = require("./models/Comment");
//const User = require("./models/User");
const findOrCreate = require("mongoose-findorcreate");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const axios = require("axios");
require("dotenv/config");

const app = express();
const port = process.env.PORT || 5001;

app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_API, credentials: true }));
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

const userSchema = new mongoose.Schema(
  {
    // _id
    username: { type: String, unique: true, required: true },
    profilePicture: { type: Number, default: 0 },
    name: { type: String, required: true },
    role: { type: String, default: "regular" },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Spot",
      },
    ],
    visited: [
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
    googleId: String,
  },
  { timestamps: true }
);
 
userSchema.plugin(findOrCreate); 
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("users", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        console.log(profile);
        if (!user) {
          user = new User({
            googleId: profile.id,
            username: profile.emails[0].value,
            name: profile.displayName,
          });
          console.log(user);
          await user.save();
        }
        cb(null, user);
      } catch (err) {
        cb(err, null);
      }
    }
  )
);
 
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

const authorizeAdmin = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.SECRETJWT, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    // Check if the user is an admin
    if (decoded.role !== "admin") {
      return res.status(403).send({ message: "Forbidden" });
    }

    req.user = decoded;
    //console.log(decoded);
    next();
  });
};

app.get("/auth/google", passport.authenticate("google", ["profile", "email"]));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  async (req, res) => {
    // User has been authenticated and logged in.
    // Now, generate a JWT and respond with it.
    try {
      const token = jwt.sign(
        {
          userId: req.user._id,
          username: req.user.username,
          role: req.user.role,
        },
        process.env.SECRETJWT
      );
      const time = 60 * 60 * 4 * 1000; //4 hours in milliseconds
      const expirationDate = new Date(Date.now() + time);
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        expires: expirationDate,
      });
      res.redirect(`${process.env.FRONTEND_API}/home`);
    } catch (err) {
      console.log(err);
      return res.status(400).send({
        success: false,
        message: "Failed to login user. Error " + err,
      });
    }
  }
);

app.get("/login", authenticateJWT, (req, res) => {
  res.status(200).send({
    message: "User is still logged in ",
    user: { username: req.user.username, favorites: req.user.favorites },
    loggedIn: true,
  });
});

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
          { userId: user._id, username: user.username, role: user.role },
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
          user: {
            userId: user._id,
            username: user.username,
            name: user.name,
            role: user.role,
          },
        });
        req.session.user = {
          userId: user._id.toString(),
          username: user.username,
          role: user.role,
        };
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/logout", (req, res) => {
  try {
    // clear the session data
    req.session = null;

    // clear the cookie holding the jwt
    res.clearCookie("token");

    // send a success message
    res.send({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error", error);
    res
      .status(500)
      .json({ message: "Error while logging out. Please try again." });
  }
});

app.post("/register", (req, res) => {
  const { username, password, name } = req.body;
  User.register(new User({ username, name }), password, (err, user) => {
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

app.post("/spot", authorizeAdmin, async (req, res) => {
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

app.put("/spots/:id", authenticateJWT, authorizeAdmin, async (req, res) => {
  const spotId = req.params.id;
  const updatedSpot = req.body;
  console.log(req.body);
  try {
    const spot = await Spot.findByIdAndUpdate(spotId, updatedSpot, {
      new: true,
    });

    if (!spot) {
      return res.status(404).send({ message: "Spot not found" });
    }

    res.send(spot);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error updating spot" });
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

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ message: "Error fetching users" });
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

app.put("/users/:username", authenticateJWT, async (req, res) => {
  const { username } = req.params;
  const { name, profilePicture } = req.body;

  if (req.user.username !== username) {
    return res.status(403).json({ message: "Unauthorized action" }); // the token's username does not match the request username
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    if (name) user.name = name;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;

    await user.save();

    res.status(200).send({
      success: true,
      message: "User updated successfully",
      user: {
        username: user.username,
        name: user.name,
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/users/:username", authenticateJWT, async (req, res) => {
  const { username } = req.params;
  try {
    // Check if the user is an admin
    if (req.user.role !== "admin") {
      return res.status(403).send({ message: "Forbidden" });
    }

    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    // Delete any comments made by the user
    await Comment.deleteMany({ username: username });

    await User.deleteOne({ username: username });
    res.send({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send({ message: "Error deleting user" });
  }
});

app.get("/users/:username/favorites", async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username }).populate("favorites");
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

app.post("/users/:username/visited", async (req, res) => {
  try {
    const { spotId } = req.body;
    const username = req.params.username;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    if (!user.visited.includes(spotId)) {
      user.visited.push(spotId);
      await user.save();
    }
    res.send(user);
  } catch (err) {
    console.log(err);
  }
});

app.delete("/users/:username/visited", async (req, res) => {
  try {
    const { spotId } = req.body;
    console.log("spotId " + spotId);
    const username = req.params.username;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const index = user.visited.indexOf(spotId);
    if (index !== -1) {
      user.visited.splice(index, 1);
      console.log("visited " + user.visited);
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
    const userRatings = await Rating.find({ _id: { $in: user.ratings } });
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
    const user = await User.findOne({ username: username }).populate("ratings");
    console.log("USER " + user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the spot by its ID
    const spot = await Spot.findById(spotId);
    console.log("SPOT " + spot);
    if (!spot) {
      return res.status(404).json({ message: "Spot not found" });
    }
    let userRating = await Rating.findOne({
      username: username,
      spotId: spotId,
    });
    console.log("USER RATING 1 " + userRating);
    if (!userRating) {
      userRating = new Rating({
        username: username,
        spotId: spotId,
        rating: rating,
      });
      user.ratings.push(userRating._id);
      console.log("USER RATING 2: " + userRating);
    } else {
      userRating.rating = rating;
      console.log("USER RATING 3: " + userRating);
    }

    await userRating.save();
    await user.save();

    //spot.ratings.push(userRating._id);
    //await spot.save();

    spot.avgRating = await Rating.aggregate([
      { $match: { _id: { $in: spot.ratings } } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]).then((result) => {
      if (result[0]) {
        return Number(result[0].avgRating.toFixed(1));
      } else {
        return 0;
      }
    });

    if (!spot.ratings.includes(userRating._id)) {
      spot.ratings.push(userRating._id);
    }

    await spot.save();
    console.log(spot.avgRating);
    res.status(200).send({ avgRating: spot.avgRating });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error rating spot", error: error.message });
  }
});

app.post("/spots/:spotId/comments", async (req, res) => {
  const comment = new Comment({
    spotId: req.params.spotId,
    username: req.body.username,
    text: req.body.text,
  });

  try {
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: "Error posting comment" });
  }
});

app.get("/spots/:spotId/comments", async (req, res) => {
  try {
    const spotId = req.params.spotId;
    const comments = await Comment.find({ spotId: spotId });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Error fetching comments" });
  }
});

app.put("/comments/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const { text } = req.body;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.text = text;

    await comment.save();

    res.status(200).json({ message: "Comment updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating comment", error: error.message });
  }
});

app.delete("/comments/:commentId", authenticateJWT, async (req, res) => {
  const { commentId } = req.params;
  try {
    // Verify the comment exists and belongs to the user
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // (Optional) Verify the logged-in user owns the comment
    // This requires some kind of authentication middleware that puts the user's info into req.user
    if (req.user.username !== comment.username && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    // Delete the comment
    await Comment.deleteOne({ _id: commentId });
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting comment", error: error.message });
  }
});

app.get("/spots/:id/weather", async (req, res) => {
  try {
    const spot = await Spot.findById(req.params.id);
    if (!spot) {
      return res.status(404).json({ message: "Spot not found" });
    }

    try {
      const weatherApiKey = process.env.OPEN_WEATHER_API_KEY;
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${spot.latitude}&lon=${spot.longitude}&exclude=current,minutely,hourly,alerts&appid=${weatherApiKey}`
      );
      res.send(weatherResponse.data);
    } catch (axiosError) {
      console.error(axiosError);
      res.status(500).json({
        message: "Error fetching weather data from OpenWeatherMap",
        error: axiosError.message,
      });
    }
  } catch (mongoError) {
    console.error(mongoError);
    res.status(500).json({
      message: "Error fetching spot from MongoDB",
      error: mongoError.message,
    });
  }
});

app.get(
  "/admin/spots/:id",
  authenticateJWT,
  authorizeAdmin,
  async (req, res) => {
    try {
      const spot = await Spot.findById(req.params.id);
      if (!spot) {
        return res.status(404).send({ message: "Spot not found" });
      }
      res.send(spot);
    } catch (err) {
      res.status(500).send({ message: "Server error" });
    }
  }
);

app.get("/admin/spots", authenticateJWT, authorizeAdmin, async (req, res) => {
  const spots = await Spot.find({});
  res.send(spots);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
