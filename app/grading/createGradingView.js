  //
homeworkBuddy.createGradingView = function(data){
  //create a model that has one collection
    //a collection of students with their test data and with test questions as attributes on the collection/as defaults

    //each student has a collection of questions on it

    //model views:
      //questions + student answers
      //grades for each student
    //collection views
      //list of students who completed / submitted the assignment
      //list of question numbers + percentage who got it correct (do numbers with orderBy on server if necessary)
      //stretch = graph

  //notes: need to do some breadcrumbing so only get one assignment for each student
  //(go backwards through data so just get most recent)
  data = JSON.parse(data);
  var assignmentName = data.assignmentName;
  var questions = data.questions;
  var student_questions = data.studentData;
  var breadcrumbs = homeworkBuddy.students.breadcrumbs
  var question, name, student;
  for ( var i = 0; i < questions.length; i++ ){
    question = questions[i];
    console.log('question', question);
  }
  for ( var i = student_questions.length - 1; i >= 0; i-- ){
    question = student_questions[i];
    name = student_questions[i].name;
    console.log('name', name);
    if (homeworkBuddy.students.breadcrumbs[name]){
      console.log("name is on breadcrumb, adding to student model");
      student = homeworkBuddy.students.breadcrumbs[name];
      student.questions.addQuestion(student_questions[i]);
    } else {
      homeworkBuddy.students.add([{'name': name}]);
      student = homeworkBuddy.students.at(homeworkBuddy.students.length - 1);
      homeworkBuddy.students.breadcrumbs[name] = student;
      debugger;
      console.log('this should be a backbone model of a student', student);
    }
  }
};

homeworkBuddy.Models.Student = Backbone.Model.extend({
  initialize: function(){
    this.questions = new homeworkBuddy.Collections.StudentAnswers();
    console.log('a new student has been initialized');
  }
});

homeworkBuddy.Collections.AllQuestions = Backbone.Collection.extend({
});

homeworkBuddy.Collections.Question = Backbone.Collection.extend({
});

homeworkBuddy.Collections.StudentAnswers = Backbone.Collection.extend({
  initialize: function(){
    this.existingAnswers = {};
  },
  addQuestion: function(question){
    if (!this.existingAnswers[question.id_questions]){
      this.existingAnswers[question.id_questions] = true;
      delete question.name;
      this.add(question);
    }
  }
});

homeworkBuddy.Models.StudentAnswer = Backbone.Model.extend({
  //the values it should have are correct, student answer, and id_questions and it
  //should be in a collection on a student model that has a name attribute
});

homeworkBuddy.Collections.Students = Backbone.Collection.extend({
  initialize: function(){
    //store reference to model on breadcrumb for easier access
    this.breadcrumbs = {};
  }
})

homeworkBuddy.Collections.StudentAssignment = Backbone.Collection.extend({

});

homeworkBuddy.students = new homeworkBuddy.Collections.Students();
homeworkBuddy.students.model = homeworkBuddy.Models.Student;
