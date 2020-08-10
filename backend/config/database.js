const mysql = require('mysql');
const ID_CONN = require('./user_id');
const db = ID_CONN.MySQL();

let connection = mysql.createConnection({
    host     : 'localhost',
    user     : db.user,
    password : db.pass,
    database : db.name
});

connection.connect(function(err){
    if (err){
        console.log("There was an error : " + err);
    }
    console.log("Connected to MySQL!");
  });

module.exports = connection;