const mysql = require('mysql');
const ID_CONN = require('./user_id');
const db = ID_CONN.MySQL();

let connection = mysql.createConnection({
    host     : 'localhost',
    user     : db.user,
    password : db.pass,
    database : db.name
});

module.exports = connection;