const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { parkSchema } = require('../schemas.js');
const {isLoggedIn, isParkAuthor} = require('../utils/auth');
const ExpressError = require('../utils/ExpressError');
const parks = require('../controllers/parks');
const validatePark = (req, res, next) => {
    const {error} = parkSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join()
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.route('/')
     .get(catchAsync(parks.index))
     .post(validatePark, catchAsync(parks.postPark))

router.get('/new', isLoggedIn, parks.newParkForm);

router.get('/:id', catchAsync(parks.showPark));

router.get('/:id/edit', isLoggedIn, catchAsync(parks.editParkForm));

router.put('/:id', isParkAuthor, validatePark, catchAsync(parks.editPark));

router.delete('/:id', isParkAuthor, catchAsync(parks.deletePark));

module.exports = router;