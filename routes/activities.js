var express = require('express');
var router = express.Router();

/* GET activities listing. */
router.get('/', function(req, res, next) {
    // res.render('activities');
    res.send('activities');
});

module.exports = router;
