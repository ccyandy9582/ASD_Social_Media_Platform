const mysql = require('mysql');

module.exports = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: null,
    database: 'test',
    acquireTimeout: 10000
})


