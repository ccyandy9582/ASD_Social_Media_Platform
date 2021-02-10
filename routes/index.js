var express = require('express')
var router = express.Router()
var parms = require('../parms')


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { my_list: parms.activities, logined: parms.env.logined })
})

router.get('/signout', (req, res) => {
    parms.env.logined = false
    res.redirect('/')
})

module.exports = router
