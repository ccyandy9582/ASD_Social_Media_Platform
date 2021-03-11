var express = require('express')
var router = express.Router()
var parms = require('../parms')



/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { my_list: parms.activities, logined: parms.env.logined })
})

router.get('/signout', (req, res) => {
    parms.env.logined = false
    parms.user.user_id = null
    parms.user.username = null
    parms.user.living_area = null
    parms.user.age = null
    parms.user.ASD_lvl = null
    parms.user.gender = null
    parms.user.img = null
    parms.user.email = null
    parms.user.details = null
    parms.user.hobbies = []
    parms.user.activities = []
    res.redirect('/')
})

module.exports = router
