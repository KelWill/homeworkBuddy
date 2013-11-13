homeworkBuddy.createGradingView = function(data){
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
  $('.container').html(homeworkBuddy.allQuestionsView.el);
  homeworkBuddy.percentCorrectViews.render();
  homeworkBuddy.completed = new homeworkBuddy.Views.Completed({collection: homeworkBuddy.students});
};

homeworkBuddy.Models.Student = Backbone.Model.extend({
  initialize: function(){
    this.questions = new homeworkBuddy.Collections.StudentAnswers();
    //So that questions can update student grades
    this.questions.student = this;
  }, 

  defaults: {
    questionsCorrect: 0, 
    questionsAnswered: 0
  }, 

  updateTally: function(correct){
    this.set('questionsCorrect', this.get('questionsCorrect') + correct);
    this.set('questionsAnswered', this.get('questionsAnswered') + 1);
  }

});

homeworkBuddy.Collections.AllQuestions = Backbone.Collection.extend({
  initialize: function(){
    this.breadcrumbs = {};
  }
});

homeworkBuddy.Models.Question = Backbone.Model.extend({
  initialize: function(){
    this.timesAnswered = 0; 
    this.timesCorrect = 0;
  },

  updateTally: function(correct){
    this.timesAnswered++;
    if (correct){
      this.timesCorrect++;
    }
  }
});

homeworkBuddy.Views.AllQuestionsView = Backbone.View.extend({
   initialize: function(){
     this.collection.on('add', function(q){
       this.renderQuestion(q);
     }, this);
   },

   percentageCorrect: function(){
   },

   renderQuestion: function(q){
     var qView;
     if (q.get('questionType') === "MC"){
       qView = new homeworkBuddy.Views.GradingMCQuestionView({model: q});
     } else if (q.get('questionType') === "ShortAnswer"){
       qView = new homeworkBuddy.Views.GradingShortAnswerQuestionView({model: q});
     } else if (q.get('questionType') === "FillBlank"){
       qView = new homeworkBuddy.Views.GradingFillBlankQuestionView({model: q});
     }
     qView.render();
     this.$el.append(qView.el);
   }
 });

homeworkBuddy.Views.GradingQuestionView = Backbone.View.extend({
 
});

homeworkBuddy.Views.GradingMCQuestionView = homeworkBuddy.Views.GradingQuestionView.extend({
   initialize: function(){
     this.model.on('addPercentageCorrect', function(){
       this.renderPercent();
     }, this);

     this.model.on('studentAnswers', function(studentAnswer){
      this.studentAnswers(studentAnswer);
    }, this);
   },

   studentAnswers: function(studentAnswer){
     this.$el.find('.answer.option').removeClass("correct").removeClass('incorrect');
     if (studentAnswer.get('correct')){
       this.$el.find('.' + studentAnswer.get('StudentAnswer')).addClass('correct');
     } else {
       this.$el.find('.' + studentAnswer.get('StudentAnswer')).addClass('incorrect');
     }
   },

   questionTemplate: _.template('<p><%= number %>. <%= question %></p>\
     <div class = "A answer option">A: <%= answerOptions[0] %></div>\
     <div class = "B answer option">B: <%= answerOptions[1] %></div>\
     <div class = "C answer option">C: <%= answerOptions[2] %></div>\
     <div class = "D answer option">D: <%= answerOptions[3] %></div>\
     <div class = "answer option"><% if (QuestionAnswer) { print ("Correct Answer: " + QuestionAnswer) } %></div>\
     <div class = "percentageCorrect answer option"></div>'
     ),

   percentTemplate: _.template('<% if (timesAnswered) { print("Pecentage Correct: " + (timesCorrect/timesAnswered * 100) + "%") }%>'),

   render: function(){
     this.$el.append(this.questionTemplate(this.model.attributes));
     this.renderPercent();
     return this;
   },
   renderPercent: function(){
     this.$el.find('.percentageCorrect').html(this.percentTemplate(this.model));
    }
 });

homeworkBuddy.Views.GradingShortAnswerQuestionView = homeworkBuddy.Views.GradingQuestionView.extend({
   initialize: function(){
   },
   questionTemplate: _.template('<%= number %><h4><%= question %></h4>\
     <textarea class = "answer" value = "<%=answer%>" />'), 

   render: function(){
     this.$el.append(this.questionTemplate(this.model.attributes));
     return this;
   }
 });

homeworkBuddy.Views.GradingFillBlankQuestionView = homeworkBuddy.Views.GradingQuestionView.extend({
   initialize: function(){
   },

   questionTemplate: _.template('<%= number %><h4><%= preText %><input type = "text" class = "answer" value = "<%=answer%>"><%= postText %></h4>'),

   render: function(){
     this.$el.append(this.questionTemplate(this.model.attributes));
     return this;
   }
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
      homeworkBuddy.allQuestions.breadcrumbs[question.id_questions].updateTally(question.correct);
      this.student.updateTally(question.correct);
    }
  },
});

homeworkBuddy.Views.PercentCorrectViews = Backbone.View.extend({
  initialize: function(){
    this.collection.forEach(function(model){
      var percentCorrectView = new homeworkBuddy.Views.PercentCorrectView({model: model});
      this.$el.append(percentCorrectView.render().el);
    }, this);
  }, 

  render: function(){
    this.collection.forEach(function(question){
      question.trigger('addPercentageCorrect');
    });
  },
})

homeworkBuddy.Views.PercentCorrectView = Backbone.View.extend({
  initialize: function(){
    this.model.on('upd', function(question){
      this.render();
    }, this)
  }, 

  template: _.template('<div class = "percentageCorrect answer option"><% if (timesAnswered) { print(timesAnswered/timesCorrect * 100) }%></div>'),


  render: function(){
    this.$el.html(this.template(this));
    return this;
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

homeworkBuddy.Views.Completed = Backbone.View.extend({
  initialize: function(){
    this.$el.append('Students who submitted the assignment:')
    this.collection.forEach(function(student){
      var view = new homeworkBuddy.Views.CompletedStudent({model: student});
      this.$el.append(view.render().el);
    }, this);
    this.render();
  },

  
  render: function(){
    $('.container').prepend(this.el);
  }
});

homeworkBuddy.Views.CompletedStudent = Backbone.View.extend({
  events: {
    'click': 'displayStudentAnswers'
  },

  tagName: 'el',

  displayStudentAnswers: function(){
    $('.currentView').html('<h4>' + this.model.get('name') + '</h4>');
    this.model.questions.forEach(function(question){
        homeworkBuddy.allQuestions.breadcrumbs[question.get('id_questions')].trigger('studentAnswers', question);
    });
  },

  render: function(){
    this.$el.append(' <em>' + this.model.get('name') + ' (<em><strong> ' + this.model.get('questionsCorrect')  + ' / ' + this.model.get('questionsAnswered') + '</strong><em> )</em> || ');
    return this;
  }
});



homeworkBuddy.students = new homeworkBuddy.Collections.Students();
homeworkBuddy.students.model = homeworkBuddy.Models.Student;
homeworkBuddy.allQuestions = new homeworkBuddy.Collections.AllQuestions();
homeworkBuddy.allQuestions.model = homeworkBuddy.Models.Question;
homeworkBuddy.allQuestionsView = new homeworkBuddy.Views.AllQuestionsView({collection: homeworkBuddy.allQuestions});
homeworkBuddy.percentCorrectViews = new homeworkBuddy.Views.PercentCorrectViews({collection: homeworkBuddy.allQuestions});
