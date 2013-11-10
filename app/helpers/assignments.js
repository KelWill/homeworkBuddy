module.exports.createAssignment = function(request, response, db){
  var assignment = request.body;
  var assignmentName = request.params.assignmentName;
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
      if (assignment[i].name){
        continue;
      }
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
          db.query('INSERT INTO questions (id_Assignments, QuestionText, QuestionAnswer, paragraph_id) VALUES (?, ?, ?, ?)', 
            [assignment_id, question, answer, p_id], 
            function(error, result){
              thingsInserted++;
              if (error) { console.log (error); } 
              finish(thingsInserted, thingsToInsert, response);
          });
        }
      }
      thingsToInsert++;
      db.query('INSERT INTO paragraphs (id_Assignments, paragraph_id, text) VALUES (?, ?, ?)', 
        [assignment_id, p_id, text], 
        function(error){
          if (error) { console.log('inserting into paragraphs failed', error); }
          thingsInserted++;
          finish(thingsInserted, thingsToInsert, response);
      });
    }
  };


  db.query('INSERT INTO assignments (id_teachers, assignmentName) VALUES (?, ?)', [teacher_id, assignmentName], function(error, result){
    if (error){
      console.log('inserting into assignment failed');
      console.log(error);
    } else {
      insertAll(assignment, result.insertId);
    }
  });

  var finish = function(thingsInserted, thingsToInsert, response){
    if (thingsInserted === thingsToInsert){
      response.end(JSON.stringify('WHOOHOOO'));
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
  db.query('SELECT * FROM Users WHERE name = ? and isTeacher = 1', [teacher], function(error, rows, fields){
    if (error) {
      console.log(error);
      response.end(JSON.stringify('We messed up! Sorry! Try again in a few minutes'));
    } 
    if (rows.length) {
      console.log(rows);
      db.query('SELECT * FROM assignments where id_Teachers = ? and assignmentName = ?', [rows[0].id, assignmentName], function(error, rows, fields){
        if (error){
          console.log(error);
          response.writeHead(500);
          response.end(JSON.stringify('We messed up! Sorry! Try again in a few minutes'));
        } else if (!rows.length){
          console.log('assignment not found');
          response.end(JSON.stringify('Assignment not found.'))
        } else {
          console.log('success!');
          console.log(rows);
          getParagraphsAndQuestions(request, response, db, rows[0].id);
        }
      });
    } else {
      console.log(rows[0]);
      response.end('Teacher name not found');
    }
  });
};

var getParagraphsAndQuestions = function(request, response, db, assignmentId){
  var query = 0;
  var data = {};
  var paragraphs;
  var questions;

  //refactor with inner join
  db.query('SELECT CONVERT(text USING utf8) as text, paragraph_id FROM paragraphs WHERE id_Assignments = ? ORDER BY paragraph_id DESC', [assignmentId], function(error, rows, fields){
    if (error) { console.log(error); }
    query++;
    console.log(rows);
    paragraphs = JSON.stringify(rows);
    if ( query === 2){
      data.questions = questions;
      data.paragraphs =  paragraphs
      data = JSON.stringify(data);
      response.end(data);
    }
  });
  db.query('SELECT id, paragraph_id, CONVERT(QuestionText USING utf8) as QuestionText FROM questions WHERE id_Assignments = ? ORDER BY paragraph_id DESC', [assignmentId], function(error, rows, fields){
    if (error) { console.log(error); }
    query++;
    var qs= parseQuestions(rows);
    questions = JSON.stringify(qs);
    if ( query === 2){
      data.questions = questions;
      data.paragraphs =  paragraphs;
      data = JSON.stringify(data);
      response.end(data);
    }
  });
};

var parseQuestions = function(rows){
  console.log(rows);
  for (var i = 0; i < rows.length; i++){
    //optimize for speed later
    for ( var key in rows[i]){
      if (key === "correctAnswer" || key === "answer" || key === "rendered"){
        delete rows[i][key];
      }
    }
  }
  return rows;
};

module.exports.retrieveTeacherAssignments = function(request, response, db){
  var teacher = request.params.teacher;
  db.query('SELECT assignments.assignmentName, assignments.id FROM Users JOIN assignments on Users.id = id_Teachers WHERE Users.name = ?', [teacher], function(error, rows, fields){
    if (error) {
      console.log(error);
      response.end('We messed up! Sorry! Try again in a few minutes');
    } 
    if (rows.length) {
      console.log('Return assignments');
      console.log(rows);
      response.end(JSON.stringify(rows));
    } else {
      var data = JSON.stringify([{assignmentName: "This teacher hasn\'t created any assignments. No homework for you!", id: 'yaynohomework'}]);
      response.end(data);
    }
  })
};

module.exports.getAllTeachers = function(request, response, db){
  db.query('SELECT name FROM Users where isTeacher = 1', function(error, rows, fields){
    if (error) { console.log(error); }
    console.log(rows);
    response.end(JSON.stringify(rows));
  });
};

module.exports.joinClass = function(request, response, db){
  var student = request.user;
  var teacher = request.params.teacher;
  console.log(request.user);
  db.query('SELECT id FROM USERS WHERE name = ?', [teacher], function(error, rows, fields){
   if (error){
     response.end(error);
   } else {
      db.query('INSERT INTO Student_Teachers (id_Teachers, id_Students) VALUES (?, ?)', [rows[0].id, student.id], function(error){
        if (error){ 
          console.log(error); 
          response.end("Error joining class");
        }
        else { 
          console.log("Success");
          response.end("Joined class successfully.");
        }
      });
    }
  });
};

module.exports.allClasses = function(request, response, db){
  //I want to get all the names that are associated with that user
  db.query('SELECT name FROM Users JOIN Student_Teachers on Users.id = Student_Teachers.id_teachers where Student_Teachers.id_students = ?', 
    [request.user.id], function(error, rows, fields){
      if (error){
        console.log(error);
        response.end(error);
      } else {
        console.log('classes', rows);
        response.end(JSON.stringify(rows));
      }
    })
}



// SELECT column_name(s)
// FROM table1
// JOIN table2
// ON table1.column_name=table2.column_name;
