const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync');
const {isLoggedIn, validateReview, isReviewOwner} = require('../middleware');
const review = require('../controllers/review');


router.post('/',isLoggedIn, validateReview, wrapAsync(review.createReview));

router.delete('/:reviewId',isLoggedIn,isReviewOwner, wrapAsync(review.deleteReview));


module.exports = router;