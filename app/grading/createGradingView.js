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
  //
  data = JSON.parse(data);
  var assignmentName = data.assignmentName;
  var questions = data.questions;
  var student_questions = data.studentData;
  var breadcrumbs = homeworkBuddy.students.breadcrumbs
  var question, name, student;
  for ( var i = 0; i < student_questions.length; i++ ){
    question = student_questions[i];
    name = student_questions[i].name;
    if (homeworkBuddy.students.breadcrumbs[name]){
      console.log("name is on breadcrumb, adding to student model");
      student = homeworkBuddy.students.breadcrumbs[name];
      student.questions.addQuestion(student_questions[i]);
    } else {
      student = homeworkBuddy.students.add(student_questions[i].name);
      homeworkBuddy.students.breadcrumbs[student_questions[i].name] = student;
      console.log('this should be a backbone model of a student', student);
    }
  }
};

homeworkBuddy.Models.Student = Backbone.Model.extend({
  initialize: function(){
    this.questions = new homeworkBuddy.Collections.Questions();
  }
})

homeworkBuddy.Collections.Questions = Backbone.Collection.extend({
  initialize: function(){
    this.existingQuestions = {};
  },
  addQuestion: function(question){
    if (!this.existingQuestions[question.id_questions]){
      this.existingQuestions[question.id_questions]
      delete question.name;
      this.add(question);
    }
  }
})

homeworkBuddy.Collections.Students = Backbone.Collection.extend({
  initialize: function(){
    //store reference to model on breadcrumb for easier access
    this.breadcrumbs = {};
  }
})

homeworkBuddy.Collections.StudentAssignment = Backbone.Collection.extend({

});

homeworkBuddy.students = new homeworkBuddy.Collections.Students();
