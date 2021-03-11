const express = require('express')
const router = express.Router()
const { restrict, checkPassword } = require('auth')
const db = require('../database')
const parms = require('../parms')
const crypto = require("crypto")
const { ajax, ajaxSetup } = require('jquery')

var failed_count = 0
var key = ""

/* GET login listing. */
router.get('/', (req, res) => {
    res.render('login', { failed: parms.env.login_fail })
})
    .post('/', async (req, res) => {
        let userMail = req.body.email
        let password = req.body.pw

        if (!userMail && password) {
            return ""
        } else {
            await db.connect((err) => {
                if (err) throw err
                console.log('connected')
                var database = db.query(`select * from users where email = "${userMail}"`, (err, result) => {
                    if (err) throw err
                    if (result.length() != 0 && result[0].email == userMail && result[0].pw == password) {
                        parms.env.login_fail = false
                        parms.env.logined = true
                        failed_count = 0
                        parms.user.username = result[0].username
                        parms.user.living_area = result[0].living_area
                        parms.user.age = result[0].age
                        parms.user.ASD_lvl = result[0].ASD_lvl
                        parms.user.gender = result[0].gender
                        parms.user.img = result[0].img
                        parms.user.email = result[0].email
                        parms.user.details = result[0].details
                        
                        db.query(`select hobby from hobbies where userid = "${result[0].user_id}"`,(error, hobbies)=>{
                            if(error) throw error
                            hobbies.forEach(hobby => {
                                parms.user.hobbies.push(hobby)
                            });
                        })

                        db.query(`select activity from activities, user_activities where userid = "${result[0].user_id}"`,(error, activities)=>{
                            if(error) throw error
                            activities.forEach(activity => {
                                parms.user.activities.push(
                                    {
                                        "title": activity.title,
                                        "eventID": activity.eventID,
                                        "desc": activity.desc
                                    }
                                )
                            });
                        })

                        res.redirect('/')
                    } else {
                        ++failed_count
                        parms.env.login_fail = true
                        res.render('/login', { failed: true, failed_count: failed_count })
                    }
                })
            }).close()
        }
    })

router.get('/forget', (req, res) => {
    res.render('forget', { logined: parms.env.logined, emailNotFound: false })
})
    .post('/forget', async (res, req) => {
        let userMail = req.body.email

        if (!userMail) {
            router.render('forget', { emailNotFound: true })
        } else {
            await db.connect((err) => {
                if (err) throw err
                console.log('connected')

                let sql = "UPDATE users SET reset_pw = ? WHERE email = ?"
                let data = [crypto.randomBytes(20).toString('hex'), userMail]
                var database = db.query(sql, data, (err, result) => {
                    if (err) throw err
                    if (result.affectedRows == 1) {
                        router.redirect('/')
                    } else {
                        router.render('forget', { emailNotFound: true })
                    }
                })
            }).close()
        }
    })

router.get('/reset_pw', (req, res) => {
    key = req.query.key
    res.render('reset_pw', { logined: parms.env.logined, pass_same: false, wrong_mail: false })
})
    .post('/reset_pw', async (req, res) => {
        let email = req.body.email
        let pw = req.body.pw
        let re_pw = req.body.re_pw

        if (pw !== re_pw) {
            res.redirect('/reset_pw', { logined: parms.env.logined, pass_same: true, wrong_mail: false })
        } else {
            await db.connect((err) => {
                if (err) throw err
                console.log('connected')

                let sql = "UPDATE users SET pw = ? WHERE key = ?"
                let data = [pw, key]
                var database = db.query(sql, data, (err, result) => {
                    if (err) throw err
                    if (result.affectedRows == 1 && result[0].email == email) {
                        router.redirect('/login')
                    } else {
                        res.redirect('/reset_pw', { logined: parms.env.logined, pass_same: false, wrong_mail: true })
                    }
                })
            }).close()
        }
    })

module.exports = router
