var express = require('express')
var router = express.Router()
const sender = require('../email/js/send_content')
const parms = require('../parms')
const db = require('../database')

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
    db.connect( (err) => {
        if (err) throw err;
        console.log('connected')

        var name = "test_001";
        var result = db.query(`select * from users where user_name = "${name}"`, (err, result)=>{
            if (err) throw err;
            
            console.log(result[0].user_name)
            res.render('test', {results:result, interest_list: parms.hobbies})
        })
    }).close();

    console.log(sorting_helper('WTS'))
    // res.render('test', { results: temp, interest_list: parms.hobbies})
    // var logined = false
    // try {
    //     logined = req.cookies['login'].toString()=='true'?true:false;
    // } catch (e) {
    //     console.log(e.message)
    // }
})
    .post('/', (res, req) => {
        sender(parms.mail.auth.mail_type, "asjdhjkashdkhkasdhk")
        req.redirect('/test')
    })

module.exports = router
