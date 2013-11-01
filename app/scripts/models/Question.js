/*global homeworkBuddy, Backbone*/

homeworkBuddy.Models = homeworkBuddy.Models || {};

(function () {
    'use strict';

    homeworkBuddy.Models.QuestionModel = Backbone.Model.extend({
      
    });

    //MC questions, Fill in the blank questions, and short answer questions all inherit from 
    //the question model, but have their own particular data
    //these models are all designed for use on the teacher creation side, and so don't include 
    //options for student answer
    homeworkBuddy.Models.MCCreationModel = homeworkBuddy.Models.QuestionModel.extend({
      defaults: {//these are important for editing
        question: "", 
        correctAnswer: "",
        answerOptions:["", "", "", ""]
      },

      initialize: function(options){
      },

      questionType: "MC"
    });


    homeworkBuddy.Models.FillBlankCreationModel = homeworkBuddy.Models.QuestionModel.extend({
      initialize: function(options){
        if (options){
          this.preBlankQuestion = options.preBlankQuestion;
          this.postBlankQuestion = option.postBlankQuestion;
          this.blankLength = options.blankLength || 10;
          this.correctAnswer = options.correctAnswer;
        }
      }, 
      questionType: "FillBlank"
    });


    homeworkBuddy.Models.ShortAnswerCreationModel = homeworkBuddy.Models.QuestionModel.extend({
      initialize: function(options){
        if (options){
          this.question = options.question;
          this.minimumLength = options.minimumLength || 0;
          this.maximumLength = options.maximumLength;
        } 
      }, 
      questionType: "ShortAnswer"
    });


})();
