/*global homeworkBuddy, Backbone*/

homeworkBuddy.Collections = homeworkBuddy.Collections || {};

(function () {
    'use strict';

    homeworkBuddy.Collections.QuestionSetCollection = Backbone.Collection.extend({
        addMC: function(){
          this.add(new homeworkBuddy.Models.MCCreationModel());
        }, 
        addShortAnswer: function(){
          this.add(new homeworkBuddy.Models.ShortAnswerCreationModel());
        }, 
        addFillBlank: function(){
          this.add(new homeworkBuddy.Models.FillBlankCreationModel());
        }
    
    });

})();
