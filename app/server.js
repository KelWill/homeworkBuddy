//Requiring Modules
var mysql = require('mysql');
var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var assignments = require('./helpers/assignments');
var grading = require('./helpers/grading');
var review = require('./helpers/review');

//   Database   //
//creating connection with database
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'will',
  password : 'secret',
});

//connecting to database and using correct table
db.connect(function(err){
  if (err) { console.log(err); }
});

db.query('USE hwBud', function(err){
  if (err) { console.log(err); }
});

var app = express();
//configuring express app
app.configure(function() {;
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

app.get('/teacher/create', function(request, response){
  response.sendfile('index.html');
});

app.get('/student', function(request, response){
  response.sendfile('student.html');
});

app.get('/student/review/getquestions', function(request, response){
  review.getReviewQuestions(request, response, db);
});

app.get('/student/review', function(request, response){
  response.sendfile('assignment.html');
})

app.post('/student/review', function(request, response){
  console.log("request received");
  review.saveReviewProgress(request, response, db);
});

app.get('/student/:teacher', function(request, response){
  response.sendfile('student.html');
});

app.get('/student/:teacher/yaynohomework', function(request, response){
  response.redirect('http://www.zoombo.com');
});

app.get('/student/:teacher/:assignmentid/:optional?*', function(request, response){
  response.sendfile('assignment.html');
})

//   Passport   //
var isValidUserPassword = function(username, password, done){
  db.query('SELECT * FROM Users WHERE name = ?', username, function(err, rows, fields){
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
  });
};

var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
          usernameField: 'username',
          passwordField: 'password'
  }, function(username, password, done) {
    isValidUserPassword(username, password, done);
}));


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.query('SELECT * FROM Users WHERE id = ?', [id], function(err, rows, fields){
    done(err, rows[0]);
  });
});

//   User authentication   //
//   Login   //
app.post('/login/teacher', passport.authenticate('local', { successRedirect: '/teacher/create', failureRedirect: '/login'})  );
app.post('/login/student', passport.authenticate('local', { successRedirect: '/student', failureRedirect: '/login'})  );
app.post('/login/user', passport.authenticate('local'), function(request, response){
  response.end(JSON.stringify({loggedin: true}));
})



app.get('/login', function(request, response){
  response.sendfile(__dirname + '/login.html');
});

//   Signing Up   //
app.post('/signup/:teacherOrStudent', function(request, response){
  var userData = '';
  var teacherOrStudent;
  if (request.params.teacherOrStudent == "teacher"){
    teacherOrStudent = 1;
  } else {
    teacherOrStudent = 0;
  }

  db.query('SELECT * FROM Users where name = ?', [userData.username] , function(err, rows, fields) {
    if ( rows.length === 0 ) {
      db.query('INSERT INTO Users (name, email, password_hash, isTeacher) VALUES (?, ?, ?, ?)', 
        [request.body.username, request.body.email, request.body.password, teacherOrStudent], 
        function(err){
          response.end('You signed up successfully');
      });
    } else {
      response.writeHead(401);
      response.end('User already exists');
    }
  });
});

//   logging out   //
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

//   Getting and Joining Classes   //
app.post('/students/joinclass/:teacher', function(request, response){
  if (request.user){
    assignments.joinClass(request, response, db);
  } else {
    response.writeHead(401);
    response.end('Are you logged in?');
  }
});

app.get('/allclasses', function(request, response){
  if (request.user){
    assignments.allClasses(request, response, db);
  } else {
    response.end();
  }
})


//   Getting Assignments   //
app.get('/getassignment/:teacher/:assignmentName/:optional?*', function(request, response){
  assignments.retrieveAssignment(request, response, db);
});

app.get('/getassignments/:teacher', function(request, response){
  assignments.retrieveTeacherAssignments(request, response, db);
});

//   submitting an assignment   //
app.post('/submitassignment/student/:teacher/:assignmentName', function(request, response){
  if (request.user){
    assignments.submitAssignment(request, response, db, request.body);
  } else {
    response.writeHead(401);
    response.end('You are not logged in. Sorry!');
  }
})

//   Getting List of Teachers   //
app.get('/allteachers', function(request, response){
  assignments.getAllTeachers(request, response, db);
});


//   Posting Homework   //
//   Teacher View   //
app.post('/newhw/:assignmentName', function(request, response){
  assignments.createAssignment(request, response, db);
});



//   Grading Homework   //
app.get('/teacher/grade/:assignmentName', function(request, response){
  grading.grade(request, response, db);
});

app.get('/teacher/grade', function(request, response){
  if (request.user){
    assignments.getAssignmentsForTeacher(request, response, db);
  } else {
    response.writeHead(401);
    response.end();
  }
});

//   Starting Server   //
app.listen(8080);