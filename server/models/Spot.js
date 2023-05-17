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
  imageUrl: String,
});

module.exports = mongoose.model('Spot', SpotSchema);