var express = require('express')
var router = express.Router()
var parms = require('../parms')

/* GET personal information listing. */
router.get('/', function (req, res, next) {
    if (!parms.env.logined) {
        res.redirect('/login', { logined: false })
    } else {
        res.render('myinfo', { logined: parms.env.logined })
    }
})
router.get('/details', function (req, res, next) {
    if (!parms.env.logined) {
        res.redirect('/')
    } else {
        res.render('detail_information', { information: parms.user, interest_list: parms.hobbies })
    }
})

module.exports = router