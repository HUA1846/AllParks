if(process.env.NODE_ENV !== "production") {
    require('dotenv').config(); // this runs as long as in development mode
}
console.log(process.env.CLOUDINARY_CLOUD_NAME);

const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override') 
const ExpressError = require('./utils/ExpressError');
const parkRoutes = require('./routes/parkRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
mongoose.connect('mongodb://localhost:27017/socalparks', {
    useNewUrlParser: true,
    useCreateIndex: true, 
    useUnifiedTopology: true,
    useFindAndModify: false
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

app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    name: 'session',
    secret: 'not really a secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// flash has to be before the route handlers
app.use((req, res, next) => {
    res.locals.currentUser = req.user; //req.user is made by passport
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/', (req, res) => {
    res.render('home');
})

app.use('/parks', parkRoutes);
app.use('/parks/:id/reviews', reviewRoutes);
app.use('/', userRoutes);
        //the prefix you want to use for the routes

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