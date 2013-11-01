/*global homeworkBuddy, Backbone, JST*/

homeworkBuddy.Views = homeworkBuddy.Views || {};
homeworkBuddy.templates = homeworkBuddy.templates || {};
(function () {
    'use strict';


    homeworkBuddy.Views.QuestionCreationView = Backbone.View.extend({

      events: {
        'click button': 'saveQuestion',
      }, 

      render: function(){
      },

      saveQuestion: function(){
        //for now just handles MC questions
        //TODO refactor into different views
        
        //getting the values from the input boxes
        var question = $('#question').val();
        var answerOptions = [];
        answerOptions.push($('.A').val());
        answerOptions.push($('.B').val());
        answerOptions.push($('.C').val());
        answerOptions.push($('.D').val());
        var correctAnswer = $('input:radio[name=correct]:checked').val();

        //updating the model
        this.model.set({question: question, answerOptions: answerOptions, correctAnswer: correctAnswer});

        //finishing editing the form
        this.model.trigger('stopEdit');
        this.model.trigger('questionAdded', this.model);
      },

    });

    homeworkBuddy.Views.MCCreationView = homeworkBuddy.Views.QuestionCreationView.extend({
        template: _.template(homeworkBuddy.templates.MCCreation),
        
        initialize: function(){
          //when done editing hide this view
          this.model.on('stopEdit', function(){ 
            this.$el.remove();
          }, this);
        },
        
        render: function(){
          this.$el.append(this.template(this.model.attributes));
          return this;
        }
    });

    homeworkBuddy.Views.FillBlankCreationView = Backbone.View.extend({
        template: _.template(homeworkBuddy.templates.FillBlankCreation),
        initialize: function(){
          this.model.on('stopEdit', function(){ 
            this.$el.remove(); 
          }, this)
        },
        render: function(){
          this.$el.append(this.template(this.model.attributes));
          return this;
        }
    });

    homeworkBuddy.Views.ShortAnswerCreationView = Backbone.View.extend({
        template: _.template(homeworkBuddy.templates.ShortAnswerCreation),
        initialize: function(){
          this.model.on('stopEdit', function(){ 
            this.$el.remove();
          }, this)
        },
        render: function(){
          this.$el.append(this.template(this.model.attributes));
          return this;
        }
    });

})();

