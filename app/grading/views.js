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
  className: "grading completion input-group-btn pull-right",
  tagName: "div",

  initialize: function(){
    this.$el.append('<button data-toggle = "dropdown" class = "btn btn-default btn-lg btn-primary dropdown-toggle pull-right">Students<span class="caret"></span></button>');
    this.$el.append('<ul class="dropdown-menu pull-right"></ul>');
    this.collection.forEach(function(student){
      var view = new homeworkBuddy.Views.CompletedStudent({model: student});
      this.$el.find('ul').append(view.render().el);
    }, this);
    this.render();
    $('.dropdown-toggle').dropdown();
  },

  
  render: function(){
    $('#container').prepend(this.el);
  }
});

homeworkBuddy.Views.CompletedStudent = Backbone.View.extend({
  events: {
    'click': 'displayStudentAnswers'
  },

  tagName: 'li',

  displayStudentAnswers: function(){
    this.$el.parent().children().removeClass('active');
    this.$el.addClass('active');
    this.model.questions.forEach(function(question){
        homeworkBuddy.allQuestions.breadcrumbs[question.get('id_questions')].trigger('studentAnswers', question);
    });
  },

  render: function(){
    this.$el.append('<a href = "#" class = "list-group-item">' + this.model.get('name') +  ' <span class = "badge"> ' + this.model.get('questionsCorrect')  + ' / ' + this.model.get('questionsAnswered') + '</span></a>');
    return this;
  }
});