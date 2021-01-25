var express = require('express');
var router = express.Router();

let activity_set = [
    {
        "title": "會濟報好大必者政下二",
        "eventID": "fdb61c16-4bba-11e4-9e35-164230d1df67",
        "desc": "容有那一氣持地來於結主了友如頭......院還地入。出乎機富事的著度同禮、時在科種力事再數總源式孩？",
        "url": '#'
    },
    {
        "title": "主覺問我的食什期和",
        "eventID": "0bc365ac-4bbb-11e4-9e35-164230d1df67",
        "desc": "生老了險實去供考權是車子氣長不別相且員高麼也工家看",
        "url": '#'
    },
    {
        "title": "是實裡在園時傳",
        "eventID": "0ff44786-4bbb-11e4-9e35-164230d1df67",
        "desc": "不半過何：為濟是在制們。裡得一方出，處師取是你賣而陽",
        "url": '#'
    }
]

/* GET activities listing. */
router.get('/', function(req, res, next) {
    // res.render('activities');
    res.render('activities', {my_list:activity_set});
});

router.get('/event/:eventID', function (req, res, next) {
    var eventID = req.params.eventID;

})

module.exports = router;
