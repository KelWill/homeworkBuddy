/*global homeworkBuddy, Backbone, JST*/

homeworkBuddy.Views = homeworkBuddy.Views || {};

(function () {
    'use strict';

    homeworkBuddy.Views.QuestionsetviewView = Backbone.View.extend({

        template: JST['app/scripts/templates/QuestionSetView.ejs']

    });

})();
