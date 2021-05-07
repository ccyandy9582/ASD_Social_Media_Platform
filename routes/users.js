const express = require('express');
const router = express.Router();
const db = require('../database')

/* GET users listing. */
router.get('/', function (req, res, next) {
  db.query(`select * from users where user_id != ${req.session.user.user_id}`, (err, results) => {
    if (err) throw err
    req.session.users_list = results
    res.render('users', {logined: req.session.env.logined, my_list: req.session.users_list})
  })  
});

module.exports = router;
