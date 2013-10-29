/*global homeworkBuddy, Backbone*/

homeworkBuddy.Collections = homeworkBuddy.Collections || {};

(function () {
    'use strict';

    homeworkBuddy.Collections.QuestionSetCollection = Backbone.Collection.extend({
        model: homeworkBuddy.Models.QuestionModel
    
    });

})();
