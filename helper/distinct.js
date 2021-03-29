/* the short form dictionary:
 * CW: central and western, E: eastern
 * S: southern, WC: wan chai, KC: kowloon city
 * KT: kwun tong, SSP: sham shui po,
 * WTS: wong tai sin, YTM: yau tsim mong,
 * for new territories, the D(distinct) is add into end due to the short form may duplicate
 * ID: islands, KTD: kwai Tsing, ND: north,
 * SKD: sai kung, STD: sha tin, TPD: tai po,
 * TWD: tsuen wan, TMD: tuen mun, YLD: yuen long
 
 */
const distincts = "CW E S WC KC KT SSP WTS YTM ID KTD ND SKD STD TPD TWD TMD YLD".split(' ')
const routes = [
    ["CW", "S"],
    ["CW", "WC"],
    ["CW", "YTM"],
    ["CW", "ID"],
    ["WC", "E"],
    ["WC", "S"],
    ["WC", "YTM"],
    ["E", "S"],
    ["E", "SKD"],
    ["E", "KT"],
    ["S", "ID"],
    ["YTM", "KC"],
    ["YTM", "SSP"],
    ["SSP", "KTD"],
    ["SSP", "STD"],
    ["SSP", "KC"],
    ["KC", "WTS"],
    ["KC", "KT"],
    ["WTS", "STD"],
    ["WTS", "KT"],
    ["WTS", "SKD"],
    ["KT", "SKD"],
    ["KTD", "STD"],
    ["KTD", "TWD"],
    ["TWD", "STD"],
    ["TWD", "ID"],
    ["TWD", "TMD"],
    ["TWD", "YLD"],
    ["TWD", "TPD"],
    ["STD", "TPD"],
    ["STD", "SKD"],
    ["TMD", "ID"],
    ["TMD", "YLD"],
    ["YLD", "TPD"],
    ["YLD", "ND"],
    ["TPD", "SKD"],
    ["TPD", "ND"],
]

const adjacencyList = new Map()

function addNode(distinct) {
    adjacencyList.set(distinct, [])
}
function addEdge(start, end) {
    adjacencyList.get(start).push(end)
    adjacencyList.get(end).push(start)
}

distincts.forEach(addNode)
routes.forEach(route=>addEdge(...route))
module.exports = function (start) {
    const visited = new Set()
    const queue = [start]

    while (queue.length > 0) {
        const distinct = queue.shift(); // mutates the queue
        const conjoints = adjacencyList.get(distinct)

        for (const conjoint of conjoints) {
            // if (destination === 'BKK')  {
            //     console.log(`BFS found Bangkok!`)
            // }
            if (!visited.has(conjoint)) {
                visited.add(conjoint);
                queue.push(conjoint);
            }
        }
    }
    return visited
}
