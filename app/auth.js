

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  //done is callback to do that gets passed to the passport
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
