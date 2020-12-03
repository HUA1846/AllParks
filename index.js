const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override') 
const Park = require('./models/parks');
const { nextTick } = require('process');
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

app.get('/parks', catchAsync(async (req, res) => {
    const parks = await Park.find({});
    res.render('parks/index', {parks});
}));

app.get('/parks/new', (req, res) => {
    res.render('parks/new');
});

app.post('/parks', catchAsync(async (req, res, next) => {
    if(!req.body.name) throw new ExpressError('invalide data', 400);
    const newPark = new Park(req.body);
    await newPark.save();
    res.redirect(`parks/${newPark._id}`);
  
}));

app.get('/parks/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const park = await Park.findById(id);
    res.render('parks/show', {park});
}));

app.get('/parks/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const park = await Park.findById(id);
    res.render('parks/edit', {park});
}));

app.put('/parks/:id', catchAsync(async (req, res) =>{
    const { id } = req.params;
    const park = await Park.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/parks/${park._id}`);
}));

app.delete('/parks/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const deleted = await Park.findByIdAndDelete(id);
    res.redirect('/parks');
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('page not found', 404));
})
app.use((err, req, res, next) =>{
    const {message="something went wrong", statusCode = 500} = err;
    res.status(statusCode).send(message);
})


app.listen(3000, ()=>{
        console.log("Listening on port 3000");
    })