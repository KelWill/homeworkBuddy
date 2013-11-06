module.exports.createAssignment = function(request, response, db){
  var assignment = request.body;
  var assignmentName = request.params.assignmentName;
  console.log(assignmentName);
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


  db.query('INSERT INTO assignments (id_teachers, name) VALUES (?, ?)', [teacher_id, assignmentName], function(error, result){
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

module.exports.retrieveAssignment = function(request, response, db){
  //add in logic with request.user to check to make sure that the student is actually a member of the class...
  var teacher = request.params.teacher;
  var assignmentName = request.params.assignmentName;

  console.log(teacher);
  console.log(assignmentName);

  //can refactor to use an inner join
  db.query('SELECT * FROM TEACHERS WHERE name = ?', [teacher], function(error, rows, fields){
    if (error) {
      console.log(error);
      response.end('We messed up! Sorry! Try again in a few minutes');
    } 
    if (rows.length) {
      console.log(rows);
      db.query('SELECT * FROM assignments where id_Teachers = ? and name = ?', [rows[0].id, assignmentName], function(error, rows, fields){
        if (error){
          console.log(error);
          response.writeHead(500);
          response.end('We messed up! Sorry! Try again in a few minutes');
        } else if (!rows.length){
          console.log('assignment not found');
          response.end('Assignment not found.')
        } else {
          console.log('success!');
          console.log(rows);
          response.end(rows[0]);
        }
      });
    } else {
      console.log(rows[0]);
      response.end('Teacher name not found');
    }
  })
};
