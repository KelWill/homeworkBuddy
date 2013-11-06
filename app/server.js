//Requiring Modules
var mysql = require('mysql');
var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var assignments = require('./helpers/assignments');

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

var app = express();
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
  app.use(express.static(__dirname));
});

app.get('/', function(request, response){
  response.sendfile('index.html');
});

//   Passport   //
var isValidUserPassword = function(username, password, done){
  console.log('isValidUserPassword is running');
  db.query('SELECT * FROM teachers WHERE email = ?', username, function(err, rows, fields){
    console.log('database query!');
    console.log(rows);
    if (err){
      console.log(err);
      return done(err);
    } else if (!rows[0]) {
      console.log('username doesn\'t exist');
      return done(null, false);
    } else if (rows[0].password_hash !== password ){
      console.log('incorrect password');
      return done(null, false)
    } else {
      console.log('you logged in!');
      return done(null, rows[0]);
    }
  })
};

var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.use(new LocalStrategy({
          usernameField: 'username',
          passwordField: 'password'
  }, function(username, password, done) {
    isValidUserPassword(username, password, done);
}));


passport.serializeUser(function(user, done) {
  console.log('serializing!');
  console.log('user', user);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log('deserializing!');
  db.query('SELECT * FROM teachers WHERE id = ?', [id], function(err, rows, fields){
    done(err, rows[0]);
  });
});

//   User authentication   //
//   Login   //
app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login'})  );

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
});

app.get('/getassignments/:teacher/:assignmentName', function(request, response){
  assignments.retrieveAssignment(request, response, db);
});

//   Posting Homework   //
//   Teacher View   //
app.post('/newhw/:assignmentName', function(request, response){
  assignments.createAssignment(request, response, db);
});

//   Starting Server   //
app.listen(8080);