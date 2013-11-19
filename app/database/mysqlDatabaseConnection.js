mysql = require('mysql');
db  = mysql.createConnection({
  host     : 'hwbudinstance.chyvty6z8uea.us-west-1.rds.amazonaws.com',
  user     : 'secret',
  password : 'secret'
});

db.connect();

db.query('Use hwbud');
    
db.query("CREATE TABLE Users (\
  id SMALLINT NULL AUTO_INCREMENT DEFAULT NULL,\
  name VARCHAR(30) NULL DEFAULT NULL,\
  email VARCHAR(30) NULL DEFAULT NULL,\
  isTeacher TINYINT(1) NULL DEFAULT 0,\
  password_hash VARCHAR(30) NULL DEFAULT NULL,\
  password_salt VARCHAR(30) NULL DEFAULT NULL,\
  review_session TINYINT NULL DEFAULT 1,\
  PRIMARY KEY (id));", function(error){
    if (error) { console.log(error); }
    else (console.log("SUCCESS"));
  });

db.query("CREATE TABLE Assignments (\
  id SMALLINT NULL AUTO_INCREMENT DEFAULT NULL,\
  id_Teachers SMALLINT NULL DEFAULT NULL,\
  CorrectAnswers BLOB NULL DEFAULT NULL,\
  assignmentName VARCHAR(30),\
  PRIMARY KEY (id)\
);", function(error){
    if (error) { console.log(error); }
    else (console.log("SUCCESS"));
  });

db.query("CREATE TABLE HW (\
  id SMALLINT NULL AUTO_INCREMENT DEFAULT NULL,\
  id_Students SMALLINT NULL DEFAULT NULL,\
  id_Assignments SMALLINT NULL DEFAULT NULL,\
  StudentAnswers BLOB DEFAULT NULL,\
  PRIMARY KEY (id)\
);", function(error){
    if (error) { console.log(error); }
    else (console.log("SUCCESS"));
  });

db.query("CREATE TABLE Questions (\
  id SMALLINT NULL AUTO_INCREMENT DEFAULT NULL,\
  id_Assignments SMALLINT NULL DEFAULT NULL,\
  QuestionText BLOB NULL DEFAULT NULL,\
  QuestionAnswer VARCHAR(10) NULL DEFAULT NULL,\
  paragraph_id VARCHAR(30) NULL DEFAULT NULL,\
  QuestionType VARCHAR(20) NULL DEFAULT NULL,\
  PRIMARY KEY (id)\
);", function(error){
    if (error) { console.log(error); }
    else (console.log("SUCCESS"));
  })

db.query("CREATE TABLE Paragraphs (\
  id SMALLINT NULL AUTO_INCREMENT DEFAULT NULL,\
  id_Assignments SMALLINT NULL DEFAULT NULL,\
  text BLOB NULL DEFAULT NULL,\
  paragraph_id VARCHAR(30) NULL DEFAULT NULL,\
  PRIMARY KEY (id)\
);", function(error){
    if (error) { console.log(error); }
    else (console.log("SUCCESS"));
  });

db.query("CREATE TABLE Student_Questions (\
  id SMALLINT NULL AUTO_INCREMENT DEFAULT NULL,\
  id_Questions SMALLINT DEFAULT NULL,\
  id_Students SMALLINT DEFAULT NULL,\
  Correct TINYINT(1) NULL DEFAULT NULL,\
  StudentAnswer BLOB NULL DEFAULT NULL,\
  streak TINYINT NULL DEFAULT 0,\
  PRIMARY KEY (id)\
);", function(error){
    if (error) { console.log(error); }
    else (console.log("SUCCESS"));
  });

db.query("CREATE TABLE Student_Teachers (\
  id SMALLINT NULL AUTO_INCREMENT DEFAULT NULL,\
  id_Teachers SMALLINT NULL DEFAULT NULL,\
  id_Students SMALLINT NULL DEFAULT NULL,\
  PRIMARY KEY (id)\
);", function(error){
    if (error) { console.log(error); }
    else (console.log("SUCCESS"));
  });


db.query("ALTER TABLE HW ADD FOREIGN KEY (id_Assignments) REFERENCES Assignments (id);"
, function(error){ 
  if (error) {console.log(error); }
  else { console.log("SUCCESS"); } 
});

db.query('show tables', function(error, response){
  if (error) { console.log(error) }
  else {console.log(response)}
})


ALTER TABLE Assignments ADD FOREIGN KEY (id_Teachers) REFERENCES Users (id);\
ALTER TABLE Paragraphs ADD FOREIGN KEY (id_Assignments) REFERENCES Assignments (id);\
ALTER TABLE Questions ADD FOREIGN KEY (id_Assignments) REFERENCES Assignments (id);\
ALTER TABLE Student_Questions ADD FOREIGN KEY (id_Questions) REFERENCES Questions (id);\
ALTER TABLE Student_Questions ADD FOREIGN KEY (id_Students) REFERENCES Users (id);\
ALTER TABLE Student_Teachers ADD FOREIGN KEY (id_Teachers) REFERENCES Users (id);\
ALTER TABLE Student_Teachers ADD FOREIGN KEY (id_Students) REFERENCES Users (id);\
ALTER TABLE HW ADD FOREIGN KEY (id_Students) REFERENCES Users (id);\
ALTER TABLE HW ADD FOREIGN KEY (id_Assignments) REFERENCES Assignments (id);\