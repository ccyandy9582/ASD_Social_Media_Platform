var express = require('express');
var router = express.Router();
const db = require('../database');

/* GET users listing. */
router.get('/', async (req, res, next) => {
    db.connect( (err) => {
        if (err) throw err;
        console.log('connected')

        var name = "andy";
        console.log(typeof name)
        var result = db.query(`select * from users where name = "${name}"`, (err, result)=>{
            if (err) throw err;
            console.log(result[0].name);
            res.cookie('test', true)
            console.log(req.cookies['test'] == "true")
            res.render('test', {results:result})
        })
    }).close();
});

module.exports = router;
