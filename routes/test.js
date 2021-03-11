var express = require('express')
var router = express.Router()
const sender = require('../email/js/send_content')
const parms = require('../parms')

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

    //     var name = "andy";
    //     console.log(typeof name)
    //     var result = db.query(`select * from users where name = "${name}"`, (err, result)=>{
    //         if (err) throw err;
    //         console.log(result[0].name);
    //         res.cookie('test', true)
    //         console.log(req.cookies['test'] == "true")
    //         res.render('test', {results:result})
    //     })
    // }).close();
    res.render('test', { results: temp, interest_list: parms.hobbies})
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
