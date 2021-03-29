var express = require('express')
const parms = require('../parms')
const db = require('../database')

var router = express.Router()

let activity_set = [
    {
        "title": "會濟報好大必者政下二",
        "eventID": "fdb61c16-4bba-11e4-9e35-164230d1df67",
        "desc": "容有那一氣持地來於結主了友如頭......院還地入。出乎機富事的著度同禮、時在科種力事再數總源式孩？",
        "url": '#'
    },
    {
        "title": "主覺問我的食什期和",
        "eventID": "0bc365ac-4bbb-11e4-9e35-164230d1df67",
        "desc": "生老了險實去供考權是車子氣長不別相且員高麼也工家看",
        "url": '#'
    },
    {
        "title": "是實裡在園時傳",
        "eventID": "0ff44786-4bbb-11e4-9e35-164230d1df67",
        "desc": "不半過何：為濟是在制們。裡得一方出，處師取是你賣而陽",
        "url": '#'
    }
]

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
    let eventID = req.params.eventID;
    let detail = {}
    let friend_list = {}

    db.query(`select * from activities where activity_id = ${eventID}`, (err, result) => {
        if (err)
            throw err
        detail = { "title": result[0].activity_name, "guest": result[0].guest, "max_guest": result[0].max_guest, "place": result[0].place, "organise_date": result[0].organise_date, "start_time": result[0].start_time, "end_time": result[0].end_time, "desc": result[0].description, "place_distinct": result[0].place_distinct, "eventID": eventID }
    })

    db.query(`select * from users, user_friends, activities where activity_id = ${eventID} and user_friends.user_id == user_friends.friend_id and users.user_id == user_friends.friend_id`, (err, result) => {
        if (err) throw err
        result.forEach(friend => {
            friend_list.push({"name":friend.user_name, "img": friend.img})
        });
    })

    res.render('detailed_activity', { activity: detail, friends: friend_list })
})

module.exports = router;
