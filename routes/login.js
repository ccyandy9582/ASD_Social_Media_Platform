const express = require('express');
const router = express.Router();
const { restrict, checkPassword } = require('auth')
const db = require('../database');

/* GET login listing. */
router.get('/', (req, res, next) => {
    req.cookies['login']
    res.render('login', {failed:false});
    })

    .post('/', async(req, res) => {
        userMail = req.body.email
        password = req.body.pw

        if(!userMail&&password) {
            return ""
        }

         await db.connect( (err) => {
            if (err) throw err;
            console.log('connected')
            var database = db.query(`select * from users where email = "${userMail}"`, (err, result)=>{
                if (err) throw err;
                console.log(`database: ${result[0].email}, ${result[0].pw}`)
                if (result[0].email == userMail && result[0].pw == password) {
                    res.cookie('login', "true")
                    console.log(`logined: ${req.cookies['login']=="true"}`)
                    console.log(req.cookies['test'] == "true")
                    res.redirect('/');
                } else {
                    console.log(`email / password not correct`)
                    res.render('login' ,{failed: true});
                }
            })
        }).close();
    });

module.exports = router;
