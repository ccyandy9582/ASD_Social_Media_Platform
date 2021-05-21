var express = require('express')
const parms = require('../parms')
const db = require('../database')
var dateFormat = require('dateformat');
const { query } = require('express');
var router = express.Router()

/* GET activities listing. */
router.get('/', function (req, res) {
    console.log(req.session.touch());
    if (req.session.env.logined) {
        res.render('activities', { my_list: req.session.activities, logined: true})
    } else {
        res.render('activities', { my_list: req.session.activities, logined: false});
    }
});

// handle the detail activity page
router.get('/event/:eventID', function (req, res) {
    let activity_id = req.params.eventID;
    console.log("activity: "+activity_id);
    // get the information 
    db.query(`select * from activities where activity_id = ${activity_id}`, (err, result) => {
        if (err) throw err
        console.log(result.length);
        var values = {
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
        req.session.a = values
        // draw the map
        var src = `https://www.google.com/maps/embed/v1/place?key=${parms.api_key.google}&q=${req.session.a.place}`
        // find mutual friends who joined the same activity
        if (parms.env.logined) {
            // get the user joined the activity or not
            db.query(`select * from user_activities where user_id = ${req.user.user_id} and activity_id = ${req.a.activity_id}`, (err, result) => {
                if (err) throw err
                if (result.length > 0) {
                    req.session.joined = true
                }
                // get the joined mutual friends
                // find all the users who joined this activity first
                req.session.participants = []
                db.query(`select * from user_activities where activity_id = ${req.session.a.activity_id}`, (err, result) => {
                    if (err) throw err
                    result.forEach(participant => {
                        req.session.participants.push(participant.user_id)
                    });
                    // update the user friends list
                    db.query(`select * from user_friends where user_id = ${req.session.user.user_id}`, (err, result) => {
                        if (err) throw err
                        result.forEach(friend => {
                            req.sessionuser.friends.push(friend.friend_id)
                        });
                        // find the participant who is the friend and store it into the parms.a.friend
                        req.session.participants.forEach(participant => {
                            if (req.session.user.friends.includes(participant)) {
                                db.query(`select * from users where user_id = ${participant}`, (err, results) => {
                                    if (err) throw err
                                    results.forEach(result => {
                                        req.session.a.friend_list.push({
                                            "user_id": result.user_id,
                                            "img": result.img,
                                            "name": result.name,
                                        })
                                    })
                                    console.log("1");
                                    res.render(`detailed_activity`, { logined: req.session.env.logined, activity: req.session.a, friends: req.session.a.friend_list, src: src })
                                })
                            }
                        })
                        console.log('2');
                        res.render(`detailed_activity`, { logined: req.session.env.logined, activity: req.session.a, friends: req.session.a.friend_list, src: src })
                    })
                    console.log('3');
                    res.render(`detailed_activity`, { logined: req.session.env.logined, activity: req.session.a, friends: req.session.a.friend_list, src: src })
                })
                console.log('4');
                res.render(`detailed_activity`, { logined: req.session.env.logined, activity: req.session.a, friends: req.session.a.friend_list, src: src })
            })
        }
        console.log('5');
        res.render(`detailed_activity`, { logined: req.session.env.logined, activity: req.session.a, friends: req.session.a.friend_list, src: src })
    })
})
    .post('/', (res, req) => {
        // join the activity
        db.query(`INSERT INTO user_activities (user_id, activity_id) VALUES ('${req.session.user.user_id}', '${req.session.a.activity_id}')`, (err, result) => {
            if (err) throw err
            console.log("1 record inserted")
            res.redirect(`activities/event/${req.session.a.activity_id}`)
        })
    })
module.exports = router;
