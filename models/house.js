const mongoose = require('mongoose');
const Review = require('./review')

const ImageSchema = new mongoose.Schema({
  url: String,
  filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const houseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  rent: {
    type: String,
    required: true,
    min: 0
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  images: [ImageSchema],
  description: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
},opts);

houseSchema.virtual('properties.popUpMarkup').get(function () {
  return `
  <strong><a href="/houses/${this._id}">${this.name}</a><strong>
  <p>${this.description.substring(0, 20)}...</p>`
});


houseSchema.post('findOneAndDelete', async(house)=>{
  if(house){
    await Review.deleteMany({_id : {$in: house.reviews}});
  }
});

module.exports = mongoose.model('House',houseSchema);