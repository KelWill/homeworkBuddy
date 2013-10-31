/*global homeworkBuddy, Backbone*/

homeworkBuddy.Collections = homeworkBuddy.Collections || {};

(function () {
    'use strict';
    

    homeworkBuddy.Collections.QuestionSet = Backbone.Collection.extend({
        addMC: function(){
          this.add(new homeworkBuddy.Models.MCCreationModel());
        }, 
        addShortAnswer: function(){
          this.add(new homeworkBuddy.Models.ShortAnswerCreationModel());
        }, 
        addFillBlank: function(){
          this.add(new homeworkBuddy.Models.FillBlankCreationModel());
        },

        initialize: function(){
          this.count = 1;
          this.on('add', function(model){
            model.set('number', this.count);
            this.count++;
          }, this);
        }
    });

})();
