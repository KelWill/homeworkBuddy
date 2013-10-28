/*global homeworkBuddy, Backbone, JST*/

homeworkBuddy.Views = homeworkBuddy.Views || {};

(function () {
    'use strict';

    homeworkBuddy.Views.HwviewView = Backbone.View.extend({

        template: JST['app/scripts/templates/HWView.ejs']

    });

})();
