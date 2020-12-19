const Review = require('../models/reviews');
const Park = require('../models/parks');
/* req.path, req.originalUrl are request objects to keep tract of where
the user was on before logging in, and we can redirect them after they loggin. */
module.exports.isLoggedIn = (req, res, next) => {
    req.session.returnTo = req.originalUrl; // returnTo is what you set, to store in the session
    if(!req.isAuthenticated()) {
        req.flash('error', 'Please Login');
        return res.redirect('/login');
    }
    next();
}

// req.params
// This property is an object containing properties mapped to the named route “parameters”. For example, if you have the route /user/:name, then the “name” property is available as req.params.name. This object defaults to {}.
module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You don not have permission');
        return res.redirect(`/parks/${id}`);
    }
    next();
}

module.exports.isParkAuthor = async (req, res, next) => {
    const {id} = req.params;
    const park = await Park.findById(id);
    if(!park.author.equals(req.user._id)){
        req.flash('error', 'You don not have permission');
        return res.redirect(`/parks/${id}`);
    }
    next();
}
