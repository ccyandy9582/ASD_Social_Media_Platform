var express = require('express');
var router = express.Router();
var parms = require('../parms')

var info1 = {
    "username": "test_001",
    "email": "test_001@gmail.com"
}

var interest_list = ["食野","飲野","講野","唱歌"]

/* GET personal information listing. */
router.get('/', function(req, res, next) {
    // var logined = false
    // try {
    //     logined = req.cookies['login'].toString()=='true'?true:false;
    // } catch (e) {
    //     console.log(e.message)
    // }
    if (!parms.env.logined) {
        res.redirect('/login', {logined: false})
    } else {
        res.render('myinfo', {logined: parms.env.logined});
    }
});
router.get('/details', function(req, res, next) {
    if (!parms.env.logined) {
        res.redirect('/');
    } else {
        res.render('detail_information', {information: parms.user, interest_list:parms.hobbies});
    }
    
});

module.exports = router;
