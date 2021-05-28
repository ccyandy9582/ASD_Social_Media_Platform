const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const db = require('../database')

router.get('/', (req, res) => {
    res.send("hi")
})

// found user by id
router.get('/user/find/id/:id', (req, res) => {
    var id = req.params.id
    db.query(`select * from users where user_id = "${id}"`, (err, result) => {
        if (err) return res.status(500).send(err.message)
        res.status(200).send(result)
    })
})

// found user by email
router.get('/user/find/:email', (req, res) => {
    var email = req.params.email
    db.query(`select * from users where email = "${email}"`, (err, result) => {
        if (err) return res.status(500).send(err.message)
        res.status(200).send(result)
    })
})

// is the user joined the activity?
router.post('/user/activities', (req, res) => {
    var user_id = req.body.user_id
    var activity_id = req.body.activity_id
    db.query(`select * from user_activities where user_id = ${user_id} and activity_id = ${activity_id}`, (err, result) => {
        if (err) return res.status(500).send(err.message)
        if (result.length == 1) return res.status(200).send(result)
        res.status(400).send(result)
    })
})

// get activities which the user joined
router.get('/user/activities/:user_id', (req, res) => {
    var user_id = req.params.user_id
    db.query(`select activities.activity_id, activity_name, place, description, img, createBy from user_activities, activities where user_id = ${user_id} and user_activities.activity_id = activities.activity_id`, (err, results) => {
        if (err) return res.status(500).send(err.message)
        res.status(200).send(results)
    })
})

// get the user friends list
router.get('/user/friend/:user_id', (req, res) => {
    var user_id = req.params.user_id
    db.query(`select users.user_id, user_name, gender, img_url, identify, living_distict, age from users, user_friends where user_friends.user_id = ${user_id} and user_friends.friend_id = users.user_id`, (err, results) => {
        if (err) return res.status(500).send(err.message)
        res.status(200).send(results)
    })
})

// meet friend
router.post('/user/meet', (req, res) => {
    var friend_id = req.body.friend_id
    var user_id = req.body.user_id
    db.query(`insert into user_friends(user_id, friend_id) values(${user_id}, ${friend_id}), (${friend_id}, ${user_id})`, (err, result) => {
        if (err) return res.status(500).send(err.message)
        res.status(200).send(result)
    })
})

// is friend between users
router.post('/user/friend', (req, res) => {
    var id = req.body.user_id
    var friend = req.body.friend_id
    db.query(`select * from user_friends where user_id = ${id} and friend_id = ${friend}`, (err, result) => {
        console.log("results");
        console.log(result);
        if (err) return res.status(500).send(err.message)
        if (result.length == 0) return res.status(400).send(result)
        return res.status(200).send(result)
    })
})

// update user and hobbies
router.post('/user/update', (req, res) => {
    var user = req.body
    var hobbies = user.hobbies
    db.query(`update users set age = ${user.age}, identify = "${user.identify}", gender = "${user.gender}", living_distict = "${user.living_distict}", details = 1 where user_id = ${user.user_id}`, (err, result) => {
        if (err) return res.status(500).send(err.message)
        var query = ""
        hobbies.forEach(hobby => {
            query += `insert into user_hobbies values (${user.user_id}, "${hobby}"); `
        })
        db.query(query, (err, results) => {
            if (err) return res.status(500).send(err.message)
            res.status(200).send(results)
        })
    })
})

// get the user list without the user
router.get('/user/:email', (req, res) => {
    var email = req.params.email
    var condition = ""
    if (email != "null")
        condition = `where email != "${email}"`
    db.query(`select * from users ${condition}`, (err, result) => {
        if (err) return res.status(500).send(err.message)
        res.status(200).send(result)
    })
})

// register by username, email, and password
router.post('/register', async (req, res) => {
    try {
        const user = {username: req.body.username, email: req.body.email, password: req.body.password}
        const salt = await bcrypt.genSalt()
        user.password = await bcrypt.hash(user.password, salt)

        db.query(`INSERT INTO users(user_name, pw, email) VALUES("${user.username}", "${user.password}", "${user.email}")`, (err, results) => {
            if (err) return res.status(500).send(err.message)
            res.status(201).send('Success')
        })
    } catch (err) {
        res.status(500).send(err.message)
    }
})

// login authenciation
router.post('/login', async (req, res) => {
    var user = {email: req.body.email, password: req.body.password}
    db.query(`select * from users where email = "${user.email}"`, async (err, results) => {
        if (err) return res.status(500).send(err.message)
        if (results.length == 0) {
            return res.status(400).send("cannot find user")
        }
        try {
            if (await bcrypt.compare(user.password, results[0].pw)) {
                res.status(200).send(results)
            } else {
                res.send("Fail to login")
            }
        } catch (error) {
            res.status(500).send(error)
        }
    })
})

// get all the hobbies
router.get('/hobbies', (req, res) => {
    db.query(`select * from hobbies`, (err, results) => {
        if (err) return res.status(500).send(err.message)
        if (results.length == 0)
            return res.status(400).send("cannot find any hobby")
        res.status(200).send(results)
    })
})

// get all the hobbies by user_id
router.get('/hobbies/:userID', (req, res) => {
    var userID = req.params.userID
    db.query(`select hobby from user_hobbies where user_hobbies.user_id = ${userID} order by hobby asc`, (err, results) => {
        if (err) return res.status(500).send(err.message)
        res.status(200).send(results)
    })
})

// get all the mutual friends
// return user
router.get('/friend/:userID', (req, res) => {
    var userID = req.params.userID
    db.query(`SELECT users.user_id, users.user_name, users.gender, users.img_url, users.living_distict FROM users, user_friends WHERE user_friends.user_id = ${userID} and users.user_id = user_friends.friend_id`, (err, results) => {
        if (err) return res.status(500).send(err.message)
        if (results.length == 0)
            return res.status(200).send({"messgae": "cannot find any friends"})
        res.status(200).send(results)
    })
})

// get all activity
router.get('/activities', (req, res)=>{
    db.query(`select * from activities order by organise_date DESC`, (err, results) => {
        if (err) return res.status(500).send(err.message)
        res.status(200).send(results)
    })
})

//create activity
router.post('/activity/create', (req, res) => {
    var activity = {
        "activity_name": req.body.activity_name,
        "description": req.body.description,
        "max_guest": req.body.max_guest,
        "place": req.body.place,
        "place_distinct": req.body.place_distinct,
        "organise_date": req.body.organise_date,
        "start_time": req.body.start_time,
        "end_time": req.body.end_time,
        "img": req.body.img,
        "createBy": req.body.user_id
    }

    db.query(`insert into activities(activity_name, description, max_guest, place, place_distinct, organise_date, start_time, end_time, img, createBy) values("${activity.activity_name}", "${activity.description}", ${activity.max_guest}, "${activity.place}", "${activity.place_distinct}", "${activity.organise_date}", "${activity.start_time}", "${activity.end_time}", "${activity.img}", ${activity.createBy})`, (err, result) => {
        if (err) return res.status(500).send(err.message)
        res.status(200).send(result)
    })
})

// join activity
router.post('/activity/join', (req, res) => {
    var user_id = req.body.user_id
    var activity_id = req.body.activity_id
    db.query(`insert into user_activities(user_id, activity_id) values(${user_id}, ${activity_id})`, (err, result) => {
        if (err) return res.status(500).send(err.message)
        db.query(`update activities set guest = guest+1 where activity_id = ${activity_id}`, (err, resp) => {
            if (err) return res.status(500).send(err.message)
            res.status(200).send(result)
        })
    })
})

// get the activity
// return activity
router.get('/activity/:id', (req, res) => {
    var id = req.params.id
    db.query(`select * from activities where activity_id = ${id}`, (err, result) => {
        if (err) throw err
        res.status(200).send(result)
    })
})

// get the mutual friends who join the same activities
// retuen user
router.post('/activity/mutual', (req, res) => {
    var user_id = req.body.user_id
    var activity_id = req.body.activity_id
    db.query(`SELECT users.user_name, users.user_id, users.gender, users.email, users.living_distict, users.age, users.identify, users.img_url FROM user_friends, user_activities, users WHERE user_friends.user_id = ${user_id} AND user_activities.user_id = user_friends.friend_id AND user_activities.activity_id = ${activity_id} AND users.user_id = user_friends.friend_id`, (err, result) => {
        if (err) return res.status(500).send(err.message)
        res.status(200).send(result)
    })
})
module.exports = router