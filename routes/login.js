const express = require('express')
const router = express.Router()
const { restrict, checkPassword } = require('auth')
const db = require('../database')
const parms = require('../parms')
const crypto = require("crypto")
const { ajax, ajaxSetup } = require('jquery')

/* GET login listing. */
router.get('/', (req, res) => {
    console.log(req.session.touch());
    res.render('login', { failed: req.seesion.env.login_fail })
})
    .post('/', async (req, res) => {
        let userMail = req.body.email
        let password = req.body.pw

        if (!userMail && password) {
            return ""
        } else {
            db.query(`select * from users where email = "${userMail}"`, (err, result) => {
                if (err) throw err
                if (result.length != 0 && result[0].email == userMail && result[0].pw == password) {
                    let env = req.session.env
                    let user = req.session.user

                    env.login_fail = false
                    env.logined = true
                    env.failed_count = 0
                    user.username = result[0].user_name
                    user.living_area = result[0].living_distict
                    user.age = result[0].age
                    user.ASD_lvl = result[0].identify
                    user.gender = result[0].gender
                    user.img = result[0].img_url
                    user.email = result[0].email
                    user.details = result[0].details

                    db.query(`select hobby from user_hobbies where user_hobbies.user_id = ${result[0].user_id} order by hobby asc`, (error, hobbies) => {
                        if (error) throw error
                        hobbies.forEach(hobby => {
                            user.hobbies.push(hobby)
                        })
                        db.query(`SELECT users.user_id FROM users, user_friends WHERE user_friends.user_id = ${user.user_id} and users.user_id = user_friends.friend_id`, (err, results) => {
                            if (err) throw err
                            results.forEach(friend => {
                                user.friends.push({
                                    "user_id": friend.user_id,
                                    "name": friend.username,
                                    "gender": friend.gender,
                                    "img": friend.img_url,
                                    "living_distinct": friend.living_distict
                                })
                            })
                            req.session.env = env
                            res.session.user = user

                            res.redirect('/')
                        })
                        
                    })
                } else {
                    ++req.session.env.failed_count
                    req.session.env.login_fail = true
                    res.render('login', { failed: true, failed_count: req.session.env.failed_count })
                }
            })
        }
    })

router.get('/forget', (req, res) => {
    res.render('forget', { logined: req.session.env.logined, emailNotFound: false })
})
    .post('/forget', async (res, req) => {
        let userMail = req.body.email
        if (!userMail) {
            router.render('forget', { emailNotFound: true })
        } else {
            let sql = "UPDATE users SET reset_pw = ? WHERE email = ?"
            let data = [crypto.randomBytes(20).toString('hex'), userMail]
            db.query(sql, data, (err, result) => {
                if (err) throw err
                if (result.affectedRows == 1) {
                    router.redirect('/')
                } else {
                    router.render('forget', { emailNotFound: true })
                }
            })
        }
    })

router.get('/reset_pw', (req, res) => {
    res.render('reset_pw', { logined: req.session.env.logined, pass_same: false, wrong_mail: false })
})
    .post('/reset_pw', async (req, res) => {
        let email = req.body.email
        let pw = req.body.pw
        let re_pw = req.body.re_pw
        let key = req.query.key

        if (pw !== re_pw) {
            res.redirect('/reset_pw', { logined: req.session.env.logined, pass_same: true, wrong_mail: false })
        } else {
            let sql = "UPDATE users SET pw = ? WHERE key = ?"
            let data = [pw, key]
            db.query(sql, data, (err, result) => {
                if (err) throw err
                if (result.affectedRows == 1 && result[0].email == email) {
                    router.redirect('/login')
                } else {
                    res.redirect('/reset_pw', { logined: req.session.env.logined, pass_same: false, wrong_mail: true })
                }
            })
        }
    })

module.exports = router
