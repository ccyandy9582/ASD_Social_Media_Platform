const { render } = require('ejs')
var express = require('express');
var router = express.Router();
const db = require('../database')
var parms = require('../parms')
var message = []

/* GET signup listing. */
router.get('/', function(req, res, next) {
    res.render('signup', {message: this.message});
})
.post('/', async (req, res)=>{
    let userMail = req.body.email
    let username = req.body.username
    let password = req.body.pw
    let firmpw = req.body.firmPW

    db.query(`select * from users where email = "${userMail}"`, (err, result) => {
        if (err) throw err
        if (result.length() != 0 ) {
            message.push("電郵已經註冊")
        }
        db.query(`select * from users where email = "${userMail}"`, (err, result) => {
            if (err) throw err
            if (result.length() != 0 ) {
                message.push("用戶名稱已經註冊")
            }
            if (password != firmpw) {
                message.push("密碼與確認密碼不一致")
            }
            if (message.length == 0) {
                message = []
                let user = {}
                user.username = username
                user.email = userMail
                user.details = false
        
                db.query(`INSERT INTO users(username, pw, email, details) VALUES("${user.username}", "${password}", "${user.email}", "${user.details}")`, (err, result) => {
                    if (err) throw err
                    if (result.length > 0) {
                        req.session.user.username = user.username
                        req.session.user.email = user.email
                        req.session.user.details = false
                        res.redirect('/myinfo/details')
                    }
                })
        
            } else {
                res.render('signup', {message: message});
                message = []
            }
        })
    })
});

module.exports = router;
