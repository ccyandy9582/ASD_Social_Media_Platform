const express = require('express')
const router = express.Router()
const db = require('../database')
const parms = require('../parms')
const crypto = require("crypto")
const request = require('request')
const Environment = require('../model/Environment')
const User = require('../model/User')

/* GET login listing. */
router.get('/', (req, res) => {
    var env = new Environment(req.session.env).env
    console.log(env);
    var failed = env.login_fail
    var logined = env.logined
    if (!logined)
        res.render('login', { logined, failed })
})
    .post('/', async (req, res) => {
        var userMail = req.body.email
        var password = req.body.pw
        var user = new User(req.session.user).user
        var env = new Environment(req.session.env).env

        if (!userMail && password) {
            return ""
        } else {
            var loginOptions = {
                uri: "http://localhost:3000/api/login",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    "email": userMail,
                    "password": password
                },
                json: true
            }
            request(loginOptions, (err, response) => {
                console.log(response.statusCode);
                if (err) throw err
                if (response.statusCode == 200) {

                    env.login_fail = false
                    env.logined = true
                    env.failed_count = 0

                    user.user_id = response.body[0].user_id
                    user.username = response.body[0].user_name
                    user.living_area = response.body[0].living_distict
                    user.age = response.body[0].age
                    user.ASD_lvl = response.body[0].identify
                    user.gender = response.body[0].gender
                    user.img = response.body[0].img_url
                    user.email = response.body[0].email
                    user.details = response.body[0].details
                    user.identify = response.body[0].identify

                    request.get(`http://localhost:3000/api/hobbies/${user.user_id}`, (err, resp) => {
                        if (err) throw err
                        if (resp.statusCode == 200 && resp.length > 0) {
                            resp.forEach(hobby => {
                                user.hobbies.push(hobby)
                            })
                        }
                        request.get(`http://localhost:3000/api/friend/${user.user_id}`, (err, respon) => {
                            if (err) throw err
                            if (respon.statusCode == 200 && respon.length > 0) {
                                respon.forEach(friend => (
                                    {"user_id": friend.user_id,
                                    "name": friend.username,
                                    "gender": friend.gender,
                                    "img": friend.img_url,
                                    "living_distinct": friend.living_distict}
                                ))
                            }
                            req.session.env = env
                            req.session.user = user
                            
                            console.log("session env");
                            console.log(req.session.env);
                            console.log("session user");
                            console.log(req.session.user);

                            res.redirect('/')
                        })
                    })
                } else {
                    var failed = true
                    var failed_count = ++req.session.env.failed_count
                    req.session.env.login_fail = true
                    res.render('login', { failed, failed_count })
                }
            })
        }
    })

router.get('/forget', (req, res) => {
    const env = new Environment(req.session.env)
    var emailNotFound = false
    var logined = env.logined
    res.render('forget', { logined, emailNotFound })
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
