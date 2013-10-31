/*global homeworkBuddy, Backbone, JST*/

homeworkBuddy.Views = homeworkBuddy.Views || {};
homeworkBuddy.templates = homeworkBuddy.templates || {};
(function () {
    'use strict';


    homeworkBuddy.Views.QuestionCreationView = Backbone.View.extend({

      events: {
        'click button': 'saveQuestion',
        }, 

      hide: function(){
        this.$el.remove();
      },



      saveQuestion: function(){
        //for now just handles MC questions
        //TODO refactor into different views
        var question = $('#question').val();
        var answerOptions = [];
        answerOptions.push($('.A').val());
        answerOptions.push($('.B').val());
        answerOptions.push($('.C').val());
        answerOptions.push($('.D').val());
        
        var correctAnswer = $('.correct').val();
        this.model.set({question: question, answerOptions: answerOptions, correctAnswer: correctAnswer});
        this.$el.remove();
        this.model.trigger('questionEntered');
      },

      render: function(){
      }
    });

    homeworkBuddy.Views.MCCreationView = homeworkBuddy.Views.QuestionCreationView.extend({
        template: _.template(homeworkBuddy.templates.MCCreation),
        initialize: function(){
          this.model.on('stopEdit', function(){ this.hide(); }, this)
        },
        render: function(){
          this.$el.append(this.template(this.model.attributes));
          return this;
        }
    });

    homeworkBuddy.Views.FillBlankCreationView = Backbone.View.extend({
        template: _.template(homeworkBuddy.templates.FillBlankCreation),
        initialize: function(){
          this.model.on('stopEdit', function(){ this.hide(); }, this)
        },
        render: function(){
          this.$el.append(this.template(this.model.attributes));
          return this;
        }
    });

    homeworkBuddy.Views.ShortAnswerCreationView = Backbone.View.extend({
        template: _.template(homeworkBuddy.templates.ShortAnswerCreation),
        initialize: function(){
          this.model.on('stopEdit', function(){ this.hide(); }, this)
        },
        render: function(){
          this.$el.append(this.template(this.model.attributes));
          return this;
        }
    });

})();

