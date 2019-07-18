var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//var apireRouter = require('./routes/apirouter');
//var service = require('./routes/services');
const user = require('./routes/api/apiusuarios');
const imagenes = require('./routes/api/imagenes');
const product = require('./routes/api/apiproduct');
//const mensajes = require('./routes/api/mensajes');
const citas = require('./routes/api/apicitas');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//app.use('/v1.0/api',apirouter);
//app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/user', user);
app.use('/api/imagenes', imagenes);
app.use('/api/product', product);
//app.use('/api/mensajes', mensajes);
app.use('/api/citas', citas);

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};


  res.status(err.status || 500);
  //res.render('error');
  res.json({
    error:res.message
  });
});
const port = 8000;
app.listen(port, () => {
console.log("running in " + port);
});

module.exports = app;
