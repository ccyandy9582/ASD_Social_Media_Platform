var express = require('express')
var router = express.Router()
var parms = require('../parms')
const db = require('../database')
const distinct_bfs = require('../helper/distinct')

/* GET home page. */
router.get('/', function (req, res, next) {
    let friends = []
    // if not logined
    if (!parms.env.logined) {
        var temp = db.query(`select * from activities order by organise_date desc`, (err, result) => {
            if (err) throw err;
            result.forEach(activity => {
                parms.activities.push({ "title": activity.activity_name, "desc": activity.description, "guest": activity.guest, "max_guest": activity.max_guest, "place": activity.place, "organise": activity.organise, "start_time": activity.start_time, "end_time": activity.end_time })
            })
        })
    } else {
        distinct_bfs(parms.user.living_area).forEach(conjoint => {
            var temp = db.query(`select * from activities where place_distinct = "${conjoint}" and organise_date >= ${new Date()}`, (err, result) => {
                if (err) throw err
                parms.activities.push({ "title": result.activity_name, "desc": result.description, "guest": result.guest, "max_guest": result.max_guest, "place": result.place, "organise": result.organise, "start_time": result.start_time, "end_time": result.end_time })
            })
            // select the most common-hobbies users
        })
    }
    friends.push({"img": "http://www.newdesignfile.com/postpic/2009/03/person-icon_88181.png", "name": "test_002"}, {"img": "http://www.newdesignfile.com/postpic/2009/03/person-icon_88181.png", "name": "test_003"})
    res.render('index', { activities: parms.activities, logined: parms.env.logined, friends:friends })
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

module.exports = router
