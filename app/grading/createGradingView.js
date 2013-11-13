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
  var question, name, student, formattedQuestion, temp;
  for ( var i = 0; i < questions.length; i++ ){
    question = questions[i];
    formattedQuestion = {};
    formattedQuestion.id = question.id;
    formattedQuestion.QuestionAnswer = question.QuestionAnswer || undefined;
    temp = JSON.parse(question.QuestionText);
    formattedQuestion = _.extend(formattedQuestion, temp);
    formattedQuestion.number = i + 1;
    console.log('question', formattedQuestion);

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
};

homeworkBuddy.Models.Student = Backbone.Model.extend({
  initialize: function(){
    this.questions = new homeworkBuddy.Collections.StudentAnswers();
    console.log('a new student has been initialized');
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
     console.log('rendering a question!')
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
     }, this)
   },

   questionTemplate: _.template('<p><%= number %>. <%= question %></p>\
     <div class = "A answer option">A: <%= answerOptions[0] %></div>\
     <div class = "B answer option">B: <%= answerOptions[1] %></div>\
     <div class = "C answer option">C: <%= answerOptions[2] %></div>\
     <div class = "D answer option">D: <%= answerOptions[3] %></div>\
     <div class = "answer option"><% if (QuestionAnswer) { print ("Correct Answer: " + QuestionAnswer) } %></div>'
     ),

   percentTemplate: _.template('<div class = "percentageCorrect answer option"><% if (timesAnswered) { print("Pecentage Correct: " + (timesCorrect/timesAnswered * 100) + "%") }%></div>'),

   render: function(){
     this.$el.append(this.questionTemplate(this.model.attributes));
     this.renderPercent();
     return this;
   },
   renderPercent: function(){
     this.$el.append(this.percentTemplate(this.model));
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
    }
  }
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

homeworkBuddy.students = new homeworkBuddy.Collections.Students();
homeworkBuddy.students.model = homeworkBuddy.Models.Student;
homeworkBuddy.allQuestions = new homeworkBuddy.Collections.AllQuestions();
homeworkBuddy.allQuestions.model = homeworkBuddy.Models.Question;
homeworkBuddy.allQuestionsView = new homeworkBuddy.Views.AllQuestionsView({collection: homeworkBuddy.allQuestions});
homeworkBuddy.percentCorrectViews = new homeworkBuddy.Views.PercentCorrectViews({collection: homeworkBuddy.allQuestions});
//so, when I add a question to a student, I need to also trigger an event that will trickle up to the AllQuestionsModel
//that has attributes on it that display percentage correct