const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  // _id
  username: {type: String},
  password: {type: String},
  //GoogleId: String,
  //spots: {type: [Schema.Types.ObjectId], ref: 'spots'}
});

// const spotSchema = new Schema({
//   // _id
//   name: String,
//   description: String,
//   latitude: Number,
//   longitude: Number,
// });

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("users", userSchema);
// const Spots = mongoose.model('spots', spotSchema, 'spots')

const mySchemas = { User: User };

module.exports = mySchemas;