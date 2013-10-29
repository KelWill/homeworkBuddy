var mysql = require('mysql');
var connection  = mysql.createConnection({
  host     : 'localhost',
  user     : 'Will',
  password : 'amba90w.'
});

connection.connect();

console.log('successfully connected');

connection.query('Use homeworkBuddy');



