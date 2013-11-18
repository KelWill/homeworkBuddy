homeworkBuddy.Views.QuestionSetView = Backbone.View.extend({
  initialize: function(){
    this.collection.on('add', function(q){
      this.renderQuestion(q);
    }, this);
  },

  addSubmit: function(){
    this.$el.append("<button class = 'submit review btn-success btn btn-lg pull-right'>Check and Submit</button>")
  }, 

  events: {
    'click button.submit.review' : 'checkAndSubmit'
  },

  checkAndSubmit: function(){
    this.collection.checkAndSubmit();
  },

  renderQuestion: function(q){
    var qView;
    if (q.get('questionType') === "MC"){
      qView = new homeworkBuddy.Views.MCQuestionView({model: q});
    } else if (q.get('questionType') === "ShortAnswer"){
      qView = new homeworkBuddy.Views.ShortAnswerQuestionView({model: q});
    } else if (q.get('questionType') === "FillBlank"){
      qView = new homeworkBuddy.Views.FillBlankQuestionView({model: q});
    }
    qView.render();
    this.$el.append(qView.el);
  }
});

homeworkBuddy.Views.AssignmentView = Backbone.View.extend({

  initialize: function(){
   this.$el = $('#container');

   this.collection.on('add', function(p){
      this.addOne(p);
    }, this);

    this.collection.on('questionsAdded', function(){
      this.forEach(function(paragraph){
        paragraph.trigger('complete');
        paragraph.trigger('renderQuestions');
      });
    })
  }, 

  addOne: function(paragraph){
    var paragraphView = new homeworkBuddy.Views.ParagraphView({model: paragraph});
    paragraphView.render();
  }
});
