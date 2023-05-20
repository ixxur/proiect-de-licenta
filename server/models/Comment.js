const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    spotId: { type: mongoose.Schema.Types.ObjectId, required: true },
    username: { type: String, required: true },
    text: { type: String, required: true },
  }, { timestamps: true });
  
  module.exports = mongoose.model('Comment', CommentSchema);