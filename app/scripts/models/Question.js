/*global homeworkBuddy, Backbone*/

homeworkBuddy.Models = homeworkBuddy.Models || {};

(function () {
    'use strict';

    homeworkBuddy.Models.QuestionModel = Backbone.Model.extend({
      
    });

    //MC questions, Fill in the blank questions, and short answer questions all inherit from 
    //the question model, but have their own particular data
    homeworkBuddy.Models.MCCreationModel = homeworkBuddy.Models.QuestionModel.extend({
      defaults: {//these are important for editing
        question: "", 
        correctAnswer: "",
        answerOptions:["", "", "", ""]
      },

      initialize: function(options){
      },
      saveQuestion: function(options){
        this.set(options);
      },

      questionType: "MC", 
      questionText: "Multiple Choice"
    });


    homeworkBuddy.Models.FillBlankCreationModel = homeworkBuddy.Models.QuestionModel.extend({
      initialize: function(options){
      }, 

      defaults: {
        preText: "", 
        postText: "", 
        answer: ""
      },

      saveQuestion: function(options){
        this.set(options);
      },
      questionType: "FillBlank", 
      questionText: "Fill in the Blank"
    });


    homeworkBuddy.Models.ShortAnswerCreationModel = homeworkBuddy.Models.QuestionModel.extend({
      initialize: function(options){
      },

      defaults: {
        min: 0,
        max: 100, 
        question: ""
      },
      saveQuestion: function(options){
        options.min = parseInt(options.min);
        options.max = parseInt(options.max)
        if (Number.isNaN(options.min)) {
          options.min = 0;
        }
        if (Number.isNaN(options.max) || options.min > options.max){
          options.max = options.min + 100;
        }
        this.set(options);
      },
      questionType: "ShortAnswer", 
      questionText: "Short Answer"
    });


})();
