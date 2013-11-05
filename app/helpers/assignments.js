

module.exports.createAssignment = function(request, response, db){
  var assignment = request.body;
  var thingsToInsert = 0;
  var thingsInserted = 0;
  if (request.user) { var teacher_id = request.user.id; } else { teacher_id = 1; }
  //insert into the assignment body with a teacher's id
  
  var insertAll = function(assignment, assignment_id){
    var text, answer, questionSet, question, paragraph, p_id;

    for ( var i = 0 ; i < assignment.length; i++) {
      paragraph = assignment[i];
      p_id = paragraph.id;
      text = paragraph.text;
      questionSet = paragraph.questionSet;

      if (questionSet){
        for ( var j = 0; j < questionSet.length; j++ ) {
          question = questionSet[j];
          if (question.correctAnswer){
            answer = question.correctAnswer;
            delete question.correctAnswer;
          } else {
            answer = null;
          }
          question = JSON.stringify(question);
          thingsToInsert++;
          db.query('INSERT INTO questions (id_Assignments, QuestionText, QuestionAnswer, paragraph_id) VALUES (?, ?, ?, ?)', [assignment_id, question, answer, p_id], function(error, result){
            thingsInserted++;
            if (error) { console.log (error); } 
            finish(thingsInserted, thingsToInsert, response);
          });
        }

      }
      thingsToInsert++;
      db.query('INSERT INTO paragraphs (id_Assignments, paragraph_id, text) VALUES (?, ?, ?)', [assignment_id, p_id, text], function(){
        thingsInserted++;
        finish(thingsInserted, thingsToInsert, response);
      });
    }
  };


  db.query('INSERT INTO assignments (id_teachers) VALUES (?)', teacher_id, function(error, result){
    if (error){
      console.log(error);
    } else {
      insertAll(assignment, result.insertId);
    }
  });

  var finish = function(thingsInserted, thingsToInsert, response){
    if (thingsInserted === thingsToInsert){
      response.end('WHOOHOOO');
    }
  }
};

module.exports.retrieveAssignment = function(request, response){

};
