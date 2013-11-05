//Requiring Modules
var mysql = require('mysql');
var express = require('express');
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
db.query('use homeworkBuddy', function(){
  console.log('using homeworkBuddy database');
});

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
// starting local strategy for passport
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
}

var passport = require('passport')
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
app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login'})  );

app.get('/login', function(request, response){
  response.sendfile(__dirname + '/login.html');
});

//   Signing Up   //
//   todo: rewrite  //
app.post('/signup', function(request, response){
  console.log('signup attempted!');

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



//   Posting Homework   //
//   Teacher View   //
app.post('/', function(request, response){
  console.log('posting homework!');
  console.log('request.body', request.body);
  console.log('request.user', request.user);
  //because of passport.js request.user will have data associated with the user automagically
  

  // if (!request.user) {
  //   response.writeHead(401);
  //   response.end();
  // } 

  var assignment = request.body;
  var thingsToInsert = 0;
  var thingsInserted = 0;
  //var teacher_id = request.user.id;
  var text, questionSet, answer, question, paragraph, p_id;
  //insert into the assignment body with a teacher's id
  for ( var i = 0 ; i < assignment.length; i++) {
    paragraph = assignment[i];
    console.log(paragraph);
    p_id = paragraph.id;
    text = paragraph.text;
    questionSet = paragraph.questionSet;
    console.log('questionSet ', questionSet);
    console.log('p_id', p_id);
    console.log('text', text);



    //first need to insert into assignments, so can get the assignment id
    //then can insert questions into questions and text into paragraphs
    questionSet = paragraph.questionSet;
    if (questionSet){
      for ( var j = 0; j < questionSet.length; j++ ) {
        question = questionSet[j];
        if (question.correctAnswer){
          answer = question.correctAnswer;
          delete question.correctAnswer;
        }
      }
      console.log(question);
      console.log(answer);
    }

    //insert all the paragraphs and questions into the appropriate tables with the right ids so that they can be reconstructed
  }

  response.end('stuff happened...');

});

var finish = function(thingsInserted, thingsToInsert, message){
  if (thingsInserted === thingsToInsert){
    response.end(message);
  }
}


//   Starting Server   //
app.listen(8080);