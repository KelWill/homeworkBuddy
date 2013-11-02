var mysql = require('mysql');  //refactor out into separate module
var express = require('express');
var app = express();

var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'Will',
  password : 'amba90w.',
});

// app.all('*', function(req, res, next){
//   // if (!req.get('Origin')) return next();
//   // use "*" here to accept any origin
//   res.set('Access-Control-Allow-Origin', '*');
//   res.set('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE, OPTIONS");
//   res.set('Access-Control-Allow-Headers', "content-type, accept");
//   res.set('Access-Control-Allow-Max-Age', 10);
//   if ('OPTIONS' == req.method) return res.send(200);
//   next();
// });

db.connect();

db.query('use homeworkBuddy', function(){});

app.use(express.static(__dirname));

app.get('/login', function(request, response){
  response.sendfile(__dirname + '/login.html');
});

//add in /:user/:assignmentName
app.post('/', function(request, response){

  message = "";

  request.on('data', function(chunk){
    message+=chunk;
  });

  request.on('end', function(){
    message = JSON.parse(message);
    response.end();
  });

})


// INSERT INTO table_name (column1, column2, column3,...)
// VALUES (value1, value2, value3,...)

app.post('/signup', function(request, response){

  var userData = '';

  request.on('data', function(chunk){
    userData+=chunk;
  });

  request.on('end', function(){
    userData = JSON.parse(userData);

    db.query('SELECT * FROM teachers where name = ?', [userData.username] , function(err, rows, fields) {
      if ( rows.length === 0 ) {
        db.query('INSERT INTO teachers (name, email, password_hash) VALUES (?, ?, ?)', [userData.username, userData.username, userData.password], function(err){
          response.end('You signed up successfully');
        });
      } else {
        response.writeHead(401);
        response.end('User already exists');
      }
    });

  });

});

app.post('/login', function(request, response){

  var userData = '';

  request.on('data', function(chunk){
    userData+=chunk;
  });

  request.on('end', function(){
    userData = JSON.parse(userData);

    db.query('SELECT * FROM teachers WHERE name = ?', [userData.username], function(err, rows, fields){
      if ( rows.length && rows[0].password_hash === userData.password){
        response.end('You logged in successfully.')
      } else {
       response.end('Incorrect username or password');
      }
    });

  });

});



app.listen(8080);