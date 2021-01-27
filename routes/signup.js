var express = require('express');
var router = express.Router();

/* GET signup listing. */
router.get('/', function(req, res, next) {
    res.render('signup');
}).post;

module.exports = router;
