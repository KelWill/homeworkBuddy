homeworkBuddy.createGradingView = function(data){
  homeworkBuddy.students = new homeworkBuddy.Collections.Students();
  homeworkBuddy.students.model = homeworkBuddy.Models.Student;
  homeworkBuddy.allQuestions = new homeworkBuddy.Collections.AllQuestions();
  homeworkBuddy.allQuestions.model = homeworkBuddy.Models.Question;
  homeworkBuddy.allQuestionsView = new homeworkBuddy.Views.AllQuestionsView({collection: homeworkBuddy.allQuestions});
  homeworkBuddy.percentCorrectViews = new homeworkBuddy.Views.PercentCorrectViews({collection: homeworkBuddy.allQuestions});

  data = JSON.parse(data);
  var assignmentName = data.assignmentName;
  var questions = data.questions;
  var student_questions = data.studentData;
  var breadcrumbs = homeworkBuddy.students.breadcrumbs
  var question, name, student, formattedQuestion, temp;
  for ( var i = 0; i < questions.length; i++ ){
    question = questions[i];
    formattedQuestion = {};
    formattedQuestion.id = question.id;
    formattedQuestion.QuestionAnswer = question.QuestionAnswer || undefined;
    temp = JSON.parse(question.QuestionText);
    formattedQuestion = _.extend(formattedQuestion, temp);
    formattedQuestion.number = i + 1;

    homeworkBuddy.allQuestions.add(formattedQuestion);
    question = homeworkBuddy.allQuestions.at(homeworkBuddy.allQuestions.length - 1);
    homeworkBuddy.allQuestions.breadcrumbs[formattedQuestion.id] = question;
  }
  for ( var i = student_questions.length - 1; i >= 0; i-- ){
    question = student_questions[i];
    name = student_questions[i].name;
    if (homeworkBuddy.students.breadcrumbs[name]){
      student = homeworkBuddy.students.breadcrumbs[name];
      student.questions.addQuestion(student_questions[i]);
    } else {
      homeworkBuddy.students.add([{'name': name}]);
      student = homeworkBuddy.students.at(homeworkBuddy.students.length - 1);
      homeworkBuddy.students.breadcrumbs[name] = student;
    }
  }
  $('#container').html(homeworkBuddy.allQuestionsView.el);
  homeworkBuddy.percentCorrectViews.render();
  homeworkBuddy.completed = new homeworkBuddy.Views.Completed({collection: homeworkBuddy.students});
  homeworkBuddy.percentCorrectViews.sortByDifficulty();
};

