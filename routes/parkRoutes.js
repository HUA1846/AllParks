const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { parkSchema } = require('../schemas.js');

const ExpressError = require('../utils/ExpressError');
const Park = require('../models/parks');
const validatePark = (req, res, next) => {
    const {error} = parkSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join()
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


router.get('/', catchAsync(async (req, res) => {
    const parks = await Park.find({});
    res.render('parks/index', {parks});
}));

router.get('/new', (req, res) => {
    res.render('parks/new');
});

router.post('/', validatePark, catchAsync(async (req, res, next) => {
    // if(!req.body.name) throw new ExpressError('invalid data', 400);
    const newPark = new Park(req.body);
    await newPark.save();
    req.flash('success', 'successfully added a new park!');
    res.redirect(`/parks/${newPark._id}`);
  
}));

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const park = await Park.findById(id).populate('reviews');
    if(!park){
        req.flash('error', 'cannot find that park');
        return res.redirect('/parks');
    }
    res.render('parks/show', {park});
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const park = await Park.findById(id);
    if(!park){
        req.flash('error', 'cannot find that park');
        return res.redirect('/parks');
    }
    res.render('parks/edit', {park});
}));

router.put('/:id', validatePark, catchAsync(async (req, res) =>{
    const { id } = req.params;
    const park = await Park.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    req.flash('success', 'successfully updated campground');
    res.redirect(`/parks/${park._id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const deleted = await Park.findByIdAndDelete(id);
    req.flash('success', 'park is deleted!')
    res.redirect('/parks');
}));

module.exports = router;