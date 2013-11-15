/*global homeworkBuddy, Backbone, JST*/

homeworkBuddy.Views = homeworkBuddy.Views || {};

(function () {
    'use strict';

    homeworkBuddy.Views.QuestionSetView = Backbone.View.extend({
        
        //basically a large div that will be used for showAll
        // template: new ejs({url: 'app/scripts/templates/QuestionSetView.ejs'}), 
        events:{
          'click a.MC': 'addMC', 
          'click a.ShortAnswer': 'addShortAnswer', 
          'click a.FillBlank': 'addFillBlank', 
        },

        questionOptions: '<span class = "questionOptions"><a href = "#" class = "MC question">Add Multiple Choice</a><br><a href = "#" class = "ShortAnswer question">Add Short Answer</a><br>\
                        <a href = "#" class = "FillBlank question">Add Fill in the Blank<br></a></span><span class = "addedQuestions"></span>\
                        <div class = "questionForm"></div>',

        initialize: function(){
          this.$el.html(this.questionOptions);

          this.collection.on('add', function(model, collection){
            this.addOne(model);
          }, this);

          this.collection.on('editQuestion', function(question){
            this.addOne(question);
          }, this);

          this.collection.on('change', function(model, collection){
            //view.render();
          }, this);

          this.collection.on('questionAdded', function(question){
            if (!question.get('rendered')){
              var completedQuestionView = new homeworkBuddy.Views.CompletedQuestion({model: question});
              this.$el.find('span.addedQuestions').append(completedQuestionView.render().el);
            }
          }, this);

        },

        render: function(){
          this.$el.find('span.questionOptions').html(this.questionOptions);
        },

        addMC: function(e){
          e.preventDefault();
          this.collection.addMC();
        }, 
        
        addShortAnswer: function(e){
          e.preventDefault();
          this.collection.addShortAnswer();
        }, 
        
        addFillBlank: function(e){
          e.preventDefault();
          this.collection.addFillBlank();
        },

        //addOne takes a question model and renders it and places it in the dom
        addOne: function(question){
          var questionView;
          if (question.questionType === 'MC'){
            questionView = new homeworkBuddy.Views.MCCreationView({model: question});
          } else if (question.questionType === 'ShortAnswer') {
            questionView = new homeworkBuddy.Views.ShortAnswerCreationView({model: question});
          } else if (question.questionType === 'FillBlank') {
            questionView = new homeworkBuddy.Views.FillBlankCreationView({model: question});
          }
          questionView.render();
          this.$el.find('.questionForm').append(questionView.el);
          return this;
        }
        
    });

})();
