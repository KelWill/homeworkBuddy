//Requiring Modules
var mysql = require('mysql');
var express = require('express');
var app = express();
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

//   Database   //
//creating connection with database
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'Will',
  password : 'amba90w.',
});

//connecting to database and using correct table
db.connect();
db.query('use homeworkBuddy', function(){});

//configuring express app
app.configure(function() {
  app.use(express.static('public'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'a random string' }));

  //initializing passport
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

app.use(express.static(__dirname));


//   Passport   //
//starting local strategy for passport
passport.use(new LocalStrategy(
  function(username, password, done) {
    db.query('SELECT * FROM teachers WHERE name = ?', [userData.username], function(err, rows, fields){
      if ( rows.length && rows[0].password_hash === userData.password){
        //successful login
        return done(null, user);
      } else {
        //failed login
        return done(null, false, {message: 'Incorrect username or password'});
      }
    });
  }
));

passport.serializeUser(function(user, done) {
  // done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  // User.findById(id, function(err, user) {
  //   done(err, user);
  // });
});


//   Cors stuff, if necessary   //
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

//   User authentication   //
//   Login   //
app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login'}));

app.get('/login', function(request, response){
  response.sendfile(__dirname + '/login.html');
});

//   Signing Up   //
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

//   Posting Homework   //
//   Teacher View   //
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



});



// app.post('/login', function(request, response){


  // var userData = '';

  // request.on('data', function(chunk){
  //   userData+=chunk;
  // });

  // request.on('end', function(){
  //   userData = JSON.parse(userData);

// });


//   Starting Server   //
app.listen(8080);