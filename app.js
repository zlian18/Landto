const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');

// Routes
const landscapes = require('./routes/landscapes')
const comments = require('./routes/comments')
const users = require('./routes/users')

// const dbUrl = process.env.DB_URL;
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/landto';
const secret = process.env.SECRET || 'keyboard';

mongoose.connect(dbUrl);
mongoose.connection.on('error', err => { logError(err) });
mongoose.connection.once('open', () => {
    console.log('CONNECTED')
});

const app = express();

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
// Can use: app.set('views', path.join('./views'));, 
// but cannot start app when outside the current folder
app.set('views', path.join(__dirname, '/views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());



const store = new MongoStore({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 3600
})

store.on('error', function (e) {
    console.log("session error", e);
})

app.use(session({
    store,
    name: 'landto',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expiryDate: Date.now() + 60 * 60 * 1000,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.titleDetail = "Landscape Details"
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// Routes handlers
app.use('/landscapes', landscapes);
app.use('/', users);
app.use('/landscapes/:id/comments', comments);


app.get('/', (req, res) => {
    res.render("home");
})

app.listen(3000, () => {
    console.log("listening on port 3000");
})

// Error Handling
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})
app.use((err, req, res, next) => {
    var { statusCode = 500, message = "Something went wrong" } = err;
    if (!err.message) err.message = "Something went wrong";
    res.status(statusCode).render('partials/error', { err });
})