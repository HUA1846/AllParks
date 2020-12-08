const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const { reviewSchema} = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');
const Review = require('../models/reviews');
const Park = require('../models/parks');
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
router.post('/', validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const park = await Park.findById(req.params.id);
    const review = new Review(req.body.review);
    park.reviews.push(review);
    await review.save();
    await park.save();
    req.flash('success', 'Thanks for leaving a review!')
    res.redirect(`/parks/${id}`);
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Park.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Your review is deleted!')
    res.redirect(`/parks/${id}`);
}))

module.exports = router;