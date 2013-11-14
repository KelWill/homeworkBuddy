module.exports.getReviewQuestions = function(request, response, db){
  if (!request.user){
    response.writeHead(401)
    response.end("You are not logged in!");
  }
  db.query('SELECT CONVERT(QuestionText using UTF8) as QuestionText, QuestionAnswer, Questions.id as id, review_session, streak FROM Questions JOIN Student_Questions\
    ON Student_Questions.id_Questions = Questions.id JOIN Users On Student_Questions.id_Students = Users.id\
    WHERE Student_Questions.id_Students = ? and Questions.QuestionType = "MC" ORDER BY\
    Streak ASC', [request.user.id], function(error, rows, fields){
      if (error){
        response.writeHead(500);
        console.log(error);
        response.end("We messed up! Sorry.");
      } else if (!rows.length){
         response.writeHead(500);
         response.end(JSON.stringify({Question: "Nothing there!"}));
      } else {
        var review_session = rows[0].review_session;
        console.log("review session: ", review_session)
        if (typeof review_session !== 'number') {
          console.log('review session is not a number');
          review_session = 0; 
        }
        if (review_session === 0){
          response.end(JSON.stringify(rows));
        }
        else {
          var questions = [];
          var toReturn = {0: true};
          if (!(review_session%2)){
            toReturn[1] = true;
          }
          if (!(review_session%5)){ 
            toReturn[2] = true;
          }
          if (!(review_session%9)){ 
            toReturn[3] = true;
          }
          if (!(review_session%14)){ 
            toReturn[4] = true;
          }
          for ( var i= 0; i < rows.length; i++ ){
            if (toReturn[rows[i].streak]){
              questions.push(rows[i]);
            }
          }
          console.log('questions', questions);
          response.end(JSON.stringify(questions));
        }

      }
  });
};

module.exports.saveReviewProgress = function(request, response, db){
  if (!request.user && !request.user.id){
    response.writeHead(401);
  }
  console.log('save review progress is running');
  var sId = request.user.id;
  console.log(request.body);
  var answers = request.body;
  var toEnter = answers.length;
  var entered = 0;
  for ( var i = 0; i < answers.length; i++ ){
    db.query('UPDATE Student_Questions SET streak = streak + ? WHERE id_Students = ? and id_Questions = ?', 
             [answers[i].streak, sId, answers[i].id], function(error, rows, fields){
               entered++;
               if (error) { console.log(error); }
               console.log(toEnter, entered);
               if (entered === toEnter){
                 db.query('UPDATE Users SET review_session = review_session + 1 WHERE id = ?', [sId], function(error, rows, fields){
                   if (error){ console.log(error); }
                   response.end();
                 });
               }
             });

  }
};