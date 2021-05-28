const express = require('express')
const router = express.Router()
const parms = require('../parms')
const db = require('../database')
const User = require('../model/User')
const Environment = require('../model/Environment')
const { check, validationResult } = require('express-validator')
const request = require('request')

/* GET personal information listing. */
router.get('/', function (req, res, next) {
    var user = new User(req.session.user).user
    var env = new Environment(req.session.env).env
    var logined = env.logined
    if (!logined) {
        res.redirect('/login', { logined: false })
    } else if (!user.details) {
        res.redirect('/myinfo/details')
    } else {
        request.get(`http://localhost:3000/api/user/find/id/${user.user_id}`, (err, result) => {
            if (err) throw err
            if (result.statusCode == 200) {
                var temp_user = JSON.parse(result.body)[0]
                user.user_name = temp_user.user_name,
                user.email = temp_user.email,
                user.identify = temp_user.identify,
                user.hobbies = []
                request.get(`http://localhost:3000/api/hobbies/${user.user_id}`, (err, response) => {
                    if (err) throw err
                    if (response.statusCode == 200 && JSON.parse(response.body).length>0) {
                        JSON.parse(response.body).forEach( hobby => {
                            user.hobbies.push(hobby)
                        })
                    }
                    user.activities = []
                    request.get(`http://localhost:3000/api/user/activities/${user.user_id}`, (err, resp) => {
                        if (err) throw err
                        if (resp.statusCode == 200 && JSON.parse(resp.body).length>0) {
                            JSON.parse(resp.body).forEach(activity => {
                                user.activities.push(activity)
                            })
                        }
                        user.friends = []
                        request.get(`http://localhost:3000/api/user/friend/${user.user_id}`, (err, results) => {
                            if (err) throw err
                            if (results.statusCode == 200 & JSON.parse(results.body).length>0) {
                                JSON.parse(results.body).forEach(friend => {
                                    user.friends.push(friend)
                                })
                            }
                            res.render('myinfo', { logined, user })
                        })
                    })
                })
            }
        })
    }
})
router.get('/details', function (req, res, next) {
    if (!req.session.env.logined) {
        res.redirect('/')
    } else {
        var env = new Environment(req.session.env).env
        console.log(env);
        let hobbies = []
        db.query(`select * from hobbies`, (err, results) => {
            if (err) throw err
            results.forEach(hobby => {
                hobbies.push({"hobby": hobby.hobby, "img": hobby.img})
            });
            req.session.hobbies = hobbies
        res.render('detail_information', { information: req.session.user, interest_list: req.session.hobbies })
        })
    }
})
    .post('/details', [
        check('gender', "請選擇你的性別").exists().isLength({min:1, max:1}),
        check('idenify', "請選擇你的身份").exists().isLength({min:1}),
        check('age', "請提供你的年紀").exists().isNumeric().isLength({min:1}),
        check('living_area', "請提供你的居住地").exists().isLength({min:1})
    ], (req, res) => {
        var user = new User(req.session.user).user
        var body = req.body
        user.gender = body.gender
        user.identify = body.identify
        user.age = body.age
        user.living_distict = body.living_area
        body.hobbies.forEach(hobby => {
            user.hobbies.push(hobby)
        })
        var message = validationResult(req).array()
        if (message.length > 0)
            res.render('create_activity', {message})
        else {
            var updateOption = {
                uri: "http://localhsot:3000/api/user/update",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: {
                    "user": user
                },
                json: true
            }
            request(updateOption, (err, response) => {
                if (err) throw err
                if (response.statusCode == 200) {
                    res.redirect('/')
                } else {
                    message.push({msg: "更新失敗，請稍後再試"})
                    res.render('detail_information', {message})
                }
            })
        }
    })

module.exports = router