const express = require('express')
const router = express.Router()
const sender = require('../email/js/send_content')
const parms = require('../parms')
const db = require('../database')
const https = require('https')

var temp = [
    {
        'title': 'title_1',
        'name': 'name_1',
        'pw': 'pw_1',
        'email': 'ccyandy9582@gmail.com'
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

    var place = '獅子山燒烤場'
    var src = `https://www.google.com/maps/embed/v1/place?key=${parms.api_key.google}&q=$${place}`

    console.log(src);
    // console.log(sorting_helper('WTS'))

    res.render('test', {src: src})
    // res.render('test', { results: temp, interest_list: parms.hobbies})
    // var logined = false
    // try {
    //     logined = req.cookies['login'].toString()=='true'?true:false;
    // } catch (e) {
    //     console.log(e.message)
    // }

    document.querySelector('#btnEd').addEventListener('click', () => {
        alertHI()
    })
})
    .post('/', (res, req) => {
        sender(parms.mail.auth.mail_type, "asjdhjkashdkhkasdhk")
        req.redirect('/test')
    })
var alertHI = () =>{
    console.log('hi')
}
module.exports = router
