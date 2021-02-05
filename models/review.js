const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  rating: Number,
  description: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Review',reviewSchema);