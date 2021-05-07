var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
var bodyParser = require('body-parser');
var http = require('http')
var helmet = require('helmet');
var rateLimit = require("express-rate-limit");


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var signupRouter = require('./routes/signup');
var loginRouter = require('./routes/login');
var activitiesRouter = require('./routes/activities');
var myinfoRouter = require('./routes/myinfo');
var testRouter = require('./routes/test')

var app = express();
// let session become global
var appendLocalsToUseInViews = function(req, res, next)
{            
    //append request and session to use directly in views and avoid passing around needless stuff
    res.locals.session = req.session;
    next(null, req, res);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(appendLocalsToUseInViews)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: "84JFAdame8A5mS", resave: true, saveUninitialized: true,}))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/activities', activitiesRouter);
app.use('/myinfo', myinfoRouter);
app.use('/test', testRouter)

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
  res.render('error');
});

module.exports = app;
