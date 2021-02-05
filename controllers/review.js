const Review = require('../models/review');
const House = require('../models/house');


module.exports.createReview = async (req,res)=>{
  const {id} = req.params;
  const review = new Review(req.body.review);
  review.owner=req.user._id;
  const house = await House.findById(id);
  house.reviews.push(review);
  await review.save();
  await house.save();
  req.flash('success','Successfully posted a review');
  res.redirect(`/houses/${id}`);
};

module.exports.deleteReview = async (req,res)=>{
  const {id, reviewId} = req.params;
  await House.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash('success','Successfully deleted the review');
  res.redirect(`/houses/${id}`);
};
