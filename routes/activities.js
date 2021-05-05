var express = require('express')
const parms = require('../parms')
const db = require('../database')
var dateFormat = require('dateformat');

var router = express.Router()

/* GET activities listing. */
router.get('/', function (req, res, next) {
    var logined = false
    try {
        logined = req.cookies['login'].toString() == 'true' ? true : false;
    } catch (e) {
        console.log(e.message)
    }
    res.render('activities', { my_list: parms.activities, logined: logined });
});

router.get('/event/:eventID', function (req, res, next) {
    let activity_id = req.params.eventID;
    let friend_list = {}
    let detail = {}

    db.query(`select * from activities where activity_id = ${activity_id}`, (err, result) => {
        if (err) throw err
        parms.a = { "title": result[0].activity_name, "guest": result[0].guest, "max_guest": result[0].max_guest, "place": result[0].place, "organise_date": result[0].organise_date, "start_time": result[0].start_time, "end_time": result[0].end_time, "desc": result[0].description, "place_distinct": result[0].place_distinct, "activity_id": activity_id }
    })

    // db.query(`select * from users, user_friends, activities where activity_id = ${activity_id} and user_friends.user_id == user_friends.friend_id and users.user_id == user_friends.friend_id`, (err, result) => {
    //     if (err) throw err
    //     result.forEach(friend => {
    //         friend_list.push({"name":friend.user_name, "img": friend.img})
    //     });
    // })

    parms.a.organise_date = dateFormat(parms.a.organise_date, "yyyy-mm-dd");

    var src = `https://www.google.com/maps/embed/v1/place?key=${parms.api_key.google}&q=${parms.a.place}`

    res.render('detailed_activity', { logined: parms.env.logined, activity: parms.a, friends: friend_list, src:src })
})
    .post('/', (res, req) => {
        // join the activity
    })

module.exports = router;
