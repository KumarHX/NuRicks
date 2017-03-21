var express = require('express')
var path = require('path');
var routes = require('./routes/siteRouter');
var musicians = require('./routes/musicians');
var passport = require('passport');
var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express()


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8001");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.json());
app.use(cookieParser());
// Main Cookie handler
var cookieExpiryDate = new Date(Date.now() + (24 * 60 * 60 * 1000)); // 24 hours
app.use(cookieSession({
    name: "jwt",
    keys: ["changethisinproduction"],
    cookie: {
        httpOnly: true,
        expires: cookieExpiryDate
    }
}));

app.use('/', routes);
app.use('/api/musicians', musicians);





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})


module.exports = app;
