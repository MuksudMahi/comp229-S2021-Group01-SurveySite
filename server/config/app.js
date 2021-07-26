/*File Name: App.js, Student Names:Runali Patel - 301110236, Muksud Hussain Mahi - 301155894, Devanshi Patel – 301161377 , 
Tanisha Sharma - 301144152, Sabah Hussein - 300882730 Date:14/07/2021 */
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

//modules for authentication
let session = require('express-session');
let passport = require('passport');
let passportLocal = require('passport-local');
let localStrategy = passportLocal.Strategy;
let flash = require('connect-flash');

//database setup
let mongoose = require('mongoose');
let DB = require('./db');

//point mongoose to the DB URI
mongoose.connect(DB.URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true});

let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection error'));
mongoDB.once('open', ()=>{
  console.log("Connected to MongoDB...");
});
let indexRouter = require('../routes/index');
let surveyRouter = require('../routes/survey');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.SECRET || "secretkey12345"));
app.use(session({ cookie: { maxAge: 60000 }, secret: process.env.SECRET || "secretkey12345", saveUninitialized: true, resave: false}));
// Flash messages middleware
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});



app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));


//setup express session
app.use(session({
  secret: "SomeSecret",
  saveUninitialized: false,
  resave: false
}));

//initialize flash
app.use(flash());

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//passport user config

//create a user model instance
let userModel = require('../models/user');
let User = userModel.User;

//implement user authentication strategy
passport.use(User.createStrategy());

//serialize and deserialize user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', indexRouter);
app.use('/survey-list', surveyRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {title: 'Error'});
});

module.exports = app;
