var express = require('express');
var router = express.Router();

var info1 = {
    "username": "test_001",
    "email": "test_001@gmail.com"
}

var interest_list = ["食野","飲野","講野","唱歌"]

/* GET personal information listing. */
router.get('/', function(req, res, next) {
    var logined = false
    try {
        logined = req.cookies['login'].toString()=='true'?true:false;
    } catch (e) {
        console.log(e.message)
    }
    if (!logined) {
        res.redirect('/login/myinfo')
    } else {
        res.render('myinfo',{logined: logined});
    }
});
router.get('/details', function(req, res, next) {
    res.render('detail_information', {information: info1, detailed: false, interest_list:interest_list});
});

module.exports = router;
