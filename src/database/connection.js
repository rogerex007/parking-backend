const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'parking',
});

mysqlConnection.connect((err) => {
    if (err) {
        console.log('Error connecting: '+ err.stack);
        return;
    }else{
        console.log('Db is connected');
    }
})

module.exports = mysqlConnection;





