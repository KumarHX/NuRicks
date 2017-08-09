var express = require('express')
var path = require('path');
var routes = require('./routes/siteRouter');
var musicians = require('./routes/musicians');
var auth = require('./routes/auth');
var users = require('./routes/users');
var transactions = require('./routes/transactions');
var events = require('./routes/events');
var tickets = require('./routes/tickets');
var admins = require('./routes/admins');
var passport = require('passport');
var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var cors = require('cors');
var app = express()


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(passport.initialize());
app.use(passport.session());
// Helmet defaults
app.use(helmet());
app.use(cors({
    origin: "https://www.nrtickets.com",
    credentials: true
}));

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

app.use('/api/musicians', musicians);
app.use('/api/events', events);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/tickets', tickets);
app.use('/api/admins', admins);
app.use('/api/transactions', transactions);

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

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


app.listen(process.env.PORT, function () {
  console.log('Example app listening on port ' + process.env.PORT)
})


module.exports = app;
