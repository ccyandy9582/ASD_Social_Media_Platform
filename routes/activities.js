const express = require('express')
const parms = require('../parms')
const db = require('../database')
const dateFormat = require('dateformat');
const router = express.Router()
const Environment = require('../model/Environment')
const request = require('request')
const { check, validationResult } = require('express-validator');
const User = require('../model/User');

// GET activities listing.
router.get('/', (req, res) => {
    var my_list = req.session.activities
    var env = new Environment(req.session.env).env
    var user = new User(req.session.user).user
    var identify = user.identify

    var logined = env.logined
    res.render('activities', { my_list, logined, identify})
});

// create activity
router.get('/create', (req, res) => {
    res.render('create_activity')
})
    .post('/create', [
        check('title', "請輸入活動標題").exists().isString().isLength({min:1}),
        check('desc', "請輸入活動詳情").exists().isString().isLength({min:1}),
        check('place_distinct', "請輸入活動舉行地區").exists().isString().isLength({min:1}),
        check('place', "請輸入活動舉行地址").exists().isString().isLength({min:1}),
        check('max_guest', "請輸入接待人數").exists().isNumeric(),
        check('organise_date', "請輸入舉行日期").exists().isDate(),
        check('start_time', "請輸入活動開始時間").exists().isLength({min:1}),
        check('end_time', "請輸入活動結束時間").exists().isLength({min:1}),
        check('img', "請提供活動封面").exists().isURL()
    ], (req, res) => {
        var message = validationResult(req).array()
        if (message.length > 0)
            return res.render('create_activity', {message})
        else {
            console.log(req.body.title);
            var user = new User(req.session.user).user
            var newActivityOption = {
                uri: "http://localhost:3000/api/activity/create",
                method: "POST",
                json: true,
                body: {
                    "activity_name": req.body.title,
                    "description": req.body.desc,
                    "max_guest": req.body.max_guest,
                    "place": req.body.place,
                    "place_distinct": req.body.place_distinct,
                    "organise_date": req.body.organise_date,
                    "start_time": req.body.start_time,
                    "end_time": req.body.end_time,
                    "img": req.body.img,
                    "user_id": user.user_id || 10006
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }
            request(newActivityOption, (err, response) => {
                if (err) throw err
                if (response.statusCode == 200) {
                    return res.redirect('/activities')
                }
                return res.redirect('/activities')
            })
            return res.render('create_activity') 
        }
    })

// handle the detail activity page
router.get('/event/:eventID', (req, res) => {
    var user = new User(req.session.user).user
    var env = new Environment(req.session.env).env
    var logined = env.logined
    var activity_id = req.params.eventID
    // var activity = new Activity().activity
    // get the information 
    db.query(`select * from activities where activity_id = ${activity_id}`, (err, result) => {
        if (err) throw err
        var activity = {
                "title": result[0].activity_name,
                "guest": result[0].guest,
                "max_guest": result[0].max_guest,
                "place": result[0].place,
                "organise_date": dateFormat(result[0].organise_date, 'yyyy-mm-dd'),
                "start_time": result[0].start_time,
                "end_time": result[0].end_time,
                "desc": result[0].description,
                "place_distinct": result[0].place_distinct,
                "activity_id": result[0].activity_id,
                "joined": false,
                "friend_list": []
            }

        // draw the map
        var src = `https://www.google.com/maps/embed/v1/place?key=${parms.api_key.google}&q=${activity.place}`

        if (env.logined) {
            // find mutual friends who joined the same activity
            var user_id = user.user_id
            var mutualOption = {
                uri: "http://localhost:3000/api/activity/mutual",
                method: "POST",
                json: true,
                headers: {
                    "Content-Type": "application/json"
                },
                body: {
                    "user_id": user_id,
                    "activity_id": activity_id
                }
            }

            request(mutualOption, (err, response) => {
                if (err) throw err
                if (response.statusCode == 200) {
                    response.body.forEach(friend => {
                        activity.friend_list.push(friend)
                    })
                }
                var joinedOption = {
                    uri: "http://localhost:3000/api/user/activities",
                    method: "POST",
                    json: true,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: {
                        "user_id": user_id,
                        "activity_id": activity_id
                    }
                }
                request(joinedOption, (err, resp) => {
                    if (err) throw err
                    if (resp.statusCode == 200) activity.joined = true
                    console.log(activity);
                    res.render(`detailed_activity`, { logined, activity, src})
                })
            })
        } else {
            res.render(`detailed_activity`, { logined, activity, src})
        }
    })
})
    .get('/event/join/:activity_id', (req, res) => {
        var activity_id = req.params.activity_id
        var user_id = req.session.user.user_id

        var joinOption = {
            uri: "http://localhost:3000/api/activity/join",
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                "user_id": user_id,
                "activity_id": activity_id
            }
        }
        request(joinOption, (err, response) => {
            if (err) throw err
            if (response.statusCode == 200) {
                res.redirect(`/activities/event/${activity_id}`)
            }
        })

        // join the activity
        // db.query(`INSERT INTO user_activities (user_id, activity_id) VALUES ('${req.session.user.user_id}', '${req.session.a.activity_id}')`, (err, result) => {
        //     if (err) throw err
        //     console.log("1 record inserted")
        //     res.redirect(`activities/event/${req.session.a.activity_id}`)
        // })
    })

module.exports = router;