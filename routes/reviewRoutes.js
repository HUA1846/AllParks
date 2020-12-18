const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const { reviewSchema} = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');
const {isLoggedIn, isReviewAuthor} = require('../utils/auth');
const reviews = require('../controllers/reviews')
const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join()
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// {"review":{"rating":"3","body":"this is a review"}}
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.postReview))

//'/parks/:id/reviews/reviewId'
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;