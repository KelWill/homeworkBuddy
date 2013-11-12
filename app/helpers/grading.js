module.exports.grade = function(request, response, db){
  var assignment = request.params.assignmentName;
  var teacherId = request.user.id
  db.query("SELECT Assignments.id FROM Assignments JOIN Users on Assignments.id_Teachers = Users.id where Users.id = ? and Assignments.assignmentName = ?",  
    [teacherId, assignment], function(error, rows, fields){
      if (error) { console.log(error); }
      console.log(rows);
      if (rows && rows.length){
        getGrades(rows[0].id);
      } else {
        response.writeHead(401);
        response.end("Are you the teacher that wrote that assignment?");
      }
    });

  //maybe split this query into two--I'm sending a copy of the questionText for each to the students, and that's too much data
  //should probably also grab students' names
  var getGrades = function(assignmentId){
    db.query('SELECT CONVERT(QuestionText USING UTF8) as QuestionText, id_Students, CONVERT(StudentAnswer USING UTF8) as StudentAnswer, correct FROM Student_Questions JOIN Questions on Student_Questions.id_Questions = Questions.id where Questions.id_Assignments = ? and fromAssignment = 1', 
      [assignmentId], 
      function(error, rows, fields){
        if (error) { 
         console.log("ERROR");
         console.log(error);
         response.writeHead(500);
        }
        console.log(rows);
        response.end(JSON.stringify(rows));
    });
  };
}