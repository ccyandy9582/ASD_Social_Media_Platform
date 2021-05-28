const express = require('express')
const router = express.Router()
const db = require('../database')
const request = require('request')
const Environment = require('../model/Environment')
const { check, validationResult } = require('express-validator')
const User = require('../model/User')

/* GET users listing. */
router.get('/', (req, res) => {
  var logined = req.session.env.logined
  var user = req.session.user
  var my_list

  request.get(`http://localhost:3000/api/user/${user.email}`, (err, resp) => {
    if (err) throw err
    if (resp.statusCode == 200) {
      my_list = JSON.parse(resp.body)
    }
    res.render('users', {logined, my_list})
  })
});

// display the personal infromatio of the user
router.get('/detail_user/:user_id', (req, res) => {
  var user_id = req.params.user_id
  var env = new Environment(req.session.env).env
  var user = {}
  var logined = env.logined

  request.get(`http://localhost:3000/api/user/find/id/${user_id}`, (err, resp) => {
    if (err) throw err
    if (resp.statusCode == 200) {
      user.user_name = JSON.parse(resp.body)[0].user_name
      user.gender = JSON.parse(resp.body)[0].gender
      user.img_url = JSON.parse(resp.body)[0].img_url
      user.living_distict = JSON.parse(resp.body)[0].living_distict
      user.user_id = JSON.parse(resp.body)[0].user_id
      user.hobbies = []
      request.get(`http://localhost:3000/api/hobbies/${user_id}`, (err, result) => {
        if (err) throw err
        if (result.statusCode == 200) {
          console.log(user);
          JSON.parse(result.body).forEach(hobby => {
            user.hobbies.push(hobby.hobby)
          })
        }
        if (logined) {
          var friendOption = {
            uri: "http://localhost:3000/api/user/friend",
            method: "POST",
            json: true,
            headers: {
              "Content-Type": "application/json"
            },
            body: {
              "user_id": req.session.user.user_id,
              "friend_id": user_id
            },
          }
          console.log(friendOption);
          request(friendOption, (err, response) => {
            if (err) throw err
            user.known = false
            console.log(response.statusCode);
            if (response.statusCode == 200) user.known = true
            return res.render('detail_user', {logined, user})
          })
          return false
        }
        return res.render('detail_user', {logined, user})
      })
    }
  })
})
  .get('/meet/:id', (req, res) => {
  var friend_id = req.params.id
  var user = new User(req.session.user).user
  var user_id = user.user_id
  

  var meetOption = {
    uri: "http://localhost:3000/api/user/meet",
    method: "POST",
    json: true,
    body: {
      "user_id": user_id,
      "friend_id": friend_id
    },
    headers: {
      "Content-Type": "application/json"
    }
  }
  request(meetOption, (err, response) => {
    if (err) throw err
    if (response.statusCode == 200)
      res.redirect("/")
  })
})
module.exports = router;
