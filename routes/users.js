const express = require('express');
const { query } = require('../database');
const router = express.Router();
const db = require('../database')

/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log(req.session.touch);
  if (!req.session.user.user_id) {
    db.query(`select * from users`, (err, results) => {
      if (err) throw err
      req.session.users_list = results
      console.log(req.session.users_list)
      res.render('users', {logined: req.session.env.logined, my_list: req.session.users_list})
    })  
  }
});

// display the personal infromatio of the user
router.get('/detail_user/:user_id', (req, res) => {
  let user_id = req.params.user_id
  let user = {}
  db.query(`select * from users, user_hobbies where users.user_id = ${user_id} and users.user_id = user_hobbies.user_id`, (err, result) => {
    if (err) throw err
    user.user_name = result[0].user_name
    user.gender = result[0].gender
    user.living_distict = result[0].living_distict
    user.img_url = result[0].img_url
    user.hobbies = []
    result.forEach(r => {
      user.hobbies.push(r.hobby)
    });
    user.known = true
    if (req.session.env.logined) {
      db.query(`SELECT * FROM user_friends WHERE user_id = ${req.session.user.user_id} and friend_id = ${user_id} || user_id = ${user_id} and friend_id = ${req.session.user.user_id}`, (err, results) => {
        if (err) throw err
        if (results.affectedRows = 0) {
          user.known = false
        }
        console.log('1');
        res.render('detail_user', {logined: req.session.env.logined, user: user})
      })
    }
    console.log(user);
    res.render('detail_user', {logined: req.session.env.logined, user: user})
  })
})

module.exports = router;
