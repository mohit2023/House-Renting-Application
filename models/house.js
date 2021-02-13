const { boolean } = require('joi');
const mongoose = require('mongoose');
const Review = require('./review');
const { cloudinary } = require("../cloudinary");

const ImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  }
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
    line1: {
      type: String,
      required: true
    },
    line2: {
      type: String,
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  },
  rent: {
    type: String,
    required: true,
    min: 0
  },
  availableStatus: {
    type: Boolean,
    default: false
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
    if (house.images) {
      for (let file of house.images) {
          await cloudinary.uploader.destroy(file.filename);
      }
    }
  }
});

module.exports = mongoose.model('House',houseSchema);