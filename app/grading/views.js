homeworkBuddy.Views.AllQuestionsView = Backbone.View.extend({
  className: "grading",
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

homeworkBuddy.Views.Completed = Backbone.View.extend({
  className: "grading completion",
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
  className: "grading",

  displayStudentAnswers: function(){
    this.$el.find('.currentStudent').html('<h4>' + this.model.get('name') + '</h4>');
    this.model.questions.forEach(function(question){
        homeworkBuddy.allQuestions.breadcrumbs[question.get('id_questions')].trigger('studentAnswers', question);
    });
  },

  render: function(){
    this.$el.append('<br> <em>' + this.model.get('name') + ' (<em><strong> ' + this.model.get('questionsCorrect')  + ' / ' + this.model.get('questionsAnswered') + '</strong><em> )</em> ');
    return this;
  }
});


// homeworkBuddy.Views.PercentCorrectView = Backbone.View.extend({
//   initialize: function(){
//     this.model.on('update', function(question){
//       this.render();
//     }, this)
//   }, 

//   template: _.template('<div class = "percentageCorrect answer option"><% if (timesAnswered) { print(timesAnswered/timesCorrect * 100) }%></div>'),


//   render: function(){
//     this.$el.html(this.template(this));
//     return this;
//   }
// });