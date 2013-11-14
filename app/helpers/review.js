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
         response.end("Nothing there!");
      } else {
        console.log(rows);
        var review_session = rows[0].review_session;
        console.log(review_session);
        if (typeof review_session !== 'number') { review_session = 0; }
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

};