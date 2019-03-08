let mysql = require('mysql');
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'sdr',
    insecureAuth : true,
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected to MySQl");
});
module.exports = connection