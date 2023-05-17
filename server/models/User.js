const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    // _id
    email: { type: String },
    password: { type: String },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Spot",
      },
    ],
    //GoogleId: String,
    //spots: {type: [Schema.Types.ObjectId], ref: 'spots'}
  });