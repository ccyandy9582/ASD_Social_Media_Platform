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

    await db.connect((err) => {
        if (err) throw err
        console.log('connected')
        var email = db.query(`select * from users where email = "${userMail}"`, (err, result) => {
            if (err) throw err
            if (result.length() != 0 ) {
                message.push("電郵已經註冊")
            }
        })
        var username = db.query(`select * from users where email = "${userMail}"`, (err, result) => {
            if (err) throw err
            if (result.length() != 0 ) {
                message.push("用戶名稱已經註冊")
            }
        })
    }).close()
    if (password != firmpw) {
        message.push("密碼與確認密碼不一致")
    }
    
    if (message.length == 0) {
        message = []
        parms.user.username = username
        parms.user.email = userMail
        parms.user.details = false
        await db.connect((err)=>{
            if (err) throw err
            db.query(`INSERT INTO users(username, pw, email, details) VALUES("${parms.user.username}", "${password}", "${parms.user.email}", "${parms.user.details}")`)
        })
        res.render('/myinfo/details')
    } else {
        res.render('signup', {message: this.message});
        message = []
    }
});

module.exports = router;
