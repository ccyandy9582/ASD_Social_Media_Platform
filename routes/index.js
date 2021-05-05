var express = require('express')
var router = express.Router()
var parms = require('../parms')
const db = require('../database')
const distinct_bfs = require('../helper/distinct')


/* GET home page. And initial the parms.js */
router.get('/', function (req, res, next) {
    // To get the hobbies list
    db.query(`select * from hobbies`, (err, result) => {
        if (err) throw err
        result.forEach(hobby => {
            parms.hobbies.push({
                "title": hobby.hobby,
                "img": hobby.img
            })
        })
    })
    // To get the activities list, it will be sorted by distance if the user logined
    db.query(`select * from activities order by organise_date desc`, (err, result) => {
        if (err) throw err;
        parms.activities = []
        result.forEach(activity => {
            parms.activities.push({ "activity_id": activity.activity_id,"title": activity.activity_name, "desc": activity.description, "guest": activity.guest, "max_guest": activity.max_guest, "place": activity.place, "organise": activity.organise, "start_time": activity.start_time, "end_time": activity.end_time, "place_distinct":activity.place_distinct, "img":activity.img })
        })
    })
    if (parms.env.logined) {
        parms.activities = sorting(parms.activities, distinct_bfs(parms.user.living_area))
        // To get the recommended friend list that according to the mutual hobbies
        var friend_list = []
        db.query(`select * from users, hobbies where hobbies.user_id = users.user_id`, (err, result) => {
            if (err) throw err
            result.forEach
        })
    }
    console.log(parms.activities);
    res.render('index', { activities: parms.activities, logined: parms.env.logined, friends: friend_list, articles: parms.articles })
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
    res.redirect('/')
})

function sorting(list, order) {
    let sorted = []
    order.forEach(ele => {
        console.log('a');
        list.forEach(item => {
            console.log(item.place_distinct == ele && !sorted.includes(item));
            if (item.place_distinct == ele && !sorted.includes(item)) {
                sorted.push(item)
            }
        })
    });
    return sorted
}

module.exports = router