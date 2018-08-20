var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('express-flash'); // for message

var indexRouter = require('./routes/index');
var members = require('./routes/members');
var admin = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// plugins in node modules
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/js', express.static(__dirname + '/node_modules/jquery-validation/dist'));

// session : before routing
app.use(session({
    secret: 'ExpressEJSBlank@@', // any string for Security
    resave: false,
    saveUninitialized: true
}));
app.use(flash()); // after cookie, session

// Set session for EJS // after session, befor routing
app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  next();
});

app.use('/', indexRouter);
// session check for members, admin...
app.use(function(req, res, next) {
    // TODO need to delete - for test : set session
    req.session.user = {
        uid: 3, name: 'Admin', email: 'help@atutu.com', role: 'ADMIN'
    };

    if(req.session.user){
        next();
    }else{
        req.flash('warning', 'Authorization failed! Please login');
        req.flash('forward', req.path);
        res.redirect('/signin'); // redirect to other page
    }
});
app.use('/members', members);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// client error for ajax
app.use(function(err, req, res, next) {
  if (req.xhr) {
    res.status(err.status || 500).send(err.message);
  } else {
    next(err);
  }
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('commons/error' + ( (err.status == 404)?'-404':'' ) );
});

module.exports = app;
