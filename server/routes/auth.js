const express = require("express");
const router = express.Router();
const Schemas = require("../models/Schemas.js");
const passportLocalMongoose = require("passport-local-mongoose");

router.get("/addUser", async (req, res) => {
  const user = new Schemas.User({
    username: req.body.username,
    password: req.body.password,
  });
  //const newUser = new Schemas.User(user);

  user
    .save()
    .then(() => {
      console.log("New user created");
      res.end("New user created");
    })
    .catch((error) => {
      console.log(error);
      res.end("User not added.");
    });
});

router.post("/register", (req, res) => {
  console.log("djvjrg");
  Schemas.User.register({ username: "ruxi" }, "password", (err, user) => {
    if (err) {
      console.log(err);
      res.end("User not added");
    } else {
      console.log("User added");
      res.end("User added");
    }
  });
});

router.get("/test", (req, res) => {
  res.json({ message: "Hello from the server!" });
});

module.exports = router;
