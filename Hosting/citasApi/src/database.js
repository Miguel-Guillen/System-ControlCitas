const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
    host: 'db-control-citas.cmtzmtsbmadd.us-east-2.rds.amazonaws.com',
    // host: 'localhost',
    user: 'root',
    password: 'Feliz_123',
    // password: 'Miguel20',
    database: 'controlcitas',
    port: 3306,
    dateStrings: true
});

mysqlConnection.connect(function(err){
    if(err){
        console.log(err);
        return;
    } else {
        console.log('Db is connected');
    }
});

module.exports = mysqlConnection;