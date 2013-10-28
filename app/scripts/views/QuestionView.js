/*global homeworkBuddy, Backbone, JST*/

homeworkBuddy.Views = homeworkBuddy.Views || {};

(function () {
    'use strict';

    homeworkBuddy.Views.QuestionviewView = Backbone.View.extend({

        template: JST['app/scripts/templates/QuestionView.ejs']

    });

})();
