const express = require('express')
const router = express.Router()
const parms = require('../parms')
const db = require('../database')
const distinct_bfs = require('../helper/distinct')
// const recommender = require('../helper/friend_recommender')
const { resolveInclude } = require('ejs')

/* GET home page. And initial the parms.js */
router.get('/', function (req, res, next) {
    if (!req.session.env) {
        req.session.env = { "logined": false, "login_fail": false, "failed_count": 0, }
    }
    if (!req.session.user) {
        req.session.user = {
            "user_id": null,
            "username": null,
            "living_area": null,
            "age": null,
            "ASD_lvl": null,
            "gender": null,
            "img": null,
            "email": null,
            "details": null,
            "hobbies": [],
            "activities": [],
            "friends": [],
            "recommendedList": [],
        }
    }
    if (!req.session.activities) req.session.activities = []
    if (!req.session.hobbies) req.session.hobbies = []
    if (!req.session.users_list) req.session.users_list = []

    // To get the hobbies list
    db.query(`select * from hobbies`, (err, result) => {
        if (err) throw err
        let hobbies = req.session.hobbies
        result.forEach(hobby => {
            hobbies.push({
                "title": hobby.hobby,
                "img": hobby.img
            })
        })
        req.session.hobbies = hobbies
        // To get the activities list, it will be sorted by distance if the user logined
        db.query(`select * from activities order by organise_date desc`, (err, result) => {
            if (err) throw err;
            let activities = []
            result.forEach(activity => {
                activities.push({ "activity_id": activity.activity_id, "title": activity.activity_name, "desc": activity.description, "guest": activity.guest, "max_guest": activity.max_guest, "place": activity.place, "organise": activity.organise, "start_time": activity.start_time, "end_time": activity.end_time, "place_distinct": activity.place_distinct, "img": activity.img })
            })
            req.session.activities = activities
            if (req.session.env.logined) {
                // let activities = req.cookies['activities']
                let activities = req.session.activities
                activities = sorting(activities, distinct_bfs(parms.user.living_area))
                // To get the recommended friend list that according to the mutual hobbies
                // let user = req.cookies['user']
                let user = req.session.user
                recommender(user.user_id, (err, recommendedList) => {
                    if (err) throw err
                    req.session.user = recommendedList
                    console.log(req.session.touch());
                    res.render('index', { activities: req.session.activities, logined: req.session.env.logined, friends: req.session.user.recommendedList, articles: parms.articles })
                })
            }
            console.log(req.session.touch());
            res.render('index', { activities: req.session.activities, logined: req.session.env.logined, friends: req.session.user.recommendedList, articles: parms.articles })
        })
    })
})

router.get('/signout', (req, res) => {
    req.session.destroy(err => {
        if (err) throw err
        res.redirect('/')
    })
})

function sorting(list, order) {
    let sorted = []
    order.forEach(ele => {
        list.forEach(item => {
            if (item.place_distinct == ele && !sorted.includes(item)) {
                sorted.push(item)
            }
        })
    });
    return sorted
}

function similar(s, t, f) {
    if (!s || !t) {
        return 0
    }
    var l = s.length > t.length ? s.length : t.length
    var n = s.length
    var m = t.length
    var d = []
    f = f || 3
    var min = function (a, b, c) {
        return a < b ? (a < c ? a : c) : (b < c ? b : c)
    }
    var i, j, si, tj, cost
    if (n === 0) return m
    if (m === 0) return n
    for (i = 0; i <= n; i++) {
        d[i] = []
        d[i][0] = i
    }
    for (j = 0; j <= m; j++) {
        d[0][j] = j
    }
    for (i = 1; i <= n; i++) {
        si = s.charAt(i - 1)
        for (j = 1; j <= m; j++) {
            tj = t.charAt(j - 1)
            if (si === tj) {
                cost = 0
            } else {
                cost = 1
            }
            d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
        }
    }
    let res = (1 - d[n][m] / l)
    return res.toFixed(f)
}

function recommender(id, callback) {
    db.query(`select * from user_hobbies where user_id != ${id} order by user_id, hobby`, (err, results) => {
        if (err) throw err
        let map1 = new Map()
        let map2 = new Map()
        let user_hobby = new String("")

        user.hobbies.forEach(hobby => {
            user_hobby += hobby
        });
        map1.set(user.user_id, user_hobby)
        results.forEach(result => {
            if (!map1.get(result.user_id)) {
                map1.set(result.user_id, result.hobby)
            } else {
                let str_hobby = map1.get(result.user_id) + result.hobby
                map1.set(result.user_id, str_hobby)
            }
        })
        var ary = Array.from(map1)
        for (let index = 1; index < ary.length; index++) {
            map2.set(ary[index][0], similar(ary[index][1], ary[0][1]))
        }
        var arr = Array.from(map2)
        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
                if (arr[j][1] < arr[j + 1][1]) {
                    var temp = arr[j]
                    arr[j] = arr[j + 1]
                    arr[j + 1] = temp
                }
            }
        }
        callback(arr)
    })
}

module.exports = router