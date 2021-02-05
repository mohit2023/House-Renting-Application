const mongoose = require('mongoose');
const Review = require('./review')

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
  image: String,
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
});


houseSchema.post('findOneAndDelete', async(house)=>{
  if(house){
    await Review.deleteMany({_id : {$in: house.reviews}});
  }
})

module.exports = mongoose.model('House',houseSchema);