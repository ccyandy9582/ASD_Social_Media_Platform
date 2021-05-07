// var date = new Date()
// console.log(date.toUTCString());

// const { json } = require('body-parser');
// var bfs = require('./helper/distinct')
// let wts = bfs('WTS')

// console.log(wts);

// function sorting(list, order) {
//     let sorted = []
//     order.forEach(ele => {
//         console.log('a');
//         list.forEach(item => {
//             console.log(item.place_distinct == ele && !sorted.includes(item));
//             if (item.place_distinct == ele && !sorted.includes(item)) {
//                 sorted.push(item)
//             }
//         })
//     });
//     return sorted
// }


// let activity = [
//     {"name":"001", "place_distinct":"WTS"},
//     {"name":"002", "place_distinct":"TPD"},
//     {"name":"003", "place_distinct":"TWD"},
//     {"name":"004", "place_distinct":"S"},
// ]

// console.log(sorting(activity, wts));

const participants = [1,2,3,4,5]
const friends = [2,4,6]

participants.forEach((item, index) => {
    console.log(index+": ");
    if (friends.includes(item)) console.log(item+" is friend")
    else console.log(item+" is not friend")
});

console.log(friends.length);

var asd = {}
if (asd.a) {
    console.log('hi');
}else console.log("bb");