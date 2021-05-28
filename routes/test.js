const express = require('express')
const router = express.Router()
const sender = require('../email/js/send_content')
const parms = require('../parms')
const db = require('../database')
const https = require('https')
const request = require('request')

// const recommender = require('../helper/friend_recommender')

// console.log(recommender(10001));

var temp = [
    {
        'title': 'title_1',
        'username': 'name_1',
        'pw': 'pw_1',
        'email': 'ccyajs12d82@gmail.com'
    }
]

/* GET users listing. */
router.get('/', async (req, res, next) => {
    // db.connect( (err) => {
    //     if (err) throw err;
    //     console.log('connected')

    //     var name = "test_001";
    //     var result = db.query(`select * from users where user_name = "${name}"`, (err, result)=>{
    //         if (err) throw err;
            
    //         console.log(result[0].user_name)
    //         res.render('test', {results:result, interest_list: parms.hobbies})
    //     })
    // }).close();

    // var place = '獅子山燒烤場'
    // var src = `https://www.google.com/maps/embed/v1/place?key=${parms.api_key.google}&q=$${place}`

    // console.log(src);
    // // console.log(sorting_helper('WTS'))

    // var test = {b: "b"}
    // test.a = "a"

    // res.render('test', {src: src, test: test})
    // res.render('test', { results: temp, interest_list: parms.hobbies})
    // var logined = false
    // try {
    //     logined = req.cookies['login'].toString()=='true'?true:false;
    // } catch (e) {
    //     console.log(e.message)
    // }

    // document.querySelector('#btnEd').addEventListener('click', () => {
    //     alertHI()
    // })


    var options = {
        uri: "http://localhost:3000/api/register",
        method: "POST",
        headers: "Content-Type: application/json",
        body: {
            "username": temp.username,
            "email": temp.email,
            "password": temp.password
        },
        json: true
    }

    request(options, (err, res) => {
        console.log(res.body);
        if (err) throw err
        if (res.statusCode == 200) {
            console.log(res.body);
        }
    })

    // request.get('http://localhost:3000/api/user/ccyandy9582@gmail.com', (err, result) => {
    //     if (err) throw err
    //     if (result.statusCode == 200) {
    //         res.send(result.body)
    //     }
    // })
})
    .post('/', (res, req) => {
        sender(parms.mail.auth.mail_type, "asjdhjkashdkhkasdhk")
        req.redirect('/test')
    })
var alertHI = () =>{
    console.log('hi')
}
module.exports = router
