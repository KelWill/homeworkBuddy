module.exports.grade = function(request, response, db){
  var assignment = request.params.assignmentName;
  var teacherId = request.user.id
  var results = {};
  results.assignmentName = assignment;
  db.query("SELECT Assignments.id FROM Assignments JOIN Users on Assignments.id_Teachers = Users.id where Users.id = ? and Assignments.assignmentName = ?",  
    [teacherId, assignment], function(error, rows, fields){
      if (error) { console.log(error); }
      console.log(rows);
      if (rows && rows.length){
        results.assignmentId = rows[0].id;
        getGrades(rows[0].id);
      } else {
        console.log(results.assignmentName);
        console.log(request.user.id);
        response.writeHead(401);
        response.end("Are you the teacher that wrote that assignment?");
      }
    });

  var getGrades = function(assignmentId){
    db.query('SELECT CONVERT(QuestionText USING UTF8) as QuestionText, paragraph_id, id, QuestionAnswer FROM Questions where id_Assignments = ?', 
      [assignmentId], 
      function(error, rows, fields){
        if (error) { 
         console.log("ERROR");
         console.log(error);
         response.writeHead(500);
         response.end('We messed up, sorry. Try again later.')
        }
        else {
          results.questions = rows;
          db.query('SELECT CONVERT (StudentAnswer USING UTF8) as StudentAnswer, Student_Questions.id_questions\
                   , correct, Users.name FROM Student_Questions JOIN Questions ON Questions.id = Student_Questions.id_Questions\
                   JOIN Users ON Users.id = Student_Questions.id_Students WHERE \
                   Student_Questions.fromAssignment = 1 and Questions.id_Assignments = ?', [assignmentId], function(error, rows, fields){
              if (error) { 
                console.log("ERROR");
                console.log(error);
                response.writeHead(500);
                response.end('We messed up, sorry. Try again later.')
               } else {
                results.studentData = rows;
                results = JSON.stringify(results);
                response.end(results);
               }
            });
        }
    });
  };
}