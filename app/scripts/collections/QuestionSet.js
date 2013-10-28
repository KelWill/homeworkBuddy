/*global homeworkBuddy, Backbone*/

homeworkBuddy.Collections = homeworkBuddy.Collections || {};

(function () {
    'use strict';

    homeworkBuddy.Collections.QuestionsetCollection = Backbone.Collection.extend({

        model: homeworkBuddy.Models.QuestionsetModel

    });

})();
