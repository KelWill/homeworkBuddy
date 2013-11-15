/*global homeworkBuddy, Backbone, JST*/

homeworkBuddy.Views = homeworkBuddy.Views || {};
homeworkBuddy.templates = homeworkBuddy.templates || {};
(function () {
    'use strict';


    homeworkBuddy.Views.QuestionCreationView = Backbone.View.extend({

      events: {
        'click button': 'saveQuestion',
      }, 

      click: function(){
        debugger;
      },

      render: function(){
      },

      saveQuestion: function(){
        //for now just handles MC questions
        //TODO refactor into different views
        this.save();

        //finishing editing the form
        this.model.trigger('stopEdit');
        this.model.trigger('questionAdded', this.model);
      },

    });

    //can refactor to put initialize and render in the parent view, and leave template in the child
    homeworkBuddy.Views.MCCreationView = homeworkBuddy.Views.QuestionCreationView.extend({
        template: _.template(homeworkBuddy.templates.MCCreation),

        save: function(){
          var question = $('.text.MC').val();
          var answerOptions = [];
          answerOptions.push($('.A').val());
          answerOptions.push($('.B').val());
          answerOptions.push($('.C').val());
          answerOptions.push($('.D').val());
          var correctAnswer = $('input:radio[name=correct]:checked').val();

          this.model.saveQuestion({question: question, answerOptions: answerOptions, correctAnswer: correctAnswer});
        },
        
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

    homeworkBuddy.Views.FillBlankCreationView = homeworkBuddy.Views.QuestionCreationView.extend({
        template: _.template(homeworkBuddy.templates.FillBlankCreation),

        className: "FB",

        save: function(){
          var preText = $('.preText').val();
          var postText = $('.postText').val();
          var answer = $('.answer').val();

          this.model.saveQuestion({preText: preText, postText: postText, answer: answer});
        },

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

    homeworkBuddy.Views.ShortAnswerCreationView = homeworkBuddy.Views.QuestionCreationView.extend({
        template: _.template(homeworkBuddy.templates.ShortAnswerCreation),

        className: "SA",

        save: function(){
          var min = $('.min').val();
          var max = $('.max').val();
          var question = $('.text.question').val();

          this.model.saveQuestion({min: min, max: max, question: question});
        },
        
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

