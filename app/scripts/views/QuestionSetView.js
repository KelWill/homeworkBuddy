/*global homeworkBuddy, Backbone, JST*/

homeworkBuddy.Views = homeworkBuddy.Views || {};

(function () {
    'use strict';

    homeworkBuddy.Views.QuestionSetView = Backbone.View.extend({
        
        //basically a large div that will be used for showAll
        // template: new ejs({url: 'app/scripts/templates/QuestionSetView.ejs'}), 
        events:{
        //this looks for events on the view element that is associated with this view
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
        
        initialize: function(){
          this.$el= $('.container');
          
          var view = this;
                   
          this.collection.on('add', function(model, collection){
            view.addOne(model);
          });

          $('a.MC').on('click', function(e){ 
            view.addMC() 
          });

          $('a.ShortAnswer').on('click', function(e){ view.addShortAnswer() });
          $('a.FillBlank').on('click', function(e){ view.addFillBlank() });
        },
        
        //this function will be called when going back to edit a previously created assignment
        //or if the user wishes to see all the questions in a div
        render: function(){
          this.collection.forEach(function(question){
            addOne(question);
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
            console.log(homeworkBuddy.Views.MCCreationView.render);
            questionView = new homeworkBuddy.Views.MCCreationView({model: question});
          } else if (question.questionType === 'ShortAnswer') {
            console.log('question type is short answer');
            questionView = new homeworkBuddy.Views.ShortAnswerCreationView({model: question});
          } else if (question.questionType === 'FillBlank') {
            console.log('question type is fill in the blank');
            questionView = new homeworkBuddy.Views.FillBlankCreationView({model: question});
          }
          questionView.render();
          $('.container').append(questionView.el);
          return this;
        }
        
    });

})();
