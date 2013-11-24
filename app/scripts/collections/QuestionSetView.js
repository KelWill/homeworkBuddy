/*global homeworkBuddy, Backbone*/

homeworkBuddy.Collections = homeworkBuddy.Collections || {};

(function () {
    'use strict';

    homeworkBuddy.Collections.QuestionsetviewCollection = Backbone.Collection.extend({

        model: homeworkBuddy.Models.QuestionsetviewModel

    });

})();
