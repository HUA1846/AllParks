const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override') 
const Park = require('./models/parks');
const Review = require('./models/reviews');
const {parkSchema} = require('./schemas.js');
const {reviewSchema} = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
mongoose.connect('mongodb://localhost:27017/socalparks', {
    useNewUrlParser: true,
    useCreateIndex: true, 
    useUnifiedTopology: true 
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=> {
    console.log("Databse connected");
})
const app = express();
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validatePark = (req, res, next) => {
    const {error} = parkSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join()
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join()
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.get('/parks', catchAsync(async (req, res) => {
    const parks = await Park.find({});
    res.render('parks/index', {parks});
}));

app.get('/parks/new', (req, res) => {
    res.render('parks/new');
});

app.post('/parks', validatePark, catchAsync(async (req, res, next) => {
    // if(!req.body.name) throw new ExpressError('invalid data', 400);
    const newPark = new Park(req.body);
    await newPark.save();
    res.redirect(`parks/${newPark._id}`);
  
}));

app.get('/parks/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const park = await Park.findById(id).populate('reviews');
    res.render('parks/show', {park});
}));

app.get('/parks/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const park = await Park.findById(id);
    res.render('parks/edit', {park});
}));

app.put('/parks/:id', validatePark, catchAsync(async (req, res) =>{
    const { id } = req.params;
    const park = await Park.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/parks/${park._id}`);
}));

app.delete('/parks/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const deleted = await Park.findByIdAndDelete(id);
    res.redirect('/parks');
}));

app.post('/parks/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const park = await Park.findById(req.params.id);
    const review = new Review(req.body.review);
    park.reviews.push(review);
    await review.save();
    await park.save();
    res.redirect(`/parks/${id}`);
}))

app.delete('/parks/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Park.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/parks/${id}`);
}))

// {"review":{"rating":"3","body":"this is a review"}}

app.all('*', (req, res, next) => {
    next(new ExpressError('page not found', 404));
})
app.use((err, req, res, next) =>{
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Oh no, Something went wrong!"
    res.status(statusCode).render('error', {err});
})


app.listen(3000, ()=>{
        console.log("Listening on port 3000");
    })