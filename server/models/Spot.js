const mongoose = require('mongoose');

const SpotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  whenToGo: {
    type: String,
    required: true,
  },
  imageUrl: {type: String},
  ratings: [Number],
  avgRating: { type: Number, default: 0 }
});

module.exports = mongoose.model('Spot', SpotSchema);