const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  username: { type: String, required: true },
  spotId: { type: mongoose.Schema.Types.ObjectId, ref: "Spot", required: true },
  rating: { type: Number, required: true }
});

module.exports = mongoose.model('Ratinng', RatingSchema);