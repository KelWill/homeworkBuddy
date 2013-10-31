/*global homeworkBuddy, Backbone, JST*/

homeworkBuddy.Views = homeworkBuddy.Views || {};

(function () {
    'use strict';

    homeworkBuddy.Views.QuestionSetView = Backbone.View.extend({
        
        //basically a large div that will be used for showAll
        // template: new ejs({url: 'app/scripts/templates/QuestionSetView.ejs'}), 
        events:{
          'click a.MC': 'addMC', 
          'click a.addShortAnswer': 'addShortAnswer', 
          'click a.addFillBlank': 'addFillBlank', 
        },

        addMC: function(){
          this.collection.addMC();
        }, 
        
        addShortAnswer: function(){
          this.collection.addShortAnswer();
        }, 
        
        addFillBlank: function(){
          this.collection.addFillBlank();
        },
        questionOptions: '<a href = "#" class = "MC question">Add MC</a><br><a class = "ShortAnswer question">Add Short Answer</a><br>\
                        <a class = "FillBlank question">Add Fill in the Blank<br></a>',

        initialize: function(){
          var view = this;

          this.collection.on('add', function(model, collection){
            view.addOne(model);
          });

          this.collection.on('editQuestion', function(question){
            view.addOne(question);
          });

          this.collection.on('change', function(model, collection){
            view.render();
          });

          this.$el.html(this.questionOptions);
        },
        
        //this function will be called when going back to edit a previously created assignment
        //or if the user wishes to see all the questions in a div
        
        render: function(){
          this.$el.find('span.addQuestion').show();
          this.$el.html('');
          this.$el.html(this.questionOptions);
          this.collection.forEach(function(question){
            var completedQuestionView = new homeworkBuddy.Views.CompletedQuestion({model: question});
          }, this);
          this.collection.on('questionAdded', function(completedQuestionView){
            console.log('questionAdded was triggered');
            this.$el.append(completedQuestionView.render().el)
          }, this);
        },

        showAll: function(){
          //to write later
        },

        //add one takes care of rendering the view, logic of placing it into the DOM
        //will reside with the route controller
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
          $(this.el).append(questionView.el);
          return this;
        }
        
    });

})();
