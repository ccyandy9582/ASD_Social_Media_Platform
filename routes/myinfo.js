const express = require('express')
const router = express.Router()
const parms = require('../parms')
const db = require('../database')

/* GET personal information listing. */
router.get('/', function (req, res, next) {
    if (!req.session.env.logined) {
        res.redirect('/login', { logined: false })
    } else {
        res.render('myinfo', { logined: req.session.env.logined, hobbies: req.session.user.hobbies })
    }
})
router.get('/details', function (req, res, next) {
    if (!req.session.env.logined) {
        res.redirect('/')
    } else {
        let hobbies = []
        db.query(`select * from hobbies`, (err, results) => {
            if (err) throw err
            results.forEach(hobby => {
                hobbies.push({"hobby": hobby.hobby, "img": hobby.img})
            });
        })
        req.session.hobbies = hobbies
        res.render('detail_information', { information: req.session.user, interest_list: req.session.hobbies })
    }
})

module.exports = router