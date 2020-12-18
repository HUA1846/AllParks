const Review = require('../models/reviews');
const Park = require('../models/parks');

module.exports.postReview = async (req, res) => {
    const { id } = req.params;
    const park = await Park.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id; // link review with the current loggedIn user
    park.reviews.push(review);
    await review.save();
    await park.save();
    req.flash('success', 'Thanks for leaving a review!')
    res.redirect(`/parks/${id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Park.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Your review is deleted!')
    res.redirect(`/parks/${id}`);
}