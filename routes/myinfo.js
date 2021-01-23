var express = require('express');
var router = express.Router();

/* GET personal information listing. */
router.get('/', function(req, res, next) {
    // res.render('myinfo');
    res.send('myinfo');
});

module.exports = router;
