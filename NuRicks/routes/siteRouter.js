var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('homepage');
});

router.get('/about', function(req, res, next) {
  res.render('homepage');
});

router.get('/login', function(req, res, next) {
  res.render('homepage');
});

router.get('/contact', function(req, res, next) {
  res.render('contact');
});

module.exports = router;