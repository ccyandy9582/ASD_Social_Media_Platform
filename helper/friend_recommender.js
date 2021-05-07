// const { query } = require('../database')
// const db = require('../database')
// const parms = require('../parms')
// const sortMap = require('sort-map')
// const compare = require('3')
// const { map } = require('jquery')
// const https = require('https')

// function similar(s, t, f) {
//     if (!s || !t) {
//         return 0
//     }
//     var l = s.length > t.length ? s.length : t.length
//     var n = s.length
//     var m = t.length
//     var d = []
//     f = f || 3
//     var min = function (a, b, c) {
//         return a < b ? (a < c ? a : c) : (b < c ? b : c)
//     }
//     var i, j, si, tj, cost
//     if (n === 0) return m
//     if (m === 0) return n
//     for (i = 0; i <= n; i++) {
//         d[i] = []
//         d[i][0] = i
//     }
//     for (j = 0; j <= m; j++) {
//         d[0][j] = j
//     }
//     for (i = 1; i <= n; i++) {
//         si = s.charAt(i - 1)
//         for (j = 1; j <= m; j++) {
//             tj = t.charAt(j - 1)
//             if (si === tj) {
//                 cost = 0
//             } else {
//                 cost = 1
//             }
//             d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
//         }
//     }
//     let res = (1 - d[n][m] / l)
//     return res.toFixed(f)
// }

// module.exports = function (id, user) {
//     db.query(`select * from user_hobbies where user_id != ${id} order by user_id, hobby`, (err, results) => {
//         if (err) throw err
//         let map1 = new Map()
//         let map2 = new Map()
//         let user_hobby = new String("")

//         user.hobbies.forEach(hobby => {
//             user_hobby += hobby
//         });
//         map1.set(user.user_id, user_hobby)
//         console.log(map1);
//         results.forEach(result => {
//             if (!map1.get(result.user_id)) {
//                 map1.set(result.user_id, result.hobby)
//             } else {
//                 let str_hobby = map1.get(result.user_id) + result.hobby
//                 map1.set(result.user_id, str_hobby)
//             }
//         })
//         var ary = Array.from(map1)
//         console.log(ary);
//         for (let index = 1; index < ary.length; index++) {
//             console.log(ary[index][1])
//             console.log(ary[0][1]);
//             console.log(similar(ary[index][1], ary[0][1]))
//             map2.set(ary[index][0], similar(ary[index][1], ary[0][1]))
//         }
//         console.log(map2);
//         var arr = Array.from(map2)
//         for (let i = 0; i < arr.length - 1; i++) {
//             for (let j = 0; j < arr.length - i - 1; j++) {
//                 if (arr[j][1] < arr[j + 1][1]) {
//                     var temp = arr[j]
//                     arr[j] = arr[j + 1]
//                     arr[j + 1] = temp
//                 }
//             }
//         }
//         user.recommendedList = arr
//     })
//     return user.recommendedList
// }