var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose=require('mongoose');
var session=require('express-session');
var MongoStore = require('connect-mongo');
var flash=require('connect-flash');
var authUser=require('./middlewares/authUser');
var authAdmin=require('./middlewares/authAdmin');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter=require('./routes/admin');

var app = express();
mongoose.connect('mongodb://localhost/Ecommerce',(err)=>{
  console.log(err?err:'Connected to Database');
})



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//add session and persit user in session
app.use(session({
  secret:"somerandomsecret",
  resave:false,
  saveUninitialized:false,
  store:  MongoStore.create({mongoUrl:'mongodb://localhost/users'})
}))

//flash middleware
app.use(flash());

app.use(authUser.userInfo);
app.use(authAdmin.adminInfo);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin',adminRouter);

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