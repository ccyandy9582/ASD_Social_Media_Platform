const express = require('express')
const router = express.Router()
const db = require('../database')
const request = require('request')
const {check, validationResult} = require('express-validator')



/* GET signup listing. */
router.get('/', function(req, res, next) {
    res.render('signup', {message: this.message});
})
.post('/', [
    check('email', '你輸入的好像不是電郵地址哦～')
        .exists()
        .isEmail()
        .normalizeEmail(),
    check('username', '請提供一個用户名稱')
        .exists(),
], async (req, res)=>{
    var userMail = req.body.email.trim()
    var username = req.body.username.trim()
    var password = req.body.pw.trim()
    var firmpw = req.body.firmPW.trim()
    var user = req.session.user
    var message = validationResult(req).array()

    if (password.length <8)
        message.push({msg: "請提供一個最少8位長度的密碼，用以更好的保護你的帳號～"})

    if (firmpw != password) {
        message.push({msg: "你的密碼並不相同，請重新輸入"})
    }

    request.get(`http://localhost:3000/api/user/find/${userMail}`, (err, result) => {
        if (err) throw err
        if (result.statusCode == 200 && JSON.parse(result.body).length != 0) 
            message.push({msg: "你所提供的電郵地址已經註冊"})
        if (message.length > 0)
            res.render('signup', {message})
        else {
            var registerOption = {
                uri: "http://localhost:3000/api/register",
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                json: true,
                body: {
                    "email": userMail,
                    "password": password,
                    "username": username
                }
            }
            request(registerOption, (err, response) => {
                if (err) throw err
                if (response.statusCode == 200) {
                    console.log(response.body);

                    user.username = username
                    user.email = userMail
                    user.details = false

                    req.session.user = user

                    res.redirect('/myinfo/details')
                } else {
                    message.push({msg: "發生了一些錯誤以致無法完成註冊，請稍後再試"})
                    res.render('signup', {message})
                }
            })
        }
    })
});

module.exports = router;
