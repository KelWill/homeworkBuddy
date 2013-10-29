/*global homeworkBuddy, Backbone, JST*/

homeworkBuddy.Views = homeworkBuddy.Views || {};

(function () {
    'use strict';

    homeworkBuddy.Views.QuestionSetView = Backbone.View.extend({
        
        //basically a large div that will be used for showAll
        template: JST['app/scripts/templates/QuestionSetView.ejs'], 

        initialize: function(){
          this.collection.on('add', function(question){
            console.log(question);
            this.addOne(question);
          });
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
              questionView = new homeworkBuddy.Views.MCCreationView();
              return this;
          } else if (question.questionType === 'ShortAnswer') {
              questionView = new homeworkBuddy.Views.ShortAnswerCreationView();
          } else if (question.questionType === 'FillBlank') {
              questionView = new homeworkBuddy.Views.FillBlankCreationView();
          }
          questionView.render();
          return this;
        }
        
    });

})();
