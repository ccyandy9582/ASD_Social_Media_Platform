var express = require('express');
var router = express.Router();

/* GET activities listing. */
router.get('/', function(req, res, next) {
    // res.render('activities');
    res.render('activities');
});

router.get('/event/:eventID', function (req, res, next) {
    var eventID = req.params.eventID;

})

module.exports = router;
