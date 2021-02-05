const {houseSchema,reviewSchema} = require('./validationSchema');
const AppError = require('./utils/AppError');
const wrapAsync = require('./utils/wrapAsync');
const House = require('./models/house');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
      req.session.returnTo = req.originalUrl
      req.flash('error', 'You must be signed in first!');
      return res.redirect('/login');
  }
  next();
}

module.exports.isHouseOwner = wrapAsync(async (req, res, next) => {
  const {id} = req.params;
  const house = await House.findById(id);
  if(!house){
    req.flash('error','Cannot find the house');
    return res.redirect('/houses');
  }
  if(!house.owner.equals(req.user._id)){
    req.flash('error', 'You do not have permission to do that');
    return res.redirect(`/houses/${id}`);
  }
  next();
});

module.exports.isReviewOwner = wrapAsync( async (req, res, next) => {
  const {id,reviewId} = req.params;
  const review = await Review.findById(reviewId);
  if(!review){
    req.flash('error','Cannot find the review');
    return res.redirect(`/houses/${id}`);
  }
  if(!review.owner.equals(req.user._id)){
    req.flash('error', 'You do not have permission to do that');
    return res.redirect(`/houses/${id}`);
  }
  next();
});

module.exports.validateHouse = (req,res,next)=> {
  const {error} = houseSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new AppError(msg, 400)
  } else {
    next();
  }
}

module.exports.validateReview = (req,res,next)=> {
  const {error} = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new AppError(msg, 400)
  } else {
    next();
  }
}