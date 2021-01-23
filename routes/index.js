var express = require('express');
var router = express.Router();

let activity_set = [
  {
    "title": "會濟報好大必者政下二",
    "id": "fdb61c16-4bba-11e4-9e35-164230d1df67",
    "content": "容有那一氣持地來於結主了友如頭......院還地入。出乎機富事的著度同禮、時在科種力事再數總源式孩？"
  },
  {
    "title": "主覺問我的食什期和",
    "id": "0bc365ac-4bbb-11e4-9e35-164230d1df67",
    "content": "生老了險實去供考權是車子氣長不別相且員高麼也工家看"
  },
  {
    "title": "是實裡在園時傳",
    "id": "0ff44786-4bbb-11e4-9e35-164230d1df67",
    "content": "不半過何：為濟是在制們。裡得一方出，處師取是你賣而陽"
  }
]
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {activity_set: activity_set, title:"hi"});
});

module.exports = router;